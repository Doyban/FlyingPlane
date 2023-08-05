export declare const CordovaService = "AdMob";
export type CordovaAction = 'adCreate' | 'adHide' | 'adIsLoaded' | 'adLoad' | 'adShow' | 'bannerConfig' | 'configure' | 'ready' | 'start' | 'webviewGoto';
export declare enum Events {
    adClick = "admob.ad.click",
    adDismiss = "admob.ad.dismiss",
    adImpression = "admob.ad.impression",
    adLoad = "admob.ad.load",
    adLoadFail = "admob.ad.loadfail",
    adReward = "admob.ad.reward",
    adShow = "admob.ad.show",
    adShowFail = "admob.ad.showfail",
    bannerSize = "admob.banner.size",
    ready = "admob.ready"
}
export declare const enum Platform {
    android = "android",
    ios = "ios"
}
/**
 * An enum that represents the maximum ad content rating for an app or ad request.
 * @enum {string}
 */
type MaxAdContentRating = /** Content suitable for general audiences, including families. */ 'G' | /** Content suitable only for mature audiences. */ 'MA' | /** Content suitable for most audiences with parental guidance. */ 'PG' | /** Content suitable for teen and older audiences. */ 'T' | /** Content suitability is unspecified. */ '';
export interface RequestConfig {
    maxAdContentRating?: MaxAdContentRating;
    sameAppKey?: boolean;
    tagForChildDirectedTreatment?: boolean | null;
    tagForUnderAgeOfConsent?: boolean | null;
    testDeviceIds?: string[];
}
export interface AdMobConfig extends RequestConfig {
    appMuted?: boolean;
    appVolume?: number;
}
/** @internal */
export declare function execAsync<T>(action: CordovaAction, args?: unknown[]): Promise<T>;
export {};
