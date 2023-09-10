import { SCORE, UI_ICONS_SCALE_FACTOR } from "../../utils/GameConstants";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth/cordova";

/**
 * @class Gui
 * @description Creates all GUI related buttons/images and adds it to the scene.
 * @extends Phaser.GameObjects.Group
 */
export class Gui extends Phaser.GameObjects.Group {
  private gameOver: Phaser.GameObjects.Sprite | undefined = undefined;
  private getReady: Phaser.GameObjects.Sprite | undefined = undefined;
  private play: Phaser.GameObjects.Container | undefined = undefined;
  private playButton: Phaser.GameObjects.Sprite | undefined = undefined;
  private playButtonText: Phaser.GameObjects.Text | undefined = undefined;
  private scoreGroup: Phaser.GameObjects.Group;
  private menuGroup: Phaser.GameObjects.Group;
  private musicOn: Phaser.GameObjects.Sprite;
  private musicOff: Phaser.GameObjects.Sprite;
  private musicButtonBackground!: Phaser.GameObjects.Sprite;


  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {Phaser.Scene} scene Scene object.
   */
  constructor(scene: Phaser.Scene) {
    super(scene);

    // Create score text.
    this.scoreGroup = this.scene.add.group();
    this.scene.data.set(SCORE, 0);
    this.createScoreText();

    // Create play button.
    this.play = this.scene.add.container(420, 240);
    this.playButton = this.createPlayButton();
    this.playButtonText = this.createPlayButtonText();
    this.play.add(this.playButton);
    this.play.add(this.playButtonText);
    this.add(this.play);

    // Add and create necessary assets.
    this.menuGroup = this.scene.add.group();
    this.addMultiple(this.menuGroup.children.entries)
    this.createCloseButton();
    this.createFriendsButton();
    this.createLoginButton();
    this.createShareButton();
    this.createShopButton();

    // Create sound control assets.
    this.musicOn = this.createMusicOn();
    this.musicOff = this.createMusicOff();

    // Create get ready sprite.
    this.getReady = this.scene.add.sprite(
      420,
      -50,
      "sheet",
      "textGetReady.png"
    );
    this.add(this.getReady);

    // Create game over sprite.
    this.gameOver = this.scene.add.sprite(
      420,
      -50,
      "sheet",
      "textGameOver.png"
    );
    this.add(this.gameOver);

    // Event listeners.
    this.scene.events.on("changedata", this.onDataChange, this);
    this.scene.events.on("getReady", this.onGetReady, this);
    this.scene.events.on("reset", this.onReset, this);
  }

