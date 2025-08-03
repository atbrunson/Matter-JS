/**
 * @module Player Class for Matter.js
 * @author atbrunson github.com/atbrunson
 * @requires Matter
 * @requires KeyboardControl
 * @description This module defines a Player class that can be controlled via keyboard inputs in a Matter 
 */

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
	 * @param {Number} height of new object
	 * @param {Number} width will default to half the height
	 * @param {{}} [options] will default with standard matter.js properties
	 */
	constructor(x, y, height, width = height / 2, options = {}) {

		// Create the main player body
		this.mainBody = Bodies.rectangle(x, y, width, height, {
			chamfer: { radius: width / 2.2 },
			label: 'MainBody',
			...options
		});

		// Example: Add a "head" as a circle on top of the rectangle
		this.head = Bodies.circle(x, y - (width / .80), width / 2, {
			isSensor: true,
			label: 'PlayerHead'
		});

		// Example: Add a "foot" as a circle at the bottom
		this.foot = Bodies.rectangle(x, y + height * 0.85, width / 1.5, height / 1.5, {
			chamfer: { radius: width / 4 },
			isSensor: true,
			label: 'PlayerFoot'
		});

		// Create a constraint (neck joint) between mainBody and head
		this.neckJoint = Constraint.create({
			bodyA: this.mainBody,
			pointA: { x: 0, y: -height / 2 },
			bodyB: this.head,
			pointB: { x: 0, y: width / 2 },
			label: 'neckJoint',
			stiffness: 1,
			length: 0,
			render: { strokeStyle: "#ff00ff" }
		});

		// Create a constraint (hip joint) between mainBody and head
		this.hipJoint = Constraint.create({
			bodyA: this.mainBody,
			pointA: { x: 0, y: height / 2 },
			bodyB: this.foot,
			pointB: { x: 0, y: - width / 2 },
			label: 'hipJoint',
			stiffness: 1,
			length: 0,
			render: { strokeStyle: "#ff00ff" }
		});

		// Create a composite containing all parts
		this.body = Composite.create({ label: 'PlayerComposite' });
		Composite.add(this.body, [this.mainBody, this.head, this.foot, this.neckJoint, this.hipJoint]);
		// Optionally, you can store references to the parts if needed

		Matter.World.add(engine.world, this.body);

		// Setup the player controller
		this.controller = new KeyboardControl();
		this.controller.bindKey('w', () => this.moveUp(5), () => this.stop());
		this.controller.bindKey('a', () => this.moveLeft(5), () => this.stop());
		this.controller.bindKey('s', () => this.moveDown(5), () => this.stop());
		this.controller.bindKey('d', () => this.moveRight(5), () => this.stop());
		this.controller.bindKey('e', () => this.rotateRight(0.1), () => this.rotateLeft(0));
		this.controller.bindKey('q', () => this.rotateLeft(0.1), () => this.rotateRight(0));

		this.controller.init();

		console.log('Player created at', x, y, 'with size', width, height);

		console.log(this);
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
		Matter.Body.setVelocity(this.mainBody, { x: this.mainBody.velocity.x, y: -speed });
	}
	/**
	 * @method moveLeft
	 * @param {Number} speed - The speed at which the player moves left.
	 * @description Moves the player left by setting its velocity.
	 */
	moveLeft(speed) {
		Matter.Body.setVelocity(this.mainBody, { x: -speed, y: this.mainBody.velocity.y });
	}
	/**
	 * @method moveDown
	 * @param {Number} speed - The speed at which the player moves down.
	 * @description Moves the player down by setting its velocity.
	 */
	moveDown(speed) {
		Matter.Body.setVelocity(this.mainBody, { x: this.mainBody.velocity.x, y: speed });
	}
	/**
	 * @method moveRight
	 * @param {*} speed  - The speed at which the player moves right.
	 * @description Moves the player right by setting its velocity.
	 */
	moveRight(speed) {
		Matter.Body.setVelocity(this.mainBody, { x: speed, y: this.mainBody.velocity.y });
	}

	/** @method rotateLeft
	 * @param {Number} rotation - The amount to rotate the player left.
	*/
	rotateLeft(rotation) {
		Matter.Body.setAngularVelocity(this.mainBody, -rotation)
	}
	/** @method rotateRight
	 * @param {Number} rotation - The amount to rotate the player right.
	*/
	rotateRight(rotation) {
		Matter.Body.setAngularVelocity(this.mainBody, rotation)
	}

	/**
	 * @method stop
	 * @description reverses the velocity of the player, effectively stopping it.
	 */
	stop() {
		Matter.Body.setVelocity(this.mainBody, { x: 0, y: 0 });
		// Log the speed for debugging purposes
		console.log(`player speed: ${this.mainBody.speed}`);
	}
	/**
	* @method jump
	* @param {Number} force - The force applied to the player to make it jump.
	* @description Applies a force to the player to make it jump.
	*/
	jump(force) {
		Matter.Body.applyForce(this.mainBody, this.mainBody.position, { x: 0, y: -force });
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