import { UI_ICONS_SCALE_FACTOR } from "../utils/GameConstants";
import { ShopItemGroup } from "./shop/ShopItemGroup";

/**
 * @class Shop
 * @description Renders shop scene with all needed game objects.
 * @extends Phaser.Scene
 */
export class Shop extends Phaser.Scene {
  public shopItemGroup: ShopItemGroup | null = null;

  /**
   * @constructor
   * @description Create a new instance of this class.
   */
  constructor() {
    super({ key: "Shop" })
    this.shopItemGroup = null;
  }

  /**
    * @access public
    * @description Method called before scene is created. Preload all necessary assets for this scene.
    * @function preload
    * @override `Phaser.Scene#preload`
    * @returns {void}
    */
  public preload(): void {
    this.load.atlasXML("ui_icons", "assets/images/sheet_black1x.png", "assets/xml/sheet_black1x.xml");
    this.load.atlasXML("ui_buttons", "assets/images/yellowSheet.png", "assets/xml/yellowSheet.xml");
  }

  /**
   * @access public
   * @description Method called once scene is created. Create necessary elements.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  public create(): void {
    this.shopItemGroup = new ShopItemGroup(this, 2, 2, +this.game.config.width * 0.5, +this.game.config.height * 0.5);
    this.createBackButton();
  }

  /**
  * @access private
  * @description Create back button.
  * @function createBackButton
  * @returns {void}
  */
  private createBackButton(): void {
    const back_button: Phaser.GameObjects.Sprite = this.add.sprite(+50, +50, "ui_buttons", "yellow_button12.png");
    const back_icon: Phaser.GameObjects.Sprite = this.add.sprite(+50, +50, "ui_icons", "backward.png");

    back_button.scale = back_icon.scale = UI_ICONS_SCALE_FACTOR; // Scale back button and icons based on scaling factor.

    // Use the hand cursor for back button.
    back_button.setInteractive({
      useHandCursor: true,
    });

    // Event listener.
    back_button.on(
      "pointerdown",
      () => {
        this.events.emit("play_sound", "click", {
          volume : 1
        });
        this.scene.switch("game_play");
      },
      this // Context which is a reference to Shop object in this case.
    );
  }
}
