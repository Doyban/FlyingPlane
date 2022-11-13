import { Scene } from "phaser";

/**
 * @class SoundHandler
 * @description Handles all the sounds 
 */
export class SoundHandler {
    private scene : Phaser.Scene
    constructor (scene : Phaser.Scene) {
        this.scene = scene;

        this.scene.events.on("play_sound", this.onPlaySound, this);
        this.scene.events.on("stop_sound", this.onStopSound, this);
    }

    private onPlaySound (key : string, options : Phaser.Types.Sound.SoundConfig) : void {
        this.scene.sound.play(key, options)
    }

    private onStopSound () : void {
        this.scene.sound.stopAll();
    }
}