import {
  PLANE_VELOCITY_Y,
  PLANE_ANIMATION,
  PLANE,
} from "../../utils/GameConstants";

/**
 * @description Contains the properties that are needed by @class Plane.
 * @interface PlaneConfig
 */
interface PlaneConfig {
  world: Phaser.Physics.Matter.World;
  x: number;
  y: number;
  texture: string;
  frame?: string;
  options?: object;
}

/**
 * @description Contains the states of plane.
 * @enum states
 */
export enum states {
  off = 0,
  fly,
  crashed,
}

/**
 * @class Plane
 * @description Creates the matter sprite of plane and adds it to the respective scene.
 * @extends Phaser.Physics.Matter.Sprite
 */
export class Plane extends Phaser.Physics.Matter.Sprite {
  private config: PlaneConfig = <PlaneConfig>{};
  private gameOverFlag: boolean = false;
  private initTween: Phaser.Tweens.Tween | null = null;

  /**
   * @constructor
   * @description Create a new instance of this class.
   * @param {PlaneConfig} config Configuration interface.
   */
  constructor(config: PlaneConfig) {
    super(
      config.world,
      config.x,
      config.y,
      config.texture,
      config.frame,
      config.options
    );

    this.scene.add.existing(this); // Add game object to the current scene.
    this.setName(PLANE); // Set name for Plane object.
    this.setDataEnabled(); // Enable data manager on game object instance.
    this.setState(states.off); // Set initial state to be off (no state).
    this.setIgnoreGravity(true); // Set Plane to ignore gravity in the initial state.
    this.setFriction(0.5); // Set friction value.
    this.setDepth(2); // Depth of this game object within this scene (rendering position), also known as 'z-index' in CSS.
    this.setCollisionGroup(1); // Set to collide with other objects, it trigger collision event.
    this.config = config; // Set up initial configuration.

    // Create tap game objects.
    this.createTapLeftSign();
    this.createTapRightSign();
    this.createTapSign();

    this.createPuff(); // Create puff image.

    this.showSigns(false); // Make helper signs invisible.

    this.play(PLANE_ANIMATION); // Play Plane animation.

    // Create animations.
    this.createTapAnimation();
    this.createPuffAnimation();

    this.showInitTween(); // Show initial tween animation.
    this.scene.input.on("pointerdown", this.onTap, this); // Input listener.

    // Event listeners.
    this.scene.events.on("changedata", this.onDataChange, this);
    this.on("reset", this.onReset, this);
  }

  /**
   * @access private
   * @description Creates tap left sign.
   * @function createTapLeftSign
   * @returns {Phaser.GameObjects.Image} image
   */
  private createTapLeftSign(): Phaser.GameObjects.Image {
    const x: number = this.x + 110;
    const y: number = this.y;
    const texture: string = "sheet";
    const frame: string = "tapLeft.png";
    const name: string = "tap_left";

    const image: Phaser.GameObjects.Image = this.scene.add.image(
      x,
      y,
      texture,
      frame
    );
    image.setName(name);

    return image;
  }

  /**
   * @access private
   * @description Creates tap right sign.
   * @function createTapRightSign
   * @returns {Phaser.GameObjects.Image} image
   */
  private createTapRightSign(): Phaser.GameObjects.Image {
    const x: number = this.x - 110;
    const y: number = this.y;
    const texture: string = "sheet";
    const frame: string = "tapRight.png";
    const name: string = "tap_right";

    const image: Phaser.GameObjects.Image = this.scene.add.image(
      x,
      y,
      texture,
      frame
    );
    image.setName(name);

    return image;
  }

  /**
   * @access private
   * @description Creates tap sign sprite.
   * @function createTapSign
   * @returns {Phaser.GameObjects.Sprite} sprite
   */
  private createTapSign(): Phaser.GameObjects.Sprite {
    const x: number = this.x + 50;
    const y: number = this.y + 75;
    const texture: string = "sheet";
    const frame: string = "tapTick.png";
    const name: string = "tap";

    const sprite: Phaser.GameObjects.Sprite = this.scene.add.sprite(
      x,
      y,
      texture,
      frame
    );
    sprite.setName(name);

    return sprite;
  }

  /**
   * @access private
   * @description Creates puff which will be animated at the back of the plane.
   * @function createPuff
   * @returns {Phaser.GameObjects.Sprite} puff
   */
  private createPuff(): Phaser.GameObjects.Sprite {
    const puff: Phaser.GameObjects.Sprite = this.scene.add.sprite(
      this.x - 50,
      this.y + 50,
      "sheet",
      "puffLarge.png"
    );
    puff.setName("puff");
    puff.setVisible(false);

    return puff;
  }

  /**
   * @access private
   * @description Handles visibility of helper signs.
   * @function showSigns
   * @param {Boolean} flag Flag to decide if helper signs should be displayed or not.
   * @returns {void}
   */
  private showSigns(flag: boolean): void {
    // Get the desired objects by name.
    const tap: any = this.scene.children.getByName("tap");
    const tap_left: any = this.scene.children.getByName("tap_left");
    const tap_right: any = this.scene.children.getByName("tap_right");

    // Set the tap visibility based on flag.
    tap.setVisible(flag);
    tap_right.setVisible(flag);
    tap_left.setVisible(flag);

    // If the flag is set to "true".
    if (flag) {
      tap.anims.play("tapAnimation", true); // Play tap animation.
    }
    // For other cases (flag is set to "false").
    else {
      tap.anims.stop(); // Stop playing animation.
    }
  }

