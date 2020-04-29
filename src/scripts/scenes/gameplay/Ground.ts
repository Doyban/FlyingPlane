import { GROUND, GAME_WIDTH, GROUND_FRAME } from "../../utils/GameConstants";
import { states } from "./Plane";

/**
 * @description Contains the properties that are needed by @class Ground.
 * @interface GroundConfig
 */
interface GroundConfig {
  world: Phaser.Physics.Matter.World;
  x: number;
  y: number;
  texture: string;
  frame?: string;
  options?: object;
}

/**
 * @class Ground
 * @description Creates the Ground game object and adds it to the scene.
 * @extends Phaser.Physics.Matter.Image
 */
export class Ground extends Phaser.Physics.Matter.Image {
  private _x: number = 0;
  private _y: number = 0;
  private groundFrame: string | any = null;
  private groundTween: Phaser.Tweens.Tween | null = null;

  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {GroundConfig} config Configuration interface.
   */
  constructor(config: GroundConfig) {
    super(
      config.world,
      config.x,
      config.y,
      config.texture,
      config.frame,
      config.options
    );

    this._x = config.x; // Store the 'x' value that is given at initial creation time.
    this._y = config.y; // Store the 'y' value that is given at initial creation time.
    this.groundTween = null; // Set initial ground tween animation to ben null.

    this.scene.add.existing(this); // Add game object to the scene.
    this.setIgnoreGravity(true); // Set Ground to ignore gravity.
    this.setStatic(true); // Set Ground to be immovable.

    this.setName(GROUND); // Set name for Ground object.
    this.setCollisionGroup(-1); // Set to never collide with other objects with the same negative value.

    // Set rendering order of this scene.
    this.setDepth(3); // Depth of this game object within this scene (rendering position), also known as 'z-index' in CSS.
    this.groundTransition(); // Call ground transitions.
    this.groundFrame = config.frame; // Change ground texture frame based on this variable.

    // Event listeners.
    this.scene.events.on("changedata", this.onDataChange, this);
    this.scene.events.on("reset", this.onReset.bind(this));

    this.scaleX = 1.005; // Scale 'x' value.
  }

  /**
   * @access private
   * @description Change ground texture.
   * @function groundTransition
   * @returns {void}
   */
  private groundTransition(): void {
    this.groundTween = this.scene.tweens.add({
      targets: this,
      duration: 3000,
      ease: "",
      x: {
        from: this.x,
        to: this.x - this.width,
      },
      onComplete: this.onTweenComplete, // Callback method.
      onCompleteScope: this, // Context which is a reference to GameOver object in this case.
    });
  }

  /**
   * @access private
   * @callback onTweenComplete
   * @description Replace its position to initial state on tween completes.
   * @returns {void}
   */
  private onTweenComplete(): void {
    if (this.x < 0) {
      // Check if current frame is same as updated one.
      if (this.frame.name !== this.groundFrame) {
        this.setFrame(this.groundFrame); // Current frame isn't same as updated one, therefore update it with a new frame.
      }
      // Check if this ground object is out of game bounds. It helps in defferentiating the initial ground at start position and default ground.
      if (this._x < this.scene.data.get(GAME_WIDTH)) {
        this.setX(this._x + this.width); // Ground object is out of game bounds, therefore reset it to starting position.
      } else {
        this.setX(this._x); // Otherwise, make it original position.
      }
    }
    this.groundTransition(); // Call ground transitions.
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
    // Check if the changed data refers to ground.
    if (key === GROUND_FRAME) {
      this.groundFrame = value; // Change ground frame.
    }
  }

  /**
   * @access private
   * @description Listens to reset event.
   * @function onReset
   * @returns {void}
   */
  private onReset(): void {
    this.setPosition(this._x, this._y); // Reset to its original position.
    this.groundTransition(); // Call ground transitions.
  }

  /**
   * @access public
   * @description Method invoked all the time during the game. Listens to the changes of this game object properties and rerenders every frame.
   * @function update
   * @override `Phaser.Gameobjects#update`
   * @returns {void}
   */
  public update(): void {
    const plane: any = this.scene.children.getByName("plane"); // Get the desired object by name.

    if (plane) {
      if (plane.state === states.crashed) {
        if (this.groundTween) this.groundTween.stop(); // Stop ground movement on plane crash.
      }
    }
  }
}
