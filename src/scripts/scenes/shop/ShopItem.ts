import { UI_ICONS_SCALE_FACTOR } from "../../utils/GameConstants";

/**
 * @class ShopItem
 * @description Creates the score multiplier button with all the game objects needed and adds it to the scene.
 * @extends Phaser.GameObjects.Container
 */
export class ShopItem extends Phaser.GameObjects.Container {
  private multiplier: number = 0;

  /**
    * @constructor
    * @description Create a new instance of this class.
    * @param {Phaser.Scene} scene Scene object.
    * @param {number} multiplier Score multiplier.
    * @param {number} x The x coordinate value.
    * @param {number} y The y coordinate value.
    */
  constructor(scene: Phaser.Scene, multiplier: number, x: number, y: number) {
    super(scene, x, y);

    this.scene.add.existing(this); // Add this game object to the scene.
    this.multiplier = multiplier; // Set score multiplier.

    // Create graphic elements for the ShopItem.
    const background: Phaser.GameObjects.Image = this.createBackground();
    const multiplier_text: Phaser.GameObjects.Text = this.createMultiplierText();
    const score_text: Phaser.GameObjects.Text = this.createScoreText();
    const x_text: Phaser.GameObjects.Text = this.createXText();

    // Set size of ShopItem.
    this.setSize(background.width, background.height);

    // Use the hand cursor for ShopItem.
    this.setInteractive({
      useHandCursor: true,
    });

    // Add the graphic elements to the scene.
    this.add(background);
    this.add(multiplier_text);
    this.add(score_text);
    this.add(x_text);

    // Event listener.
    this.on("pointerup", this.onItemClicked, this);
  }

  /**
  * @access private
  * @description Create background of the ShopItem.
  * @function createBackground
  * @returns {Phaser.GameObjects.Image} background
  */
  private createBackground(): Phaser.GameObjects.Image {
    const background: Phaser.GameObjects.Image = this.scene.add.image(0, 0, "ui_buttons", "yellow_button12.png");
    background.scale = UI_ICONS_SCALE_FACTOR;
    background.setName("backgroundImage");

    return background;
  }

  /**
  * @access private
  * @description Create "[VALUE_IN_THE_ARRAY]" text after "Score x".
  * @function createMultiplierText
  * @returns {Phaser.GameObjects.Text} multiplier_text
  */
  private createMultiplierText(): Phaser.GameObjects.Text {
    const multiplier_text: Phaser.GameObjects.Text = this.scene.add.text(
      10,
      10,
      `${this.multiplier}`
    );
    multiplier_text.setFont("Calistoga");
    multiplier_text.setFontSize(25);
    multiplier_text.setOrigin(0.5);

    return multiplier_text;
  }

  /**
  * @access private
  * @description Create Score text of the ShopItem.
  * @function createScoreText
  * @returns {Phaser.GameObjects.Text} score_text
  */
  private createScoreText(): Phaser.GameObjects.Text {
    const score_text: Phaser.GameObjects.Text = this.scene.add.text(
      0,
      -15,
      "score"
    );
    score_text.setOrigin(0.5);
    score_text.setFont("Calistoga");
    score_text.setFontSize(15);

    return score_text;
  }

  /**
  * @access private
  * @description Create "x" text between "Score" and "[VALUE_IN_THE_ARRAY]".
  * @function createScoreText
  * @returns {Phaser.GameObjects.Text} x_text
  */
  private createXText(): Phaser.GameObjects.Text {
    const x_text: Phaser.GameObjects.Text = this.scene.add.text(
      -15,
      10,
      "X"
    );
    x_text.setFont("Calistoga");
    x_text.setFontSize(20);
    x_text.setOrigin(0.5);

    return x_text;
  }

  /**
   * @access private
   * @callback onItemClicked
   * @description Listens to input down of ShopItem.
   * @returns {void}
   */
  private onItemClicked(): void {
    // Emit "play_sound" and "click" events on this scene.
    this.scene.events.emit("play_sound", "click", {
      volume: 1
    });

    const that = this;
    const store = CdvPurchase.store;
    const { ProductType, Platform } = CdvPurchase;

    // Prepare product.
    store.register({
      id: `com.doyban.tappyplane.scorex${this.multiplier}`,
      type: ProductType.CONSUMABLE,
      platform: Platform.GOOGLE_PLAY,
    });
    store.update();

    store.when(`com.doyban.tappyplane.scorex${this.multiplier}`)
      .approved(() => {
        // Add extra score and begin the game.
        localStorage.scoreRate = parseInt(that.multiplier);
        that.scene.scene.start("Shop"); // Start Shop scene.
      });

    store.initialize([
      Platform.GOOGLE_PLAY,
    ]).then(() => {
      console.log('products2', store.products);
    });;
  }
}