  /**
   * @access private
   * @description Creates tap animation and adds it to the tween manager.
   * @function createTapAnimation
   * @returns {void}
   */
  private createTapAnimation(): void {
    const sheet_texture: string[] = this.scene.textures
      .get("sheet")
      .getFrameNames();

    // Take frames from texture file which were not in order and push them to an array.
    const frames: Array<Phaser.Types.Animations.AnimationFrame | any> = [];
    frames.push({ key: "sheet", frame: sheet_texture[36] });
    frames.push({ key: "sheet", frame: sheet_texture[64] });

    // Create animation on the desired frames.
    this.scene.anims.create({
      key: "tapAnimation",
      defaultTextureKey: "sheet",
      frames: frames,
      duration: 800,
      repeat: -1, // Loop the animation.
    });
  }

  /**
   * @access private
   * @description Creates puff animation by specific frames and adds it to the scene animation manager.
   * @function createPuffAnimation
   * @returns {void}
   */
  private createPuffAnimation(): void {
    const sheet_texture: string[] = this.scene.textures
      .get("sheet")
      .getFrameNames();

    // Take frames from texture file which were not in order and push them to an array.
    const frames: Array<Phaser.Types.Animations.AnimationFrame | any> = [];
    frames.push({ key: "sheet", frame: sheet_texture[57] });
    frames.push({ key: "sheet", frame: sheet_texture[63] });

    // Create animation on the desired frames.
    this.scene.anims.create({
      key: "puffAnimation",
      defaultTextureKey: "sheet",
      frames: frames,
      duration: 200,
      showOnStart: true,
      hideOnComplete: true,
      frameRate: 10,
    });
  }

  /**
   * @access private
   * @description Makes plane fly in the air till first tap.
   * @function showInitTween
   * @returns {void}
   */
  private showInitTween(): void {
    this.initTween = this.scene.tweens.add({
      targets: this,
      duration: 700,
      y: this.y - 40,
      repeat: -1, // Loop the animation.
      yoyo: true,
      ease: "Quad.easeInOut",
    });
  }

  /**
   * @access private
   * @description it listens to the on down event and handles the plane state
   * @function onTap
   * @returns {void}
   */
  private onTap(): void {
    if (this.state === states.crashed) return; // Check if plane crashed, else move on.
    if (!this.scene.data.get("isPlayDown")) return; // Check if play button was not down, else move on.

    this.showSigns(false); // Make helper signs invisible.

    // Check if state is not fly.
    if (this.state !== states.fly) {
      if (this.initTween) this.initTween.stop(); // Play the initial flying tween.
      this.scene.events.emit("onStart"); // Emit "onStart" event on this scene.
      this.scene.events.emit("play_sound", "plane", {
        loop : true,
        volume : 0.5
      });
    }

    const puff: any = this.scene.children.getByName("puff"); // Get the desired object by name.
    puff.anims.play("puffAnimation"); // Play puff animation.
    this.setState(states.fly); // Change the plane state to fly.
    this.setIgnoreGravity(false); // Set Plane to count gravity.
    this.setVelocityY(PLANE_VELOCITY_Y); // Plane is starting flying, therefore set the 'y' velocity.

  }

  /**
   * @access private
   * @description Listens to data changes and update the value.
   * @function onDataChange
   * @param {any[]} args Game object which is caused by change.
   * @returns {void}
   */
  private onDataChange(...args: any[]): void {
    // Check if get ready tween animation is done.
    if (args[1] === "isPlayDown" && args[2] == true) {
      this.showSigns(true); // Make helper signs visible.
    }
  }

  /**
   * @access private
   * @description Listens to reset event.
   * @function onReset
   * @returns {void}
   */
  private onReset(): void {
    this.setPosition(this.config.x, this.config.y); // Set position of the Plane.
    this.setAngle(0); // Angle must be set to 0, because matter physics effects the object on collision and the Plane on game retry would have uncontrolled behaviour.
    this.setState(states.off); // Set initial state to be off (no state).
    this.setIgnoreGravity(true); // Set Plane to ignore gravity in the initial state.
    this.setFriction(0); // Set friction value.
    this.showInitTween(); // Show initial tween animation.
    this.setFrame(this.scene.data.get("planeFrame")); // Set Plane frame.
    this.play(PLANE_ANIMATION); // Play Plane animation.
  }

  /**
   * @access public
   * @description Method invoked all the time during the game. Listens to the changes of this game object properties and rerenders every frame.
   * @function update
   * @override `Phaser.Gameobjects#update`
   * @returns {void}
   */
  public update(): void {
    const puff: any = this.scene.children.getByName("puff"); // Get the desired object by name.
    puff.setPosition(this.x - 50, this.y + 20); // Attach the puff to the plane.

    // Check if plane crashed.
    if (this.state === states.crashed) {
      this.setActive(false); // Make the puff inactive.
      if (!this.gameOverFlag) {
        this.scene.events.emit("play_sound", "explosion"); // Emit "stop_sound" event on this scene.
        this.scene.events.emit("gameOver"); // Emit "gameOver" event on this scene.
        this.gameOverFlag = true; // Game is over, setting the flag accordingly.
      }
    }
    // For other cases (plane not crashed).
    else {
      this.setActive(true); // Make the puff active.
      this.gameOverFlag = false; // Game is going on, setting the flag accordingly.
      this.setAngle(0); // Angle must be set to 0, because matter physics effects the object on collision and the Plane on game retry would have uncontrolled behaviour.
      this.setX(this.config.x); // Not change its original position on any collision.
    }
  }
}
