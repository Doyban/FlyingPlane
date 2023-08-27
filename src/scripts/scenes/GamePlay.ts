import { Plane, states } from "./gameplay/Plane";
import { Ground } from "./gameplay/Ground";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND,
  GROUND_FRAME,
  GROUND_ROCK,
  PLANE,
  PLANE_ANIMATION,
  SCORE,
  SKY_ROCK,
  STAR,
} from "../utils/GameConstants";
import { Rock } from "./gameplay/Rock";
import { Gui } from "./gameplay/Gui";
import { GameOver } from "./gameplay/GameOver";
import { SoundHandler } from "../utils/SoundHandler";
import { Star } from "./gameplay/Star";

/**
 * @class GamePlay
 * @description Renders gameplay scene with all needed game objects.
 * @extends Phaser.Scene
 */
export class GamePlay extends Phaser.Scene {
  private backgroundImage: Phaser.GameObjects.Image | null = null;
  private environmentChangeTimer: any = null;
  private groundFrames: Array<string> = [
    "groundGrass.png",
    "groundRock.png",
    "groundIce.png",
    "groundSnow.png",
    "groundDirt.png",
  ];
  private groundRockFrames: Array<string> = [
    "rockGrass.png",
    "rock.png",
    "rockIce.png",
    "rockSnow.png",
    "rock.png",
  ];
  private levelDuration: number = 0;
  private planeFrames: Array<string> = [
    "planeBlue",
    "planeGreen",
    "planeRed",
    "planeYellow",
  ];
  private rockCreationTimer: any = null;
  private rockDownFrame: string = "rockGrassDown.png";
  private rockFrame: string = "rockGrass.png";
  private shapes: any = null;
  private skyRockFrames: Array<string> = [
    "rockGrassDown.png",
    "rockDown.png",
    "rockIceDown.png",
    "rockSnowDown.png",
    "rockDown.png",
  ];
  private starFrame: string = "starBronze.png";
  private starLevel: number = 0;
  public plane: Phaser.Physics.Matter.Sprite | null = null;
  public soundHandler: SoundHandler | null = null;

  /**
   * @constructor
   * @description Create a new instance of this class.
   */
  constructor() {
    super({
      key: "game_play",
    });
    this.levelDuration = this.getLevelDuration; // Get level duration.
  }

  /**
   * @description Define time limit for level.
   * @get getLevelDuration
   * @returns {number} milliSeconds
   */
  get getLevelDuration(): number {
    const minutes: number = Phaser.Math.Between(1, 2);
    const seconds: number = minutes * 60;
    const milliSeconds: number = seconds * 1000;

    return milliSeconds;
  }

  /**
   * @access public
   * @function init
   * @description Before any function will be called this ones is, the only way to pass data from one state to another without using global variables.
   * @override `Phaser.Scene#init`
   * @returns {void}
   */
  public init(args: any): void {
    this.backgroundImage = args.backgroundImage; // Get background image from previous scene to not to create again.
  }

  /**
   * @access public
   * @description Method called before scene is created. Preload all necessary assets for this scene.
   * @function preload
   * @override `Phaser.Scene#preload`
   * @returns {void}
   */
  public preload(): void {
    this.load.atlas(
      "planes",
      "assets/spritesheets/planes.png",
      "assets/json/planes.json"
    );
    this.load.atlasXML("ui_buttons", "assets/images/yellowSheet.png", "assets/xml/yellowSheet.xml");
    this.load.atlasXML("ui_icons", "assets/images/sheet_black1x.png", "assets/xml/sheet_black1x.xml");
    this.load.audio("crash", "assets/audio/crash.wav");
    this.load.audio("click", "assets/audio/click.wav");
    this.load.audio("explosion", "assets/audio/explosion.wav");
    this.load.audio("gameover", "assets/audio/gameover.wav");
    this.load.audio("plane", "assets/audio/plane.wav");
    this.load.audio("wind", "assets/audio/wind.wav");
    this.load.image("musicOff", "assets/images/musicOff.png");
    this.load.image("musicOn", "assets/images/musicOn.png");
    this.load.json("shapes", "assets/json/shapes.json");
  }

