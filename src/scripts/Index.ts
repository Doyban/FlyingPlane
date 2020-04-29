import "phaser";
import { GamePlay } from "./scenes/GamePlay";
import SplashScreen from "./scenes/SplashScreen";

/**
 * @class Game
 * @description Create the game canvas with respective options that are given
 */
class Game extends Phaser.Game {
  constructor() {
    const game_config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL, // Use Renderer WebGL.
      width: 800,
      height: 480,
      parent: "content", // Use custom div element as parent.
      scene: [SplashScreen, GamePlay], // the scenes.
      // Add ScaleManager for responsiveness.
      scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
      },
      // Add matter physics.
      physics: {
        default: "matter",
      },
      backgroundColor: "#D5EDF7", // Add default background color to the game.
    };
    super(game_config);
  }
}

// Create the game object once window loaded.
window.onload = () => {
  new Game();
};
