import "phaser";
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { GamePlay } from "./scenes/GamePlay";
import { Shop } from "./scenes/Shop";
import SplashScreen from "./scenes/SplashScreen";

/**
 * @class Game
 * @description Create the game canvas with respective options that are given
 */
class Game extends Phaser.Game {
  /**
   * @constructor
   * @description Create a new instance of this class.
   */
  constructor() {
    const game_config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL, // Use Renderer WebGL.
      width: 800,
      height: 480,
      parent: "content", // Use custom div element as parent.
      scene: [SplashScreen, GamePlay, Shop], // Scenes.
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

    // Initialize Firebase.
    const firebaseConfig = {
      apiKey: "AIzaSyDKeJo8HZ9lrOY3faPvAyyoDcWNVp68BKE",
      authDomain: "tappyplane-b349f.firebaseapp.com",
      projectId: "tappyplane-b349f",
      storageBucket: "tappyplane-b349f.appspot.com",
      messagingSenderId: "720362866065",
      appId: "1:720362866065:web:313e8e6add852baf248630",
      measurementId: "G-XTTSG1N422"
    };
    const app: FirebaseApp = initializeApp(firebaseConfig);
    getAnalytics(app);
  }
}

// Create the game object once window loaded.
window.onload = () => {
  new Game();
};
