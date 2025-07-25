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
	 * @param {{}} [options] will default with standard matter.js properies
	 */
	constructor(x, y, height, width = height / 2, options = {}) {

		this.body = Matter.Bodies.rectangle(x, y, width , height, { chamfer: { radius: width / 2.2 } });
		Matter.World.add(engine.world, this.body);
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
		// Additional logic to update player state

	}

}