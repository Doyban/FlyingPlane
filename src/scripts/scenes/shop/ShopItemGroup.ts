import { ShopItem } from "./ShopItem";

/**
 * @class ShopItemGroup
 * @description Renders shop score multiplier buttons to the group.
 */
export class ShopItemGroup {
  private colCount: number = 0;
  private itemsArray: Array<ShopItem> = [];
  private multiplierArray: Array<number> = [];
  private offsetX: number = 0;
  private offsetY: number = 0;
  private rowCount: number = 0;
  private scene: Phaser.Scene = new Phaser.Scene('');
  private startXpos: number = 0;
  private startYpos: number = 0;

  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {Phaser.Scene} scene Scene object.
   * @param {number} colCount Total number of columns.
   * @param {number} rowCount Total number of rows.
   * @param {number} [startX=50] Start of the x coordinate value.
   * @param {number} [startY=50] Start of the y coordinate value.
   * @param {number} [offsetX=100] Offset of the x coordinate value.
   * @param {number} [offsetY=100] Offset of the y coordinate value.
   */
  constructor(scene: Phaser.Scene, colCount: number, rowCount: number, startX: number = 50, startY: number = 50, offsetX: number = 100, offsetY: number = 100) {
    this.scene = scene;
    this.colCount = colCount;
    this.itemsArray = [];
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.rowCount = rowCount;
    this.startXpos = startX - (offsetX * (colCount - 1) * 0.5); // Set center position using the total columns and offset.
    this.startYpos = startY - (offsetY * (rowCount - 1) * 0.5); // Set center position using the total rows and offset.
    this.multiplierArray = [2, 4, 6, 8]; // Array to change multiplier count for shop items.

    this.createLayout();
  }

  /**
   * @access private
   * @description Create all the shop items.
   * @function createLayout
   * @returns {void}
   */
  private createLayout(): void {
    let counter: number = 0;

    for (let i: number = 0; i < this.colCount; i++) {
      let y: number = this.startYpos + (this.offsetY * i); // Change the y offset fot every new button.

      for (let j: number = 0; j < this.rowCount; j++) {
        let x: number = this.startXpos + (this.offsetX * j); // Change the x offset fot every new button.
        this.itemsArray.push(new ShopItem(this.scene, this.multiplierArray[counter], x, y)); // Add ShopItems to the itemsArray array.
        counter++;
      }
    }
  }
}
