import { UI_ICONS_SCALE_FACTOR } from "../../utils/GameConstants";

/**
 * @class ShopItem
 * @description Creates the score multiplier button with all the game objects needed and adds it to the scene.
 * @extends Phaser.GameObjects.Container
 */
export class ShopItem extends Phaser.GameObjects.Container {

  private multiplier : number

  constructor(scene : Phaser.Scene, x : number, y : number, multiplier : number) {
    super(scene, x , y);
    this.scene.add.existing(this);
    this.multiplier = multiplier;

    // create shop item bg
    const bg = this.createShopItemBg();
    this.setSize(bg.width, bg.height);
    this.setInteractive({
        useHandCursor: true,
    });
    this.add(bg);

    // create score text
    const score_text = this.createScoreText();
    this.add(score_text);

    // create x text
    const x_text = this.createXText();
    this.add(x_text);

    // create multiplier text
    const multiplier_text = this.createMultiplierText();
    this.add(multiplier_text);
    
    this.on("pointerup", this.onMouseDown, this);
  }

  /**
  * @access private
  * @description Create shop item bg.
  * @function createShopItemBg
  * @returns {Phaser.GameObjects.Text} score_text
  */
  private createShopItemBg () : Phaser.GameObjects.Image {
      const bg = this.scene.add.image(0, 0, "ui_buttons", "yellow_button12.png")
      bg.setName("backgroundImage");
      bg.scale = UI_ICONS_SCALE_FACTOR
      return bg
  }

  /**
  * @access private
  * @description Create score title text.
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
  * @description Create X text.
  * @function createScoreText
  * @returns {Phaser.GameObjects.Text} score_text
  */
  private createXText(): Phaser.GameObjects.Text {
    const x_text: Phaser.GameObjects.Text = this.scene.add.text(
      -15,
      10,
      "X"
    );
    x_text.setOrigin(0.5);
    x_text.setFont("Calistoga");
    x_text.setFontSize(20);
    return x_text;
  }

  /**
  * @access private
  * @description Create multiplier text.
  * @function createScoreText
  * @returns {Phaser.GameObjects.Text} multiplier_text
  */
  private createMultiplierText(): Phaser.GameObjects.Text {
    const multiplier_text: Phaser.GameObjects.Text = this.scene.add.text(
      10,
      10,
      `${this.multiplier}`
    );
    multiplier_text.setOrigin(0.5);
    multiplier_text.setFont("Calistoga");
    multiplier_text.setFontSize(25);
    return multiplier_text;
  }

  /**
   * @access private
   * @callback onMouseDown
   */
  private onMouseDown () : void {
      alert(`clicked x  ${this.multiplier}`);
  }

}