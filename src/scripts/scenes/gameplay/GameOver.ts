import { GAME_OVER, UI_ICONS_SCALE_FACTOR } from "../../utils/GameConstants";

/**
 * @description Contains the properties that are needed by @class GameOver.
 * @interface GameOverDesignConfig
 */
interface GameOverDesignConfig {
  x: number;
  y: number;
}

/**
 * @class GameOver
 * @description Creates the GameOver screen with all the game objects needed and adds it to the scene.
 * @extends Phaser.GameObjects.Container
 */
export class GameOver extends Phaser.GameObjects.Container {
  private _x: number = 0;
  private _y: number = 0;
  private medals: Array<string> = [
    "medalBronze.png",
    "medalSilver.png",
    "medalGold.png",
  ];

  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {Phaser.Scene} scene Scene object.
   * @param {GameOverDesignConfig} config Configuration interface.
   */
  constructor(scene: Phaser.Scene, config: GameOverDesignConfig) {
    super(scene, config.x, config.y);

    this.scene.add.existing(this); // Add this game object to the scene.
    this.setName(GAME_OVER); // Set name for GameOver object.

    this._x = config.x; // Store the 'x' value that is given at initial creation time.
    this._y = config.y; // Store the 'y' value that is given at initial creation time.

    /* Set rendering order of this scene. */
    this.setDepth(4); // Depth of this game object within this scene (rendering position), also known as 'z-index' in CSS.

    // GameOver background.
    const game_over_background: Phaser.GameObjects.Image = this.createGameOverBackground();
    this.add(game_over_background);

    // GameOver title.
    const game_over_title = this.createGameOverTitle();
    this.add(game_over_title);

    // Retry button.
    const retry_button = this.createRetryButton();
    this.add(retry_button);

    // Retry text on button.
    const retry_text = this.createRetryText();
    this.add(retry_text);

    // Create badge1.
    const badge_1 = this.createBadge(-80, -40, "badge_1");
    this.add(badge_1);

    // Create badge2.
    const badge_2 = this.createBadge(0, -70, "badge_2");
    this.add(badge_2);

    // Create badge3.
    const badge_3 = this.createBadge(80, -40, "badge_3");
    this.add(badge_3);

    // Create home button.
    this.createHomeButton();

    // Create share button.
    this.createShareButton();

    this.scene.events.on("gameOver", this.onGameOver, this); // Event listener.
    this.setVisible(false); // By default set the scene to be invisible.
  }

  /**
   * @access private
   * @description Create background.
   * @function createGameOverBackground
   * @returns {Phaser.GameObjects.Image} background_image
   */
  private createGameOverBackground(): Phaser.GameObjects.Image {
    const x: number = 0;
    const y: number = 0;
    const texture: string = "sheet";
    const frame: string = "UIbg.png";

    const background_image: Phaser.GameObjects.Image = this.scene.add.image(
      x,
      y,
      texture,
      frame
    );
    background_image.setName("backgroundImage");

    return background_image;
  }

  /**
   * @access private
   * @description Create title.
   * @function createGameOverTitle
   * @returns {Phaser.GameObjects.Image} game_over_title
   */
  private createGameOverTitle(): Phaser.GameObjects.Image {
    const x: number = 0;
    const y: number = -150;
    const texture: string = "sheet";
    const frame: string = "textGameOver.png";

    const game_over_title: Phaser.GameObjects.Image = this.scene.add.image(
      x,
      y,
      texture,
      frame
    );
    game_over_title.setName("gameOverTitle");

    return game_over_title;
  }

  /**
   * @access private
   * @description Create retry button.
   * @function createRetryButton
   * @returns {Phaser.GameObjects.Sprite} retry_button
   */
  private createRetryButton(): Phaser.GameObjects.Sprite {
    const background_image: any = this.getByName("backgroundImage"); // Get the desired object by name.
    const x: number = 0;
    const y: number = background_image.height / 2;
    const texture: string = "sheet";
    const frame: string = "buttonLarge.png";

    const retry_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(
      x,
      y,
      texture,
      frame
    );
    retry_button.setName("retryButton");

    // Use the hand cursor for retry button.
    retry_button.setInteractive({
      useHandCursor: true,
    });

    retry_button.on("pointerdown", this.onRetry, this); // Event listener.

    return retry_button;
  }

