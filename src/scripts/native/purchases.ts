import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { isNativeApp } from "./platform";

/**
 * Same consumable product ids the Cordova shop registered with CdvPurchase.
 * n is 2, 4, 6, or 8.
 */
export function scoreProductId(multiplier: number): string {
  return "com.doyban.flyingplane.scorex" + multiplier;
}

const SCORE_MULTIPLIERS: number[] = [2, 4, 6, 8];

/**
 * Warm the store catalog. The browser build skips this so a missing plugin cannot throw.
 */
export function registerScoreMultiplierProducts(): void {
  if (!isNativeApp() || !Capacitor.isPluginAvailable("NativePurchases")) {
    return;
  }

  const identifiers: string[] = [];
  for (let i = 0; i < SCORE_MULTIPLIERS.length; i++) {
    identifiers.push(scoreProductId(SCORE_MULTIPLIERS[i]));
  }

  NativePurchases.getProducts({
    productIdentifiers: identifiers,
    productType: PURCHASE_TYPE.INAPP,
  }).catch(function () {
    // The shop can still order a product id if the catalog request fails.
  });
}

/**
 * Buy a score multiplier and, once the store approves it, store the rate and finish the consumable.
 * The previous shell only initialized the Apple App Store. This plugin bills the store on the device
 * (App Store on iOS, Play on Android) for the same product ids.
 */
export function purchaseScoreMultiplier(multiplier: number): void {
  if (!isNativeApp() || !Capacitor.isPluginAvailable("NativePurchases")) {
    return;
  }

  const productId = scoreProductId(multiplier);

  NativePurchases.purchaseProduct({
    productIdentifier: productId,
    productType: PURCHASE_TYPE.INAPP,
    quantity: 1,
    isConsumable: true,
  }).then(function (transaction) {
    localStorage.scoreRate = multiplier;

    if (Capacitor.getPlatform() === "ios" && transaction.transactionId) {
      return NativePurchases.finishTransaction({
        transactionId: transaction.transactionId,
      });
    }
    return Promise.resolve();
  }).catch(function () {
    // Cancelled or unavailable purchases leave scoreRate unchanged.
  });
}
