import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { completePendingAppleRedirect } from "./auth";
import { hasPlugin, isNativeApp } from "./platform";

/**
 * Hide the status bar and keep universal-link / custom-scheme opens inside the app.
 * Failures are swallowed so the browser dev server can boot with no native bridge.
 */
export function prepareNativeShell(): void {
  completePendingAppleRedirect();

  if (!isNativeApp()) {
    return;
  }

  if (hasPlugin("StatusBar")) {
    StatusBar.hide().catch(function () {
      return undefined;
    });
    StatusBar.setOverlaysWebView({ overlay: true }).catch(function () {
      return undefined;
    });
  }

  if (hasPlugin("App")) {
    App.addListener("appUrlOpen", function () {
      completePendingAppleRedirect();
    }).catch(function () {
      return undefined;
    });
  }
}

export function exitApp(): void {
  if (!isNativeApp() || !hasPlugin("App")) {
    return;
  }

  App.exitApp().catch(function () {
    return undefined;
  });
}
