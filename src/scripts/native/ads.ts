import { AdMob, InterstitialAdPluginEvents } from "@capacitor-community/admob";
import { isIosApp, isNativeApp, hasPlugin } from "./platform";

/**
 * Existing interstitial unit. App ids live in the native projects, not here.
 */
const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-4865595196880143/1957466653";

let admobReady = false;
let interstitialPrepared = false;

function prepareNextInterstitial(): Promise<void> {
  return AdMob.prepareInterstitial({
    adId: INTERSTITIAL_AD_UNIT_ID,
  }).then(function () {
    interstitialPrepared = true;
  }).catch(function () {
    interstitialPrepared = false;
  });
}

/**
 * Show the game-over interstitial when the native AdMob plugin is present.
 * Cordova waited for deviceready, which does not fire under Capacitor; the bridge is already up
 * by the time gameplay can reach the game-over screen.
 */
export function showInterstitialAd(): void {
  if (!isNativeApp() || !hasPlugin("AdMob")) {
    return;
  }

  let ready: Promise<void>;
  if (admobReady) {
    ready = Promise.resolve();
  } else {
    ready = Promise.resolve().then(function () {
      if (isIosApp()) {
        return AdMob.requestTrackingAuthorization().catch(function () {
          return undefined;
        });
      }
      return undefined;
    }).then(function () {
      return AdMob.initialize();
    }).then(function () {
      return AdMob.addListener(InterstitialAdPluginEvents.Dismissed, function () {
        interstitialPrepared = false;
        prepareNextInterstitial();
      });
    }).then(function () {
      admobReady = true;
    });
  }

  ready.then(function () {
    if (interstitialPrepared) {
      return Promise.resolve();
    }
    return prepareNextInterstitial();
  }).then(function () {
    if (!interstitialPrepared) {
      return;
    }
    return AdMob.showInterstitial();
  }).then(function () {
    interstitialPrepared = false;
  }).catch(function () {
    interstitialPrepared = false;
  });
}
