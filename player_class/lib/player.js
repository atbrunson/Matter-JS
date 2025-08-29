/**
 * @module Player Class for Matter.js
 * @author atbrunson github.com/atbrunson
 * @requires Matter Matter.js should be listed in the <scrpit> of the index.htlm
 * @requires KeyboardControl
 * @description This module defines a Player class that can be controlled via keyboard inputs in a Matter
 */

import { engine } from "../main.js";
import { KeyboardControl } from "./keyboard_control.js";

/**
 * Class representing a Player in the Matter.js world.
 * The Player can be controlled via keyboard inputs and interacts with the physics engine.
 *
 * @class
 * @example
 * const player = new Player(100, 100, 50);
 */

class Player {
  /**
   * @constructs Player object
   * @param {Number} x of initial location
   * @param {Number} y of initial location
   * @param {Number} height of new player model
   * @param {Number} width will default to 1/8 of the height
   * @param {{}} [options] will default with standard matter.js properties
   */

  // Classic 8-head body scaling:
  // head.h = height / 8
  // head.w = width / 3
  // mainBody.h = height * 3 / 8
  // mainBody.w = width
  // thigh = height * 2.5 / 8
  // shin = height * 2 / 8
  // foot = height / 8

  constructor(x, y, height, width = height / 8, options = {}) {
    this.proportion = height / 8;

    // Create the main player body
    this.mainBody = Matter.Bodies.rectangle(
      x,
      y,
      width,
      2.5 * this.proportion,
      {
        chamfer: { radius: width / 2.5 },
        label: "MainBody",
      }
    );

    // Add a "head" as a circle on top of the rectangle
    this.head = Matter.Bodies.circle(
      x,
      this.mainBody.bounds.min.y - this.proportion / 2,
      this.proportion / 2,
      {
        isSensor: true,
        label: "PlayerHead",
      }
    );

    // Add a "thigh" as a rectangle at the bottom
    this.thigh = Matter.Bodies.rectangle(
      x,
      this.mainBody.bounds.max.y + this.proportion,
      width * 0.95,
      this.proportion * 2,
      {
        chamfer: { radius: width / 2.5 },
        isSensor: true,
        label: "PlayerThigh",
      }
    );

    // Add a "shin" as a rectangle at the bottom
    this.shin = Matter.Bodies.rectangle(
      x,
      this.thigh.bounds.max.y + (this.proportion * 1.5) / 2,
      width * 0.9,
      this.proportion * 1.5,
      {
        chamfer: { radius: width / 2.5 },
        isSensor: true,
        label: "PlayerShin",
      }
    );

    // Add a "foot" as a rectangle at the bottom
    this.foot = Matter.Bodies.rectangle(
      x + width / 4,
      this.shin.bounds.max.y + (this.proportion * 0.5) / 2,
      width,
      this.proportion * 0.5,
      {
        chamfer: { radius: width / 4 },
        isSensor: true,
        label: "PlayerFoot",
      }
    );

    // Add an "arm" as a rectangle in the middle


    // Create a constraint (neck joint) between mainBody and head
    this.neckJoint = Matter.Composite.create({
      label: "neckJoint",
      constraints: [
        {
          bodyA: this.mainBody,
          pointA: { x: 0, y: (-this.proportion * 2.5) / 2 },
          bodyB: this.head,
          pointB: { x: 0, y: this.proportion / 2 },
          label: "neckPivot",
          stiffness: 1,
          length: 0,
          render: { visible: true, strokeStyle: "#ff00ff" },
          angularStiffness: 0.95,
        },
        {
          bodyA: this.mainBody,
          pointA: { x: -this.proportion / 4, y: (-this.proportion * 2.5) / 2 },
          bodyB: this.head,
          pointB: { x: -this.proportion / 4, y: this.proportion / 2 },
          label: "neckUp",
          stiffness: 1,
          length: 5,
          render: { visible: true, strokeStyle: "#ff00ff" },
          angularStiffness: 0.95,
        },
      ],
    });
    //     // {
    //     //   bodyA: this.mainBody,
    //     //   pointA: { x: -width / 6, y: -height / 2 }, // Add programmatically from later
    //     //   bodyB: this.head,
    //     //   pointB: { x: -width / 6, y: width / 2 },
    //     //   label: "neckUp",
    //     //   stiffness: 0.75,
    //     //   length: height / 8,
    //     //   render: { visible: false, strokeStyle: "#ff00ff" },
    //     //   angularStiffness: 0.95,
    //     // },
    //     // {
    //     //   bodyA: this.mainBody,
    //     //   pointA: { x: width / 6, y: -height / 2 },
    //     //   bodyB: this.head,
    //     //   pointB: { x: width / 6, y: width / 2 },
    //     //   label: "neckDown",
    //     //   stiffness: 0.25,
    //     //   length: height / 8,
    //     //   render: { visible: false, strokeStyle: "#ff00ff" },
    //     //   angularStiffness: 0.95,
    //     // },
    //   ],
    // });
    console.log("neckJoint:", this.neckJoint);

    // Create a constraint (hip joint) between mainBody and head
    // this.hipJoint = Constraint.create({
    //   bodyA: this.mainBody,
    //   pointA: { x: 0, y: height / 2 },
    //   bodyB: this.foot,
    //   pointB: { x: 0, y: -width / 2 },
    //   label: "hipJoint",
    //   stiffness: 1,
    //   length: 0,
    //   render: { visible: true, strokeStyle: "#ff00ff" },
    //   angularStiffness: 0.9,
    //   // set limit to angle of motion
    // });

    // Create a composite containing all parts
    this.body = Matter.Composite.create({ label: "PlayerComposite" });
    Matter.Composite.add(this.body, [
      this.mainBody,
      this.head,
      this.thigh,
      this.shin,
      this.foot,
      this.neckJoint.constraints,
      // this.hipJoint,
    ]);
    // Optionally, you can store references to the parts if needed

    Matter.World.add(engine.world, this.body);

    // Setup the player controller
    this.controller = new KeyboardControl();
    this.controller.bindKey(
      "w",
      () => this.moveUp(5),
      () => this.stop()
    );
    this.controller.bindKey(
      "a",
      () => this.moveLeft(5),
      () => this.stop()
    );
    this.controller.bindKey(
      "s",
      () => this.moveDown(5),
      () => this.stop()
    );
    this.controller.bindKey(
      "d",
      () => this.moveRight(5),
      () => this.stop()
    );
    this.controller.bindKey(
      "e",
      () => this.rotateRight(0.1),
      () => this.rotateLeft(0)
    );
    this.controller.bindKey(
      "q",
      () => this.rotateLeft(0.1),
      () => this.rotateRight(0)
    );

    this.controller.init();

    console.log("Player:", this);
    
    //Calls methods that should be calculated in time with the engine
    //NOTE:
    Matter.Events.on(engine, "beforeUpdate", () => {
      this.update();
    });
  }