  /**
   * @access public
   * @description Method called once scene is created. Create necessary elements.
   * @function create
   * @override `Phaser.Scene#create`
   * @returns {void}
   */
  public create(): void {
    this.soundHandler = new SoundHandler(this); // Add sound handler.

    // Emit "play_sound" and "wind" events on this scene.
    this.events.emit("play_sound", "wind", {
      loop: true,
    });

    this.shapes = this.cache.json.get("shapes"); // Set matter physics shapes.

    // Set game dimensions as positive integers of game config's dimensions.
    this.data.set(GAME_WIDTH, Number(+this.game.config.width));
    this.data.set(GAME_HEIGHT, Number(+this.game.config.height));

    this.data.set(GROUND_FRAME, "groundGrass.png"); // Set Ground frame.
    this.data.set("medal", 0); // Set default medal that should be shown in GameOver.
    this.data.set("planeFrame", null); // Set default Plane frame.
    this.data.set("timestamp", null); // Set timestamp.

    this.data.set("isPlayDown", false); // Event listener.

    this.createBackground(); // Create background image.
    this.createPlaneAnimation(); // Create Plane animation.

    // Create new Ground.
    new Ground({
      x: this.data.get(GAME_WIDTH) / 2,
      y: 455,
      texture: "sheet",
      frame: "groundGrass.png",
      world: this.matter.world,
      options: {
        shape: this.shapes.groundGrass, // Add matter shape.
      },
    });

    // Create Ground moving functionality.
    new Ground({
      x: this.data.get(GAME_WIDTH) / 1.96 + this.data.get(GAME_WIDTH),
      y: 455,
      texture: "sheet",
      frame: "groundGrass.png",
      world: this.matter.world,
      options: {
        shape: this.shapes.groundGrass, // Add matter shape.
      },
    });

    // Add Plane to the game.
    this.plane = new Plane({
      x: 200,
      y: 200,
      texture: "planes",
      world: this.matter.world,
      frame: "planeBlue1.png",
      options: {
        shape: this.shapes.planeRed1, // Add matter shape.
      },
    });

    new Gui(this); // Add GUI elements.

    // Add game over container to the scene.
    new GameOver(this, {
      x: this.data.get("gameWidth") / 2,
      y: this.data.get("gameHeight") + this.data.get("gameHeight") / 2,
    });

    this.matter.world.on("collisionstart", this.onCollision, this); // Handle collisions in matter world.

    // Event listeners.
    this.events.on("onStart", this.onStart, this);
    this.events.on("reset", this.onReset, this);
    this.events.on("shutdown", this.onShutdown, this);
  }

  /**
   * @access private
   * @description Creates background image of the game.
   * @function createBackground
   * @returns {any} background
   */
  private createBackground(): any {
    if (this.backgroundImage) {
      const background: any = this.add.existing(this.backgroundImage);
      background.setVisible(true);

      return background;
    }
  }

  /**
   * @access private
   * @description Creates Plane animation with given animation frame prefix.
   * @function createPlaneAnimation
   * @param {string} [prefix=planeRed] Prefix of frame key of the animation.
   * @returns {void}
   */
  private createPlaneAnimation(prefix: string = "planeRed"): void {
    if (this.anims.exists(PLANE_ANIMATION)) this.anims.remove(PLANE_ANIMATION); // Remove animation if one exist with the key "PLANE_ANIMATION".

    // Create Plane animation.
    const plane_animation: any = this.anims.create({
      key: PLANE_ANIMATION,
      frames: this.anims.generateFrameNames("planes", {
        zeroPad: 0,
        prefix: prefix,
        suffix: ".png",
        end: 3,
        start: 1,
      }),
      repeat: -1, // Loop the animation.
    });

    // Add Plane animation if it doesn't exists.
    if (!this.anims.exists(PLANE_ANIMATION))
      this.anims.add(PLANE_ANIMATION, plane_animation);

    this.data.set("planeFrame", `${prefix}1.png`); // Set appropriate Plane frame to associated prefix.

    const plane: any = this.children.getByName(PLANE); // Get the desired object by name.
    if (plane) plane.emit("reset"); // Emit "reset" event to the Plane.
  }