  /**
   * @access private
   * @description Create play button.
   * @function createPlayButton
   * @returns {Phaser.GameObjects.Sprite} play_button
   */
  private createPlayButton(): Phaser.GameObjects.Sprite {
    const play_button = this.scene.add.sprite(0, 0, "sheet", "buttonLarge.png");

    // Use the hand cursor for play button.
    play_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    play_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.

        if (this.play) this.play.setVisible(false); // Set the play button to be invisible once game has started.
        this.menuGroup.children.entries.forEach((child: any) => {
          child.setVisible(false); // Set each child to be invisible.
        });
        this.musicOn.setVisible(true)
        this.musicButtonBackground.setVisible(true)
        this.scene.events.emit("getReady"); // Emit "getReady" event on this scene.
      },
      this // Context which is a reference to Gui object in this case.
    );

    return play_button;
  }

  /**
   * @access private
   * @description Create play button text.
   * @function createPlayButton
   * @returns {Phaser.GameObjects.Text} play_button_text
   */
  private createPlayButtonText(): Phaser.GameObjects.Text {
    const play_button_text: Phaser.GameObjects.Text = this.scene.add.text(
      0,
      -5,
      "play"
    );

    play_button_text.setFont("Calistoga");
    play_button_text.setFontSize(50);
    play_button_text.setOrigin(0.5);
    play_button_text.setShadow(2, 2, "#000000", 0.5, true, false);

    return play_button_text;
  }

  /**
   * @access private
   * @description Listens to data changes and update the value.
   * @function onDataChange
   * @param {any} parent Game object which is caused by change.
   * @param {string} key Key which got changed.
   * @param {any} value New value which has inserted.
   * @param {any} previousValue Value which is replaced.
   * @returns {void}
   */
  private onDataChange(
    parent: any, // Even though this parameter is not being used it must be here to change the ground.
    key: string,
    value: any,
    previousValue: any // Even though this parameter is not being used it must be here to change the ground.
  ): void {
    // Check if the changed data refers to score.
    if (key === SCORE) {
      this.updateScore(value); // Update score.
    }
  }

  /**
   * @access private
   * @description Update score of the game.
   * @function updateScore
   * @param {number} value
   * @returns {void}
   */
  private updateScore(value: number): void {
    const changeEnvironemntScore: number = 5;

    // Check if Plane reached already enough score to change frames of environment for Ground and Rocks.
    if (value === changeEnvironemntScore) {
      this.scene.events.emit("changeenv"); // Emit "changeenv" event on this scene.
    }

    // Set variables to update score.
    const score: string = value.toString();
    const score_digits: string[] = score.split("");
    const score_length: number = score.length;

    // Show the digits depending on score length.
    for (let i: number = 1; i <= score_length; i++) {
      const score_group_child: any = this.scoreGroup.children.entries[i - 1];
      if (score_group_child) {
        score_group_child.setFrame(`number${score_digits[i - 1]}.png`);
        if (!score_group_child.visible) {
          score_group_child.setVisible(true);
        }
      }
    }
  }

  /**
   * @access private
   * @description Add get ready tween animation to the tween manager.
   * @function onGetReady
   * @returns {void}
   */
  private onGetReady(): void {
    this.scene.tweens.add({
      targets: this.getReady,
      y: 60,
      ease: "Back.easeOut",
      yoyo: true,
      duration: 2000,
      hold: 500,
      onComplete: this.onGetReadyComplete, // Callback method.
      onCompleteScope: this, // Context which is a reference to Gui object in this case.
    });
  }

  /**
   * @access private
   * @callback onGetReadyComplete
   * @description Listens to the oncomplete event of get ready tween animation.
   * @returns {void}
   */
  private onGetReadyComplete(): void {
    this.scene.data.set("isPlayDown", true); // Set get ready tween animation as done.
  }

  /**
   * @access private
   * @description Listens to reset event.
   * @function onReset
   * @returns {void}
   */
  private onReset(): void {
    // Reset the score group children.
    this.scoreGroup.children.entries.forEach((child: any) => {
      child.setVisible(false); // Set each child to be invisible.

      if (child.name == "musicbg") child.setVisible(true);
      if (child.name == "" && child.data && child.data.get("clicked")) {
        child.setVisible(true)
      };
    });
    // Reset the menu group children.
    this.menuGroup.children.entries.forEach((child: any) => {
      child.setVisible(false); // Set each child to be visible.
    });
    this.scene.data.set(SCORE, 0); // Set initial score to be '0'.
  }

  /**
   * @access private
   * @description Create score text.
   * @function createScoreText
   * @returns {void}
   */
  private createScoreText(): void {
    let x: number = 30;

    // Create the max digits possible for score, add them to the scene and make it invisible (will make it visible if score length matches it).
    for (let i: number = 0; i < 6; i++) {
      const score_text: Phaser.GameObjects.Image = this.scene.add.image(
        x,
        40,
        "sheet",
        "number0.png"
      );

      score_text.setName(`score_index${i}`);
      score_text.setScale(0.6);
      score_text.setVisible(false);
      score_text.setDepth(5); // Depth of this game object within this scene (rendering position), also known as 'z-index' in CSS.
      this.scoreGroup.add(score_text);
      x += 35; // Once score length expands then make some space for next numbers.
    }

    // Add all the individual score texts to one group.
    this.scoreGroup.children.entries.forEach((child: any) => {
      if (child.name === "score_index0") {
        child.setVisible(true);
      } else {
        child.setVisible(false);
      }
    });
  }

  /**
   * @access private
   * @description Create game close button.
   * @function createCloseButton
   * @returns {void}
   */
  private createCloseButton(): void {
    const close_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width - 50, 50, "ui_buttons", "yellow_button12.png");
    const close_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width - 50, 50, "ui_icons", "cross.png");

    close_button.scale = close_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for close button.
    close_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    close_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.
        navigator.app.exitApp(); // Close the game.
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add close button to the scene.
    this.menuGroup.add(close_icon);
    this.menuGroup.add(close_button);
  }

  /**
   * @access private
   * @description Create friends button.
   * @function createFriendsButton
   * @returns {void}
   */
  private createFriendsButton(): void {
    const friends_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.79, +this.scene.game.config.height * 0.76, "ui_buttons", "yellow_button12.png");
    const friends_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.79, +this.scene.game.config.height * 0.76, "ui_icons", "multiplayer.png");

    friends_button.scale = friends_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for friends button.
    friends_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    friends_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.

        // Setting up configuration for the event.
        const options = {
          method: "apprequests",
          message: "Play TappyPlane with me!"
        };

        // Event handlers.
        const onSuccess: () => void = () => {
          console.log("Inviting friends successful.");
        };
        const onError: () => void = () => {
          console.log("Inviting friends unsuccessful.");
        };

        facebookConnectPlugin.showDialog(options, onSuccess, onError); // Cordova plugin execution.
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add friends button to the scene.
    this.menuGroup.add(friends_button);
    this.menuGroup.add(friends_icon);
  }

  /**
   * @access private
   * @description Create login button.
   * @function createLoginButton
   * @returns {void}
   */
  private createLoginButton(): void {
    const login_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.42, +this.scene.game.config.height * 0.76, "ui_buttons", "yellow_button12.png");
    const login_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.42, +this.scene.game.config.height * 0.76, "ui_icons", "singleplayer.png");

    login_button.scale = login_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for login button.
    login_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    login_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.
        this.loginUsingFirebase();
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add login button to the scene.
    this.menuGroup.add(login_button);
    this.menuGroup.add(login_icon);
  }

  /**
   * @access private
   * @description Login the user using Firebase Google authentication.
   * @function loginUsingFirebase
   * @returns {void}
   */
  private loginUsingFirebase(): void {
    const auth = getAuth(); // Create an instance of the authentication object.

    // Sign in by redirecting to the sign-in page.
    signInWithRedirect(auth, new GoogleAuthProvider())
      .then(() => {
        return getRedirectResult(auth);
      })
      .then(() => {
        console.log('Authentication successful.')
      }).catch(() => {
        console.log('Authentication unsuccessful.')
      });
  }

  /**
   * @access private
   * @description Create share button.
   * @function createShareButton
   * @returns {void}
   */
  private createShareButton(): void {
    const share_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.62, +this.scene.game.config.height * 0.76, "ui_buttons", "yellow_button12.png");
    const share_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.62, +this.scene.game.config.height * 0.76, "ui_icons", "share2.png");

    share_button.scale = share_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for share button.
    share_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    share_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.

        // Setting up configuration for the event.
        const options = {
          message: "Play TappyPlane!", // not supported on some apps (Facebook, Instagram)
          subject: "Cool game to be played :-)", // fi. for email
          files: ["www/assets/images/logo.png"], // an array of filenames either locally or remotely
          url: "https://doyban.com/games/tappyplane",
        };

        // Event handlers.
        const onSuccess: () => void = () => {
          console.log("Sharing successful.");
        };
        const onError: () => void = () => {
          console.log("Sharing unsuccessful.");
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError); // Cordova plugin execution.
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add share button to the scene.
    this.menuGroup.add(share_button);
    this.menuGroup.add(share_icon);
  }

  /**
   * @access private
   * @description Create shop button.
   * @function createShopButton
   * @returns {void}
   */
  private createShopButton(): void {
    const shop_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.25, +this.scene.game.config.height * 0.76, "ui_buttons", "yellow_button12.png");
    const shop_icon: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width * 0.25, +this.scene.game.config.height * 0.76, "ui_icons", "cart.png");

    shop_button.scale = shop_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for shop button.
    shop_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    shop_button.on(
      "pointerdown",
      () => {
        this.playClickSound(); // Play click sound.
        this.scene.scene.start("Shop"); // Start Shop scene.
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add shop button to the scene.
    this.menuGroup.add(shop_icon);
    this.menuGroup.add(shop_button);
  }

  /**
   * @access private
   * @description Create music on button.
   * @function createMusicOn
   * @returns {void}
   */
  private createMusicOn(): Phaser.GameObjects.Sprite {
    this.musicButtonBackground = this.scene.add.sprite(+this.scene.game.config.width - 50, 50, "ui_buttons", "yellow_button12.png");
    const music_on_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width - 50, 50, "musicOn");
    music_on_button.setVisible(false);
    music_on_button.setDepth(5);
    music_on_button.setDataEnabled();
    music_on_button.data.set("clicked", true);
    this.musicButtonBackground.setName("musicbg");
    this.musicButtonBackground.setVisible(false);
    this.musicButtonBackground.setDepth(5);

    this.musicButtonBackground.scale = music_on_button.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for music on button.
    music_on_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    music_on_button.on(
      "pointerdown",
      () => {
        music_on_button.data.set("clicked", false);
        this.scene.sound.mute = true;
        this.musicOff.setVisible(true);
        this.musicOff.data.set("clicked", true);
        music_on_button.setVisible(false);
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add music on button to the scene.
    this.scoreGroup.add(music_on_button);

    return music_on_button;
  }

  /**
   * @access private
   * @description Create music off button.
   * @function createMusicOff
   * @returns {void}
   */
  private createMusicOff(): Phaser.GameObjects.Sprite {
    const music_off_button: Phaser.GameObjects.Sprite = this.scene.add.sprite(+this.scene.game.config.width - 50, 50, "musicOff");
    music_off_button.setVisible(false);
    music_off_button.setDepth(5);
    music_off_button.setDataEnabled();
    music_off_button.data.set("clicked", false);

    music_off_button.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for music off button.
    music_off_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    music_off_button.on(
      "pointerdown",
      () => {
        // Emit "play_sound" and "click" events on this scene.
        this.scene.events.emit("play_sound", "click", {
          volume: 1
        });

        music_off_button.data.set("clicked", false)
        this.scene.sound.mute = false;
        this.musicOn.setVisible(true);
        this.musicOn.data.set("clicked", true);
        music_off_button.setVisible(false);
      },
      this // Context which is a reference to Gui object in this case.
    );
    // Add music off button to the scene.
    this.scoreGroup.add(music_off_button);

    return music_off_button;
  }

  /**
   * @access private
   * @description Play click sound.
   * @function playClickSound
   * @returns {void}
   */
  private playClickSound(): void {
    // Emit "play_sound" and "click" events on this scene.
    this.scene.events.emit("play_sound", "click", {
      volume: 1
    });
  }
}
