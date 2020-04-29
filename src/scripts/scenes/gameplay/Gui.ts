import { SCORE } from "../../utils/GameConstants";

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

  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {Phaser.Scene} scene - scene object.
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
   * @description Create score text.
   * @function createScoreText
   * @returns {void}
   */
  private createScoreText(): void {
    let x: number = 30;

    // Create the max digits possible for score, add them to the scene and make it invisible (will make it visible if score length matches it).
    for (let i = 0; i < 6; i++) {
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

    play_button.on(
      "pointerdown",
      () => {
        if (this.play) this.play.setVisible(false); // Set the play button to be invisible once game has started.
        this.scene.events.emit("getReady"); // Emit "getReady" event on this scene.
      },
      this // Context which is a reference to GameOver object in this case.
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

    play_button_text.setOrigin(0.5);
    play_button_text.setFont("Calistoga");
    play_button_text.setFontSize(50);
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
    for (let i = 1; i <= score_length; i++) {
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
      onCompleteScope: this, // Context which is a reference to GameOver object in this case.
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
    });
    this.scene.data.set(SCORE, 0); // Set initial score to be '0'.
  }
}