  /**
   * @access private
   * @description Handle collisions in matter world.
   * @function onCollision
   * @param {any} event Event that occured to happen during collision.
   * @param {Phaser.Physics.Matter.Sprite | any} gameObject1 Game object which caused collision.
   * @param {Phaser.Physics.Matter.Sprite | any} gameObject2 Game object on which gameObject1 collided.
   * @returns {void}
   */
  private onCollision(
    event: any, // Even though this parameter is not being used it must be here to properly handle collisions.
    gameObject1: Phaser.Physics.Matter.Sprite | any,
    gameObject2: Phaser.Physics.Matter.Image | any
  ): void {
    // Check if Plane is grounded.
    if (gameObject1.gameObject && gameObject1.gameObject.name === GROUND) {
      this.rockCreationTimer.remove(true); // Stop the timer event which creates the Rocks.

      this.time.clearPendingEvents(); // Clear and reschedule timer events.
      this.time.removeAllEvents(); // Remove all active timer events.

      gameObject2.gameObject.setState(states.crashed); // Set Plane state to crashed.
    }
    // Check if Plane collided with Rock.
    if (gameObject1.gameObject) {
      // Check if the object is not static.
      if (!gameObject1.gameObject.isStatic()) {
        // Check collision between Star and Plane.
        if (gameObject2.gameObject.name === STAR) {
          gameObject1.gameObject.setAngle(0); // Angle must be set to 0, because matter physics effects the object on collision and the Plane on game retry would have uncontrolled behaviour.

          // Set appropriate medal to show and update score accordingly to collided Stars.
          if (gameObject2.gameObject.frame.name === "starBronze.png") {
            this.data.set("medal", 0);
            this.data.set(SCORE, this.data.get(SCORE) + (1 * localStorage.scoreRate));
          } else if (gameObject2.gameObject.frame.name === "starSilver.png") {
            this.data.set("medal", 1);
            this.data.set(SCORE, this.data.get(SCORE) + (2 * localStorage.scoreRate));
          } else if (gameObject2.gameObject.frame.name === "starGold.png") {
            this.data.set("medal", 2);
            this.data.set(SCORE, this.data.get(SCORE) + (3 * localStorage.scoreRate));
          }
          gameObject2.gameObject.destroy(); // Destroy Star.

          // Check collision between Rock and Plane.
        } else {
          // Clear timers.
          this.rockCreationTimer.remove(true);
          this.environmentChangeTimer.remove(true);

          this.time.clearPendingEvents(); // Clear and reschedule timer events.
          this.time.removeAllEvents(); // Remove all active timer events.

          gameObject2.gameObject.setStatic(true); // Set the Rock to be static.
          gameObject1.gameObject.setState(states.crashed); // Set Plane state to crashed.
          this.cameras.main.shake(200, 0.02, true); // Shake game canvas for 200 milliseconds with 0.02 intensity.
        }
      }
    }
  }

  /**
   * @access private
   * @description Listens to on start event.
   * @function onStart
   * @returns {void}
   */
  private onStart(): void {
    this.starFrame = this.getStarFrame; // Get Star frame.

    // Set initial timestamp.
    const timestamp = Date.now();
    this.data.set("timestamp", timestamp);

    // Timer event which loops with creating Rocks.
    this.rockCreationTimer = this.time.addEvent({
      delay: 1500,
      callback: this.createRocks, // Callback method.
      callbackScope: this, // Callback's scope, which is GamePlay object in this case.
      repeat: -1, // Loop the animation.
    });

    // Timer event which loops with environment changes.
    this.environmentChangeTimer = this.time.addEvent({
      delay: 10000,
      callback: this.onEnvironmentChange, // Callback method.
      callbackScope: this, // Callback's scope, which is GamePlay object in this case.
      repeat: -1, // Loop the animation.
    });
  }

  /**
   * @description using getter to take the random frame
   * @get getStarFrame
   * @returns {string} star_frame
   */
  get getStarFrame(): string {
    const star_frames: string[] = [
      "starBronze.png",
      "starSilver.png",
      "starGold.png",
    ];
    const star_frame = star_frames[this.starLevel];

    return star_frame;
  }

  /**
   * @access private
   * @callback createRocks
   * @description Creates the Rocks followed by timer event.
   * @returns {void}
   */
  private createRocks(): void {
    const rock_positions: number[] = this.getRocksPositions.slice(); // Select elements from an array.

    // Get Rocks positions.
    const sky_rock_x: number = rock_positions[0];
    const sky_rock_y: number = rock_positions[1];
    const ground_rock_x: number = rock_positions[2];
    const ground_rock_y: number = rock_positions[3];

    const gap_for_plane: number = rock_positions[4]; // Get gap for Plane position.

    // Create Rock from the Sky.
    const sky_rock: Rock = new Rock({
      x: sky_rock_x,
      y: sky_rock_y,
      name: SKY_ROCK,
      texture: "sheet",
      frame: this.rockDownFrame,
      world: this.matter.world,
      options: {
        shape: this.shapes.rockDown, // Add matter shape.
      },
    });

    // Create Rock on the ground.
    const ground_rock: Rock = new Rock({
      x: ground_rock_x,
      y: ground_rock_y,
      name: GROUND_ROCK,
      texture: "sheet",
      frame: this.rockFrame,
      world: this.matter.world,
      options: {
        shape: this.shapes.rock, // Add matter shape.
      },
    });

    // Depth of this game objects within this scene (rendering position), also known as 'z-index' in CSS.
    sky_rock.setDepth(1);
    ground_rock.setDepth(1);

    this.checkIfNextLevel(); // Check if the new Star should be from the next level, i.e. a different Star type.

    // Create Star.
    new Star({
      x: ground_rock_x,
      y: ground_rock_y < 150 ? gap_for_plane - 20 : gap_for_plane + 100, // Set Star vertically in such a way so it doesn't overlaps with Ground.
      name: STAR,
      texture: "sheet",
      frame: this.starFrame,
      world: this.matter.world,
      options: {
        shape: this.shapes.star, // Add matter shape.
      },
    });
  }

