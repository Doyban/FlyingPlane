import { Capacitor } from "@capacitor/core";

/**
 * Native plugin calls are no-ops in the webpack browser build.
 * Capacitor reports the browser as the web platform and does not inject a bridge.
 */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

export function isIosApp(): boolean {
  return Capacitor.getPlatform() === "ios";
}

export function isAndroidApp(): boolean {
  return Capacitor.getPlatform() === "android";
}

export function hasPlugin(name: string): boolean {
  return Capacitor.isPluginAvailable(name);
}