  /**
   * @access private
   * @description Listens to retry game event.
   * @function onRetry
   * @returns {void}
   */
  private onRetry(): void {
    // Emit "play_sound" and "click" events on this scene.
    this.scene.events.emit("play_sound", "click", {
      volume: 1
    });

    // Set up retry button.
    const retry_button: Phaser.GameObjects.GameObject = this.getByName(
      "retryButton"
    ); // Get the desired object by name.
    retry_button.disableInteractive(); // Disable retry button for input till animations complete.

    // Fade out animation of GameOver to restart the game.
    this.scene.cameras.main.fadeOut(
      2000, // Duration of the fade out.
      undefined, // Red color intensivity (values 0-255).
      undefined, // Green color intensivity (values 0-255).
      undefined, // Blue color intensivity (values 0-255).
      this.onFadeOut, // Callback method.
      this // Context which is a reference to GameOver object in this case.
    );
  }

  /**
   * @access private
   * @callback onFadeOut
   * @description Listens to fade out event of the main camera.
   * @param {any[]} args Array of arguments for fade out animation.
   * @returns {void}
   */
  private onFadeOut(...args: any[]): void {
    // Check if the animation is complete, i.e. reached 1 equivalent for progress of 100%.
    if (args[1] === 1) {
      // Fade in animation of GameOver to restart the game.
      this.scene.cameras.main.fadeIn(
        2000, // Duration of the fade in.
        undefined, // Red color intensivity (values 0-255).
        undefined, // Green color intensivity (values 0-255).
        undefined, // Blue color intensivity (values 0-255).
        this.onFadeIn, // Callback method.
        this // Context which is a reference to GameOver object in this case.
      );

      this.setVisible(false); // Set the retry screen to be invisible after the fade in animation is over.
      this.scene.events.emit("reset"); // Emit "reset" event to the Plane.
    }
  }

  /**
   * @access private
   * @callback onFadeIn
   * @description Listens to fade in event of the main camera.
   * @param {any[]} args Array of arguments for fade out animation.
   * @returns {void}
   */
  private onFadeIn(...args: any) {
    // Check if the animation is complete, i.e. reached 1 equivalent for progress of 100%.
    if (args[1] === 1) {
      this.setPosition(this._x, this._y); // Set up initial position.
    }
  }

  /**
   * @access private
   * @description Create retry button text.
   * @function createRetryText
   * @returns {Phaser.GameObjects.Text} retry_text
   */
  private createRetryText(): Phaser.GameObjects.Text {
    const background: any = this.getByName("backgroundImage"); // Get the desired object by name.
    const x: number = 0;
    const y: number = background.height / 2;
    const retry_text: Phaser.GameObjects.Text = this.scene.add.text(
      x,
      y - 5,
      "retry"
    );

    retry_text.setFont("Calistoga");
    retry_text.setFontSize(40);
    retry_text.setOrigin(0.5);

    return retry_text;
  }

  /**
   * @access private
   * @description Create badge and add it to the scene.
   * @function createBadge
   * @param {number} x Horizontal position to add the badge.
   * @param {number} y Vertical position to add the badge.
   * @param {string} name Name of the badge.
   * @returns {Phaser.GameObjects.Sprite} badge
   */
  private createBadge(
    x: number,
    y: number,
    name: string
  ): Phaser.GameObjects.Sprite {
    const badge: Phaser.GameObjects.Sprite = this.scene.add.sprite(
      x,
      y,
      "sheet",
      "medalBronze.png"
    );

    badge.setName(name); // Set name of the badge.
    badge.setVisible(false); // By default set badges to be invisible.

    return badge;
  }