  /**
   * @method follow
   * @description This method is intended to keep the player object centered in the viewport.
   * @todo: implement keeping the Player object centered in the viewPort
   */
  follow() {
    // Needs viewPoint logic
  }
  /**
   * @method moveUp
   * @param {Number} speed - The speed at which the player moves up.
   * @description Moves the player up by setting its velocity.
   */
  moveUp(speed) {
    Matter.Body.setVelocity(this.mainBody, {
      x: this.mainBody.velocity.x,
      y: -speed,
    });
    Matter.Body.setVelocity(this.mainBody, {
      x: this.mainBody.velocity.x,
      y: -speed,
    });
  }
  /**
   * @method moveLeft
   * @param {Number} speed - The speed at which the player moves left.
   * @description Moves the player left by setting its velocity.
   */
  moveLeft(speed) {
    Matter.Body.setVelocity(this.mainBody, {
      x: -speed,
      y: this.mainBody.velocity.y,
    });
    Matter.Body.setVelocity(this.mainBody, {
      x: -speed,
      y: this.mainBody.velocity.y,
    });
  }
  /**
   * @method moveDown
   * @param {Number} speed - The speed at which the player moves down.
   * @description Moves the player down by setting its velocity.
   */
  moveDown(speed) {
    Matter.Body.setVelocity(this.mainBody, {
      x: this.mainBody.velocity.x,
      y: speed,
    });
    Matter.Body.setVelocity(this.mainBody, {
      x: this.mainBody.velocity.x,
      y: speed,
    });
  }
  /**
   * @method moveRight
   * @param {*} speed  - The speed at which the player moves right.
   * @description Moves the player right by setting its velocity.
   */
  moveRight(speed) {
    Matter.Body.setVelocity(this.mainBody, {
      x: speed,
      y: this.mainBody.velocity.y,
    });
    Matter.Body.setVelocity(this.mainBody, {
      x: speed,
      y: this.mainBody.velocity.y,
    });
  }

  /** @method rotateLeft
   * @param {Number} rotation - The amount to rotate the player left.
   */
  rotateLeft(rotation) {
    Matter.Body.setAngularVelocity(this.mainBody, -rotation);
    Matter.Body.setAngularVelocity(this.mainBody, -rotation);
  }
  /** @method rotateRight
   * @param {Number} rotation - The amount to rotate the player right.
   */
  rotateRight(rotation) {
    Matter.Body.setAngularVelocity(this.mainBody, rotation);
    Matter.Body.setAngularVelocity(this.mainBody, rotation);
  }

  /**
   * @method stop
   * @description reverses the velocity of the player, effectively stopping it.
   */
  stop() {
    Matter.Body.setVelocity(this.mainBody, { x: 0, y: 0 });
    // Log the speed for debugging purposes
    // console.log(`player speed: ${this.mainBody.speed}`);
  }
  /**
   * @method jump
   * @param {Number} force - The force applied to the player to make it jump.
   * @description Applies a force to the player to make it jump.
   */
  jump(force) {
    Matter.Body.applyForce(this.mainBody, this.mainBody.position, {
      x: 0,
      y: -force,
    });
  }

  update() {
    // Additional logic to update player state
  }

  /**
   * @method kill
   * @description Removes the player from the world and frees up resources.
   */
  kill() {
    Matter.World.remove(engine.world, this.body);
    this.controller.cleanup();
    this.body = null;
    this.controller = null;
  }
}
export { Player }