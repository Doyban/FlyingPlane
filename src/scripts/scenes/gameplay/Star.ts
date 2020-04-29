import { STAR_VELOCITY_X } from "../../utils/GameConstants";
import { states } from "./Plane";

/**
 * @description Contains the properties that are needed by @class Rock.
 * @interface StarConfig
 */
export interface StarConfig {
  world: Phaser.Physics.Matter.World;
  x: number;
  y: number;
  texture: string;
  frame?: string;
  options?: object;
  name: string;
}

/**
 * @class Star
 * @description Creates the matter image of star and adds it to the respective scene.
 * @extends Phaser.Physics.Matter.Image
 */
export class Star extends Phaser.Physics.Matter.Image {
  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {StarConfig} config Configuration interface.
   */
  constructor(config: StarConfig) {
    super(
      config.world,
      config.x,
      config.y,
      config.texture,
      config.frame,
      config.options
    );

    this.scene.add.existing(this); // Add game object to the current scene.
    this.setName(config.name); // Set name for Star object.
    this.setIgnoreGravity(true); // Set Star to ignore gravity.
    this.setDepth(2); // Depth of this game object within this scene (rendering position), also known as 'z-index' in CSS.
    this.setCollisionGroup(-1); // Set to never collide with other objects with the same negative value.

    if (this.scene) this.scene.events.on("reset", this.onReset, this); // Event listener.
  }

  /**
   * @access private
   * @description Listens to reset event.
   * @function onReset
   * @returns {void}
   */
  private onReset(): void {
    if (this.scene) this.scene.children.remove(this); // Remove this object from the scene.
    this.destroy(); // Destroy this object.
  }

  /**
   * @access public
   * @description Method invoked all the time during the game. Listens to the changes of this game object properties and rerenders every frame.
   * @function update
   * @override `Phaser.Gameobjects#update`
   * @returns {void}
   */
  public update(): void {
    if (this.scene) {
      const plane: any = this.scene.children.getByName("plane"); // Get the desired object by name.

      if (plane) {
        // Check if plane is flying.
        if (plane.state === states.fly) {
          this.setVelocityX(STAR_VELOCITY_X); // Plane is flying, therefore set the 'x' velocity.
        } else {
          this.setStatic(true); // Plane is not flying, therefore make the Star immovable.
        }
      }
    }

    // Destroy game object if it goes out of the bounds.
    if (this.x < -10) {
      this.scene.children.remove(this);
      this.destroy();
    }
  }
}
