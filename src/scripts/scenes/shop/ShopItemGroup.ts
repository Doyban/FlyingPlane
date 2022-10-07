import { ShopItem } from "./ShopItem";

/**
 * @class ShopItemGroup
 * @description Renders shop score multiplier buttons to the group.
 * @extends Phaser.Scene
 */
export class ShopItemGroup {

    scene : Phaser.Scene
    rowCount : number
    colCount : number
    itemsArray : Array<ShopItem>
    startXpos : number
    startYpos : number
    offsetX : number
    offsetY : number

    constructor(scene : Phaser.Scene, colCount : number, rowCount : number, startX : number = 50, startY : number = 50, offsetX : number = 100, offsetY : number = 100) {
        this.scene = scene;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.itemsArray = [];
        this.startXpos = startX;
        this.startYpos = startY;
        this.startXpos = startX - (offsetX * (colCount-1) * 0.5); // setting center position using the total columns and offset
        this.startYpos = startY - (offsetY * (rowCount-1) * 0.5); // setting center position using the total rows and offset
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.createLayout();
    }

    /**
     * @access private
     * @function createLayout
     * @returns void
     */
    private createLayout () : void {
        let multiplier : number = 2;
        let counter : number = 1;
        for (let i = 0; i < this.colCount; i++) {
            let y = this.startYpos  + (this.offsetY * i); // changing the y offset fot every new button
            for (let j = 0; j < this.rowCount; j++) {
                let x = this.startXpos + (this.offsetX * j); // changing the x offset fot every new button
                this.itemsArray.push(new ShopItem(this.scene, x, y, (multiplier * counter)));
                counter ++;
            }
        }
    }

}