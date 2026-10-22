/**
 * Capacitor substitutes Cordova plugin variables from plugin.xml defaults only.
 * cordova-plugin-facebook-connect ships APP_ID / APP_NAME without defaults, so
 * `npx cap sync` would write a FacebookContentProvider authority of "undefined".
 * This stamps the existing app id and name before sync. It does not invent ids.
 */
const fs = require("fs");
const path = require("path");

const pluginRoot = path.join(
  __dirname,
  "..",
  "node_modules",
  "cordova-plugin-facebook-connect"
);
const pluginXmlPath = path.join(pluginRoot, "plugin.xml");
const facebookValuesPath = path.join(
  pluginRoot,
  "src",
  "android",
  "facebookconnect.xml"
);

const APP_ID = "757927572827959";
const APP_NAME = "FlyingPlane";

function stripBrokenPlistBlocks(xml) {
  // plugin.xml 3.2.0 leaves literal PLACEHOLDER tokens in the iOS plist instructions.
  // The Capacitor Info.plist carries the real Facebook values instead.
  return xml.replace(
    /<config-file target="\*-Info\.plist" parent="(?:FacebookUrlSchemeSuffix|FacebookAutoLogAppEventsEnabled_PLACEHOLDER|FacebookAdvertiserIDCollectionEnabled_PLACEHOLDER|CFBundleURLTypes)">[\s\S]*?<\/config-file>\s*/g,
    ""
  );
}

function patchPluginXml(xml) {
  const withDefaults = xml
    .replace(
      '<preference name="APP_ID" />',
      '<preference name="APP_ID" default="' + APP_ID + '" />'
    )
    .replace(
      '<preference name="APP_ID" default="" />',
      '<preference name="APP_ID" default="' + APP_ID + '" />'
    )
    .replace(
      '<preference name="APP_NAME" />',
      '<preference name="APP_NAME" default="' + APP_NAME + '" />'
    )
    .replace(
      '<preference name="APP_NAME" default="" />',
      '<preference name="APP_NAME" default="' + APP_NAME + '" />'
    );
  return stripBrokenPlistBlocks(withDefaults);
}

function facebookValuesXml() {
  return (
    "<?xml version='1.0' encoding='utf-8'?>\n" +
    "<resources>\n" +
    '    <string name="fb_app_id">' + APP_ID + "</string>\n" +
    '    <string name="fb_app_name">' + APP_NAME + "</string>\n" +
    '    <bool name="fb_auto_log_app_events_enabled">true</bool>\n' +
    '    <bool name="fb_hybrid_app_events">false</bool>\n' +
    '    <bool name="fb_advertiser_id_collection_enabled">true</bool>\n' +
    "</resources>\n"
  );
}

if (!fs.existsSync(pluginXmlPath)) {
  process.exit(0);
}

const pluginXml = fs.readFileSync(pluginXmlPath, "utf8");
const patched = patchPluginXml(pluginXml);
if (patched !== pluginXml) {
  fs.writeFileSync(pluginXmlPath, patched);
}

if (fs.existsSync(path.dirname(facebookValuesPath))) {
  fs.writeFileSync(facebookValuesPath, facebookValuesXml());
}

// Capacitor 8 generates an SPM wrapper for this Cordova plugin and drops its CocoaPods spec.
// Link the same Facebook iOS SDK version the Cordova shell used (11.1.0).
const facebookSpmPackage = path.join(
  __dirname,
  "..",
  "ios",
  "capacitor-cordova-ios-plugins",
  "sources",
  "CordovaPluginFacebookConnect",
  "Package.swift"
);
if (fs.existsSync(facebookSpmPackage)) {
  let swiftPackage = fs.readFileSync(facebookSpmPackage, "utf8");
  if (swiftPackage.indexOf("facebook-ios-sdk") === -1) {
    swiftPackage = swiftPackage.replace(
      '.package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.5.3")',
      '.package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.5.3"),\n' +
        '        .package(url: "https://github.com/facebook/facebook-ios-sdk", exact: "11.1.0")'
    );
    swiftPackage = swiftPackage.replace(
      '.product(name: "Cordova", package: "capacitor-swift-pm")',
      '.product(name: "Cordova", package: "capacitor-swift-pm"),\n' +
        '                .product(name: "FacebookCore", package: "Facebook"),\n' +
        '                .product(name: "FacebookLogin", package: "Facebook"),\n' +
        '                .product(name: "FacebookShare", package: "Facebook"),\n' +
        '                .product(name: "FacebookGamingServices", package: "Facebook")'
    );
    fs.writeFileSync(facebookSpmPackage, swiftPackage);
  }
}
