import { MobileAd, MobileAdOptions } from './base';
export declare enum AppOpenAdOrientation {
    Portrait = 1,
    PortraitUpsideDown = 2,
    LandscapeRight = 3,
    LandscapeLeft = 4
}
export declare class AppOpenAd extends MobileAd<MobileAdOptions & {
    orientation: AppOpenAdOrientation;
}> {
    static readonly cls = "AppOpenAd";
    static readonly Orientation: typeof AppOpenAdOrientation;
    isLoaded(): Promise<boolean>;
    load(): Promise<void>;
    show(): Promise<boolean>;
}
