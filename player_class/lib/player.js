/**
 * @module Player Class for Matter.js
 * @author atbrunson github.com/atbrunson
 * @requires Matter 
 */

/** @class Player Object that accept user input to interact with the engine.world */



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

		this.body = Matter.Bodies.rectangle(x, y, width , height, { chamfer: { radius: width / 2.2 } });
		Matter.World.add(engine.world, this.body);
	}

	init() {
		// Initialize keyboard control
		this.playerController = new KeyboardControl();
		
		// Bind keys to player actions
		this.playerController.bindKey('w', () => this.moveUp(this.speed));
		this.playerController.bindKey('a', () => this.moveLeft(this.speed));
		this.playerController.bindKey('s', () => this.moveDown(this.speed));
		this.playerController.bindKey('d', () => this.moveRight(this.speed));
	}

	/**
	 * @todo: implement keeping the Player object centered in the viewPort
	 */
	follow() {
		// Needs viewPoint logic
	}
	moveLeft(speed) {
		Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
	}

	moveRight(speed) {
		Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });
	}

	moveUp(speed) {
		Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -speed });
	}

	moveDown(speed) {
		Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: speed });
	}

	rotateLeft(rotation) {
		Matter.Body.setAngularVelocity(this.body, {})
	}


	// jump(force) {
	// 	Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
	// }

	update() {

		// Check for key bindings and move the player accordingly
		if (this.playerController.keyBindings['w']) {
			this.moveUp(this.speed);
		}
		if (this.playerController.keyBindings['a']) {
			this.moveLeft(this.speed);
		}
		if (this.playerController.keyBindings['s']) {
			this.moveDown(this.speed);
		}
		if (this.playerController.keyBindings['d']) {
			this.moveRight(this.speed);
		}
		//else {speed = 0;}
	}
}