  /**
   * @access private
   * @description Play tween animation on GameOver.
   * @function onGameOver
   * @returns {void}
   */
  private onGameOver(): void {
    // Tween animation of GameOver to show the badges and retry button.
    this.scene.tweens.add({
      targets: this,
      y: this.scene.data.get("gameHeight") / 2,
      duration: 2000,
      ease: "Bounce.easeOut",
      onStart: this.onGameOverStart, // Callback method.
      onStartScope: this, // Context which is a reference to GameOver object in this case.
      onComplete: this.onGameOverComplete, // Callback method.
      onCompleteScope: this, // Context which is a reference to GameOver object in this case.
      delay: 2000,
    });
  }

  /**
   * @access private
   * @callback onGameOverStart
   * @description Listens to the GameOver on start event.
   * @returns {void}
   */
  private onGameOverStart(): void {
    this.scene.events.emit("stop_sound"); // Emit "stop_sound" event on this scene.

    // Emit "play_sound" and "gameover" events on this scene.
    this.scene.events.emit("play_sound", "gameover", {
      delay: 1,
      volume: 1
    });

    const star_type: any = this.scene.data.get("medal"); // Get the star type.

    /* By default set the badges to be invisible. */
    // Badge 1.
    const badge_1: any = this.getByName("badge_1"); // Get the desired object by name.
    badge_1.setFrame(this.medals[star_type]);
    badge_1.setVisible(false);

    // Badge 2.
    const badge_2: any = this.getByName("badge_2"); // Get the desired object by name.
    badge_2.setFrame(this.medals[star_type]);
    badge_2.setVisible(false);

    // Badge 3.
    const badge_3: any = this.getByName("badge_3"); // Get the desired object by name.
    badge_3.setFrame(this.medals[star_type]);
    badge_3.setVisible(false);

    this.setVisible(true); // Once all badges are loaded make them visible.
  }

  /**
   * @access private
   * @callback onGameOverComplete
   * @description Listens to the GameOver on complete event.
   * @returns {void}
   */
  private onGameOverComplete(): void {
    // Set up retry button.
    const retry_button: Phaser.GameObjects.GameObject = this.getByName(
      "retryButton"
    ); // Get the desired object by name.
    retry_button.setInteractive(); // Enable retry button for input.

    // Play badge animation on badge1.
    const badge_1 = this.getByName("badge_1"); // Get the desired object by name.
    this.playBadgeTween(badge_1);

    // Play badge animation on badge2.
    const badge_2 = this.getByName("badge_2"); // Get the desired object by name.
    this.playBadgeTween(badge_2);

    // Play badge animation on badge3.
    const badge_3 = this.getByName("badge_3"); // Get the desired object by name.
    this.playBadgeTween(badge_3);

    this.showAdMobAds(); // Show ads.
  }

  /**
   * @access private
   * @description Play tween animation on the badge.
   * @function playBadgeTween
   * @param {Phaser.GameObjects.GameObject | Array<Phaser.GameObjects.GameObject>} target Targeted object to perform tween animation.
   * @returns {void}
   */
  private playBadgeTween(
    target: Phaser.GameObjects.GameObject | Array<Phaser.GameObjects.GameObject>
  ): void {
    const target_object: any = target;
    const target_name: string = target_object.name;
    const delay_variant = Number(target_name.split("_")[1]); // Split the "target_name" into array of substrings, "_" is the separator.

    // Play tween animation.
    this.scene.tweens.add({
      targets: target,
      duration: 100,
      scaleX: {
        from: 1,
        to: 0.5,
      },
      scaleY: {
        from: 1,
        to: 0.5,
      },
      onStart: this.onBadgeTweenStart, // Callback method.
      onStartScope: this, // Context which is a reference to GameOver object in this case.
      ease: "Sin.easeInOut",
      delay: 200 * delay_variant,
    });
  }

