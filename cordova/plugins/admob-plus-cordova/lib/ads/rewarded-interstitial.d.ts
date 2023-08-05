import { RewardedAdOptions } from './rewarded';
import { MobileAd } from './base';
export type RewardedInterstitialAdOptions = RewardedAdOptions;
export declare class RewardedInterstitialAd extends MobileAd<RewardedInterstitialAdOptions> {
    static readonly cls = "RewardedInterstitialAd";
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<unknown>;
}
