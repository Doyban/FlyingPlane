/**
 * @class Plane
 * @description Renders splash screen.
 * @extends Phaser.Scene
 */
export default class SplashScreen extends Phaser.Scene {
  private gameName: Phaser.GameObjects.Container | null = null;

  /**
   * @constructor
   * @description Create a new instance of this class.
   */
  constructor() {
    super({
      key: "splash_screen",
    });
  }

  /**
   * @access public
   * @description Method called before scene is created. Preload all necessary assets for this scene.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */
  public preload(): void {
    this.load.image("background", "assets/images/background.png");
    this.load.atlas(
      "sheet",
      "assets/spritesheets/sheet.png",
      "assets/json/sheet.json"
    );
  }

  /**
   * @access public
   * @description Method called once scene is created. Create necessary elements.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  public create(): void {
    // Set game dimensions as positive integers of game config's dimensions.
    const game_width = Number(+this.game.config.width);
    const game_height = Number(+this.game.config.height);

    this.createBackground(); // Create background image.

    this.gameName = this.add.container(game_width / 2, game_height / 2); // Create a container to make the game name letters a collective.

    // Set game properties.
    this.gameName.setScale(0);
    this.gameName.setAlpha(0);
    this.createGameName("TappyPlane");

    this.startGameNameAnimation(); // Start tween animation of a game name.
  }

  /**
   * @access private
   * @description Creates background image of the game.
   * @function createBackground
   * @returns {Phaser.GameObjects.Image} background
   */
  private createBackground(): Phaser.GameObjects.Image {
    const background: Phaser.GameObjects.Image = this.add.image(
      0,
      0,
      "background"
    );

    background.setName("background");
    background.setOrigin(0);

    return background;
  }

  /**
   * @access private
   * @description Creates the text game objects by using the name that is passed to the function.
   * @function createGameName
   * @param {string} name Name of the game to be displayed on the SplashScreen.
   * @returns {void}
   */
  private createGameName(name: string): void {
    const game_name: string = name;
    const game_name_array: string[] = game_name.split("");
    const game_name_length: number = game_name_array.length;
    const _y: number = 0;
    let _x: number = 0 - (game_name_length / 2) * 45;

    // Iterate through each letter and add it to the SplashScreen.
    for (let i = 0; i < game_name_length; i++) {
      const letter: string = game_name_array[i].toUpperCase(); // Set the letter to upper case.
      const letter_text: Phaser.GameObjects.Image = this.add.image(
        _x,
        _y,
        "sheet",
        `letter${letter}.png`
      ); // Map the letter to associated letter image.

      if (this.gameName) this.gameName.add(letter_text); // Add individual letter to the container.
      _x += 45; // Once score length expands then make some space for next letters.
    }
  }

  /**
   * @access private
   * @description Play tween animation on for game name.
   * @function startGameNameAnimation
   * @returns {void}
   */
  private startGameNameAnimation(): void {
    this.tweens.add({
      targets: this.gameName,
      ease: "Bounce.easeOut",
      scaleX: 1,
      scaleY: 1,
      alpha: { value: 1 },
      onComplete: this.onGameAnimationComplete, // Callback method.
      onCompleteScope: this, // Context which is a reference to SplashScreen object in this case.
    });
  }

  /**
   * @access private
   * @callback onGameAnimationComplete
   * @description Listens to the on complete event of tween animation on for game name.
   * @returns {void}
   */
  private onGameAnimationComplete(): void {
    this.time.delayedCall(
      2000, // Delay of the fade out.
      () => {
        // Fade out animation of SplashScreen to start the game.
        this.cameras.main.fadeOut(
          2000, // Duration of the fade out.
          undefined, // Red color intensivity (values 0-255).
          undefined, // Green color intensivity (values 0-255).
          undefined, // Blue color intensivity (values 0-255).
          () => {
            // Start game play scene by shutting down the current scene.
            this.scene.start("game_play", {
              backgroundImage: this.children.getByName("background"),
            });
          },
          this // Context which is a reference to SplashScreen object in this case.
        );
      },
      [],
      this // Context which is a reference to SplashScreen object in this case.
    );
  }
}
