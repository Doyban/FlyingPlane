/**
 * @class SoundHandler
 * @description Handles all the sounds
 */
export class SoundHandler {
    private scene: Phaser.Scene = new Phaser.Scene('');

    /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {Phaser.Scene} scene Scene object.
   */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Event listeners.
        this.scene.events.on("play_sound", this.onPlaySound, this);
        this.scene.events.on("stop_sound", this.onStopSound, this);
    }

    /**
     * @access private
     * @callback onPlaySound
     * @description Listens to play sound event.
     * @param {string} key Event unique key to realize which event has been fired.
     * @param {Phaser.Types.Sound.SoundConfig} options Configuration options for sound event.
     * @returns {void}
     */
    private onPlaySound(key: string, options: Phaser.Types.Sound.SoundConfig): void {
        this.scene.sound.play(key, options); // Play sound with given key and options.
    }

    /**
     * @access private
     * @callback onPlaySound
     * @description Listens to stop play sound event.
     * @returns {void}
     */
    private onStopSound(): void {
        this.scene.sound.stopAll(); // Stop all the sounds in the game.
    }
}
