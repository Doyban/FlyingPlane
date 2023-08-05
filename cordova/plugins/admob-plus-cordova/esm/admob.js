import * as cordova from 'cordova';
import channel from 'cordova/channel';
import exec from 'cordova/exec';
import { AdMob } from './index';
import { MobileAd } from './ads/base';
import { CordovaService } from './common';
var admob = new AdMob();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onMessageFromNative(event) {
    var data = event.data;
    if (data && data.adId) {
        data.ad = MobileAd.getAdById(data.adId);
    }
    cordova.fireDocumentEvent(event.type, data);
}
var feature = 'onAdMobPlusReady';
channel.createSticky(feature);
channel.waitForInitialization(feature);
channel.onCordovaReady.subscribe(function () {
    var action = 'ready';
    exec(onMessageFromNative, console.error, CordovaService, action, []);
    channel.initializationComplete(feature);
});
export default admob;
//# sourceMappingURL=admob.js.map