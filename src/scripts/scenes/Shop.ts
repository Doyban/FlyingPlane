import { GAME_HEIGHT, GAME_WIDTH, UI_ICONS_SCALE_FACTOR } from "../utils/GameConstants";
import { ShopItem } from "./shop/ShopItem";
import { ShopItemGroup } from "./shop/ShopItemGroup";

/**
 * @class Shop
 * @description Renders shop scene with all needed game objects.
 * @extends Phaser.Scene
 */
export class Shop extends Phaser.Scene {
    private shopItemGroup : ShopItemGroup | null = null
    constructor() {
        super({key : "Shop"})
        this.shopItemGroup = null;
    }

    /**
   * @access public
   * @description Method called before scene is created. Preload all necessary assets for this scene.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */   
    public preload () : void {
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
    public create () : void {
        this.shopItemGroup = new ShopItemGroup(this, 2, 2, +this.game.config.width * 0.5, +this.game.config.height * 0.5);

        this.createBackButton();

    }

    /**
    * @access private
    * @description Create back button.
    * @function createBackButton
    */
    private createBackButton(): void {
        const back_button = this.add.sprite(+50, +50, "ui_buttons", "yellow_button12.png");
        const back_icon = this.add.sprite(+50, +50, "ui_icons", "backward.png");
           back_button.scale = back_icon.scale = UI_ICONS_SCALE_FACTOR;
           // Use the hand cursor for play button.
        back_button.setInteractive({
          useHandCursor: true,
        });
           back_button.on(
          "pointerdown",
          () => {
            this.scene.switch("game_play")
          },
          this // Context which is a reference to GameOver object in this case.
        );
    }
}