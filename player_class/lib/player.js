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
	 * @param {{}} [options] will default with standard matter.js properies
	 */
	constructor(x, y, height, width = height / 2, options = {}) {

		this.body = Matter.Bodies.rectangle(x, y, width, height, { chamfer: { radius: width / 2.2 } });
		this.body.label = 'Player';
		Matter.World.add(engine.world, this.body);

		// Setup the player controler
		this.controler = new KeyboardControl();
		this.controler.bindKey('w', () => this.moveUp(5), () => this.stop());
		this.controler.bindKey('a', () => this.moveLeft(5), () => this.stop());
		this.controler.bindKey('s', () => this.moveDown(5), () => this.stop());
		this.controler.bindKey('d', () => this.moveRight(5), () => this.stop());
		this.controler.bindKey('e', () => this.rotateRight(0.1), () => this.rotateLeft(0));
		this.controler.bindKey('q', () => this.rotateLeft(0.1), () => this.rotateRight(0));

		this.controler.init();
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
		Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -speed });
	}
	/**
	 * @method moveLeft
	 * @param {Number} speed - The speed at which the player moves left.
	 * @description Moves the player left by setting its velocity.
	 */
	moveLeft(speed) {
		Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
	}
	/**
	 * @method moveDown
	 * @param {Number} speed - The speed at which the player moves down.
	 * @description Moves the player down by setting its velocity.
	 */
	moveDown(speed) {
		Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: speed });
	}
	/**
	 * @method moveRight
	 * @param {*} speed  - The speed at which the player moves right.
	 * @description Moves the player right by setting its velocity.
	 */
	moveRight(speed) {
		Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });
	}

	/** @method rotateLeft
	 * @param {Number} rotation - The amount to rotate the player left.
	*/
	rotateLeft(rotation) {
		Matter.Body.setAngularVelocity(this.body, -rotation)
	}
	/** @method rotateRight
	 * @param {Number} rotation - The amount to rotate the player right.
	*/
	rotateRight(rotation) {
		Matter.Body.setAngularVelocity(this.body, rotation)
	}

	/**
	 * @method stop
	 * @description reverses the velocity of the player, effectively stopping it.
	 */
	stop() {
		while (this.body.speed >= 0.1){
			Matter.Body.setVelocity(this.body, {
				x: 0,
				y: 0
			});
			// Log the speed for debugging purposes
			console.log(`player speed: ${this.body.speed}`);
		}
	}
	/**
	 * @method jump
	 * @param {Number} force - The force applied to the player to make it jump.
	 * @description Applies a force to the player to make it jump.
	 */
	jump(force) {
		Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
	}

	/**
	 * @method update
	 * @description Updates the player state. This can be used to implement additional logic such as animations or physics interactions.
	 * @todo: Implement player state updates, such as animations or physics interactions.
	 */
	update() {
		// Additional logic to update player state
	}

	/**
	 * @method destroy
	 * @description Removes the player from the world and cleans up resources.
	 */
	destroy() {
		Matter.World.remove(engine.world, this.body);
		this.controler.cleanup();
		this.body = null;
		this.controler = null;
	}
}