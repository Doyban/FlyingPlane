"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdMob = void 0;
var ads = __importStar(require("./ads"));
var common_1 = require("./common");
__exportStar(require("./ads"), exports);
__exportStar(require("./common"), exports);
var AdMob = /** @class */ (function () {
    function AdMob() {
        this.AppOpenAd = ads.AppOpenAd;
        this.BannerAd = ads.BannerAd;
        this.InterstitialAd = ads.InterstitialAd;
        this.NativeAd = ads.NativeAd;
        this.RewardedAd = ads.RewardedAd;
        this.RewardedInterstitialAd = ads.RewardedInterstitialAd;
        this.WebViewAd = ads.WebViewAd;
        this.Events = common_1.Events;
    }
    AdMob.prototype.configure = function (config) {
        return (0, common_1.execAsync)('configure', [config]);
    };
    AdMob.prototype.start = function () {
        var _a;
        return ((_a = this._startPromise) !== null && _a !== void 0 ? _a : (this._startPromise = this._start()));
    };
    AdMob.prototype._start = function () {
        return (0, common_1.execAsync)('start');
    };
    return AdMob;
}());
exports.AdMob = AdMob;
exports.default = AdMob;
//# sourceMappingURL=index.js.map