  /**
   * @description Get Rocks positions.
   * @get getRocksPositions
   * @returns {number[]} rock_positions
   */
  get getRocksPositions(): number[] {
    // Set required dimensions to calculate Rock positions.
    const game_height: number = this.data.get("gameHeight");
    const game_width: number = this.data.get("gameWidth");
    const sky_rock_x: number = game_width + 100;
    const ground_rock_x: number = sky_rock_x;
    const sky_rock_y: number = Phaser.Math.Between(-100, 80);
    const gap_for_plane: number = Phaser.Math.Between(100, 280);

    const y_difference: number =
      sky_rock_y + gap_for_plane + game_height / 2.5 + game_height / 2.5; // Generate gap for Plane to go through.
    const ground_rock_y: number =
      y_difference < game_height ? game_height : y_difference; // Stick Rock to Ground.

    const rock_positions: number[] = [
      sky_rock_x,
      sky_rock_y,
      ground_rock_x,
      ground_rock_y,
      gap_for_plane,
    ];

    return rock_positions;
  }

  /**
   * @access private
   * @description Change Star type to a higher once next level is reached.
   * @function checkIfNextLevel
   * @returns {void}
   */
  private checkIfNextLevel(): void {
    const start_timestamp: any = this.data.get("timestamp"); // Get timestamp when GamePlay has started.
    const timestamp: number = Date.now(); // Get timestamp of current time.
    const time_gap: number = timestamp - start_timestamp; // Calculate difference between timestamps.

    // Check if time exceeded the time of level duration.
    if (time_gap > this.levelDuration) {
      // Reset level timestamp.
      const _timestamp = Date.now();
      this.data.set("timestamp", _timestamp);

      this.levelDuration = this.getLevelDuration; // Get level duration.
      // There are only 3 frames for Stars, therefore don't increase its level to more than to third item in an array.
      if (this.starLevel < 2) {
        this.starLevel += 1; // Set next level by increasing Star level and therefore changing Star type.
        this.starFrame = this.getStarFrame; // Get Star frame to next level.
      }
    }
  }

  /**
   * @access private
   * @callback onEnvironmentChange
   * @description Change the frames of environment for Ground and Rocks.
   * @returns {void}
   */
  private onEnvironmentChange(): void {
    const env_frame_index: number = Math.round(Phaser.Math.Between(0, 4)); // Get random environment.

    // Set Ground and Rocks frames.
    this.rockDownFrame = this.skyRockFrames[env_frame_index];
    this.rockFrame = this.groundRockFrames[env_frame_index];
    this.data.set(GROUND_FRAME, this.groundFrames[env_frame_index]);
  }

  /**
   * @access private
   * @description Listens to reset event.
   * @function onReset
   * @returns {void}
   */
  private onReset(): void {
    // Reset level timestamp.
    const timestamp = Date.now();
    this.data.set("timestamp", timestamp);

    this.starLevel = 0; // Reset Star level farme.
    this.levelDuration = this.getLevelDuration; // Get level duration.

    // Create plane with random frame.
    const index: number = Phaser.Math.Between(0, 3);
    const frame: string = this.planeFrames[index];
    this.createPlaneAnimation(frame);
  }

  /**
   * @access public
   * @description Method invoked all the time during the game. Listens to the changes of this game object properties and rerenders every frame.
   * @function update
   * @override `Phaser.Gameobjects#update`
   * @returns {void}
   */
  public update(): void {
    // Invoke all display game objects update method.
    this.children.list.forEach((gameObject) => {
      gameObject.update();
    });
  }

  /**
   * @access private
   * @description Listens to on shutdown event.
   * @function onShutdown
   * @returns {void}
   */
  private onShutdown(): void {
    this.soundHandler = null; // Null sound handler.

    // Remove the listeners for these events.
    this.events.off("changedata");
    this.events.off("gameOver")
    this.events.off("getReady");
    this.events.off("reset");
    this.events.off("onStart");
    this.events.off("play_sound");
    this.events.off("stop_sound");

    localStorage.score = this.data.get(SCORE); // Set score to possibly share it in game over popup.
    localStorage.scoreRate = 1; // Set to default scoreRate on game over.
  }
}
