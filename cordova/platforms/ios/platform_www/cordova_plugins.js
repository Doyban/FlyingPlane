cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-facebook-connect.FacebookConnectPlugin",
      "file": "plugins/cordova-plugin-facebook-connect/www/facebook-native.js",
      "pluginId": "cordova-plugin-facebook-connect",
      "clobbers": [
        "facebookConnectPlugin"
      ]
    },
    {
      "id": "admob-plus-cordova.AdMob",
      "file": "plugins/admob-plus-cordova/www/admob.js",
      "pluginId": "admob-plus-cordova",
      "clobbers": [
        "admob"
      ]
    },
    {
      "id": "cordova-plugin-customurlscheme.LaunchMyApp",
      "file": "plugins/cordova-plugin-customurlscheme/www/ios/LaunchMyApp.js",
      "pluginId": "cordova-plugin-customurlscheme",
      "clobbers": [
        "window.plugins.launchmyapp"
      ]
    },
    {
      "id": "cordova-plugin-purchase.CdvPurchase",
      "file": "plugins/cordova-plugin-purchase/www/store.js",
      "pluginId": "cordova-plugin-purchase",
      "clobbers": [
        "CdvPurchase",
        "store"
      ]
    },
    {
      "id": "es6-promise-plugin.Promise",
      "file": "plugins/es6-promise-plugin/www/promise.js",
      "pluginId": "es6-promise-plugin",
      "runs": true
    },
    {
      "id": "cordova-plugin-x-socialsharing.SocialSharing",
      "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
      "pluginId": "cordova-plugin-x-socialsharing",
      "clobbers": [
        "window.plugins.socialsharing"
      ]
    },
    {
      "id": "cordova-plugin-buildinfo.BuildInfo",
      "file": "plugins/cordova-plugin-buildinfo/www/buildinfo.js",
      "pluginId": "cordova-plugin-buildinfo",
      "clobbers": [
        "BuildInfo"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "cordova-plugin-browsertab.BrowserTab",
      "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
      "pluginId": "cordova-plugin-browsertab",
      "clobbers": [
        "cordova.plugins.browsertab"
      ]
    },
    {
      "id": "cordova-universal-links-plugin.universalLinks",
      "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
      "pluginId": "cordova-universal-links-plugin",
      "clobbers": [
        "universalLinks"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-facebook-connect": "3.2.0",
    "admob-plus-cordova": "2.0.0-alpha.8",
    "cordova-plugin-customurlscheme": "5.0.2",
    "cordova-plugin-purchase": "13.6.0",
    "es6-promise-plugin": "4.2.2",
    "cordova-plugin-x-socialsharing": "6.0.4",
    "cordova-plugin-buildinfo": "4.0.0",
    "cordova-plugin-inappbrowser": "5.0.0",
    "cordova-plugin-compat": "1.2.0",
    "cordova-plugin-browsertab": "0.2.0",
    "cordova-plugin-androidx": "3.0.0",
    "cordova-universal-links-plugin": "1.2.1"
  };
});