// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
export enum NativeActions {
  adCreate = 'adCreate',
  adHide = 'adHide',
  adIsLoaded = 'adIsLoaded',
  adLoad = 'adLoad',
  adShow = 'adShow',
  bannerConfig = 'bannerConfig',
  bannerHide = 'bannerHide',
  bannerLoad = 'bannerLoad',
  bannerShow = 'bannerShow',
  configRequest = 'configRequest',
  configure = 'configure',
  interstitialIsLoaded = 'interstitialIsLoaded',
  interstitialLoad = 'interstitialLoad',
  interstitialShow = 'interstitialShow',
  ready = 'ready',
  requestTrackingAuthorization = 'requestTrackingAuthorization',
  rewardedInterstitialIsLoaded = 'rewardedInterstitialIsLoaded',
  rewardedInterstitialLoad = 'rewardedInterstitialLoad',
  rewardedInterstitialShow = 'rewardedInterstitialShow',
  rewardedIsLoaded = 'rewardedIsLoaded',
  rewardedLoad = 'rewardedLoad',
  rewardedShow = 'rewardedShow',
  setAppMuted = 'setAppMuted',
  setAppVolume = 'setAppVolume',
  start = 'start',
}

export enum Events {
  adClick = 'admob.ad.click',
  adDismiss = 'admob.ad.dismiss',
  adImpression = 'admob.ad.impression',
  adLoad = 'admob.ad.load',
  adLoadFail = 'admob.ad.loadfail',
  adReward = 'admob.ad.reward',
  adShow = 'admob.ad.show',
  adShowFail = 'admob.ad.showfail',
  bannerClick = 'admob.banner.click',
  bannerClose = 'admob.banner.close',
  bannerImpression = 'admob.banner.impression',
  bannerLoad = 'admob.banner.load',
  bannerLoadFail = 'admob.banner.loadfail',
  bannerOpen = 'admob.banner.open',
  bannerSize = 'admob.banner.size',
  bannerSizeChange = 'admob.banner.sizechange',
  interstitialDismiss = 'admob.interstitial.dismiss',
  interstitialImpression = 'admob.interstitial.impression',
  interstitialLoad = 'admob.interstitial.load',
  interstitialLoadFail = 'admob.interstitial.loadfail',
  interstitialShow = 'admob.interstitial.show',
  interstitialShowFail = 'admob.interstitial.showfail',
  ready = 'admob.ready',
  rewardedDismiss = 'admob.rewarded.dismiss',
  rewardedImpression = 'admob.rewarded.impression',
  rewardedInterstitialDismiss = 'admob.rewardedi.dismiss',
  rewardedInterstitialImpression = 'admob.rewardedi.impression',
  rewardedInterstitialLoad = 'admob.rewardedi.load',
  rewardedInterstitialLoadFail = 'admob.rewardedi.loadfail',
  rewardedInterstitialReward = 'admob.rewardedi.reward',
  rewardedInterstitialShow = 'admob.rewardedi.show',
  rewardedInterstitialShowFail = 'admob.rewardedi.showfail',
  rewardedLoad = 'admob.rewarded.load',
  rewardedLoadFail = 'admob.rewarded.loadfail',
  rewardedReward = 'admob.rewarded.reward',
  rewardedShow = 'admob.rewarded.show',
  rewardedShowFail = 'admob.rewarded.showfail',
}

export enum AdSizeType {
  BANNER,
  LARGE_BANNER,
  MEDIUM_RECTANGLE,
  FULL_BANNER,
  LEADERBOARD,
  SMART_BANNER,
}

export const execAsync = (action: NativeActions, args?: any[]) => {
  return new Promise((resolve, reject) => {
    cordova.exec(resolve, reject, 'AdMob', action, args)
  })
}

export function waitEvent(
  successEvent: string,
  failEvent = '',
): Promise<CustomEvent> {
  return new Promise((resolve, reject) => {
    document.addEventListener(
      successEvent as any,
      (event: CustomEvent) => {
        resolve(event)
      },
      false,
    )

    if (failEvent) {
      document.addEventListener(
        failEvent as any,
        (failedEvent: CustomEvent) => {
          reject(failedEvent)
        },
        false,
      )
    }
  })
}

export const initPlugin = () => {
  document.addEventListener(
    'deviceready',
    () => {
      cordova.exec(
        (event) => {
          cordova.fireDocumentEvent(event.type, event.data)
        },
        console.error,
        'AdMob',
        NativeActions.ready,
      )
    },
    false,
  )
}