  /**
   * @access private
   * @callback onBadgeTweenStart
   * @description Listens to the badge tween start event.
   * @param {Array<any>} targets Array of targeted badges to play tween animation.
   * @returns {void}
   */
  private onBadgeTweenStart(
    tween: Phaser.Tweens.Tween, // Even though this parameter is not being used it must be here due to Phaser API and/or TypeScript type safety requirements.
    targets: Array<any>,
    params: any // Even though this parameter is not being used it must be here due to Phaser API and/or TypeScript type safety requirements.
  ): void {
    targets[0].setVisible(true); // Set the first element of targeted badges to be visible.
  }

  /**
   * @access private
   * @description Show AdMob ads.
   * @function showAdMobAds
   * @returns {Promise<void>}
   */
  private async showAdMobAds(): Promise<void> {
    let interstitial: any;

    document.addEventListener('deviceready', async () => {
      interstitial = new admob.InterstitialAd({
        adUnitId: 'ca-app-pub-4865595196880143/3742688595',
      })

      await interstitial.load()
      await interstitial.show()
    }, false);

    document.addEventListener('admob.ad.dismiss', async () => {
      // Once a interstitial ad is shown, it cannot be shown again.
      // Starts loading the next interstitial ad as soon as it is dismissed.
      await interstitial.load()
    });
  }

  /**
   * @access private
   * @description Create home button.
   * @function createHomeButton
   * @returns {void}
   */
  private createHomeButton(): void {
    const background_image: any = this.getByName("backgroundImage"); // Get the desired object by name.
    const x: number = background_image.width * -0.5;
    const y: number = background_image.height * 0.5;

    const home_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(x, y, "ui_buttons", "yellow_button12.png");
    const home_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(x, y, "ui_icons", "home.png");

    home_button.scale = home_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for home button.
    home_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    home_button.on(
      "pointerdown",
      () => {
        // Emit "play_sound" and "click" events on this scene.
        this.scene.events.emit("play_sound", "click", {
          volume: 1
        });

        // Remove the listeners for these events.
        this.scene.events.off("gameOver", this.onGameOver, this);
        this.scene.events.off("changedata");
        this.scene.events.off("getReady");
        this.scene.events.off("reset");

        this.scene.scene.restart(); // Restart the scene.
      },
      this // Context which is a reference to GameOver object in this case.
    );
    // Add home button to the scene.
    this.add(home_button);
    this.add(home_icon);
  }

  /**
   * @access private
   * @description Create share button.
   * @function createShareButton
   * @returns {void}
   */
  private createShareButton(): void {
    const background_image: any = this.getByName("backgroundImage"); // Get the desired object by name.
    const x: number = background_image.width * 0.5;
    const y: number = background_image.height * 0.5;

    const share_button = this.scene.add.sprite(x, y, "ui_buttons", "yellow_button12.png");
    const share_icon = this.scene.add.sprite(x, y, "ui_icons", "share2.png");

    share_button.scale = share_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for share button.
    share_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    share_button.on(
      "pointerdown",
      () => {
        // Emit "play_sound" and "click" events on this scene.
        this.scene.events.emit("play_sound", "click", {
          volume: 1
        });

        // Setting up configuration for the event.
        const options = {
          message: "Play FlyingPlane!", // not supported on some apps (Facebook, Instagram)
          subject: "My star level in FlyingPlane is " + localStorage.score + "!", // fi. for email
          files: ["www/assets/images/logo.png"], // an array of filenames either locally or remotely
          url: "https://doyban.com/games/flyingplane",
        };

        // Event handlers.
        const onSuccess: () => void = () => {
          console.log("Sharing result successful.");
        };
        const onError: () => void = () => {
          console.log("Sharing result unsuccessful.");
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError); // Cordova plugin execution.
      },
      this // Context which is a reference to GameOver object in this case.
    );
    // Add share button to the scene.
    this.add(share_button);
    this.add(share_icon);
  }
}
