/**
 * @module Ship Class for Matter.js
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
 * const ship = new Ship(100, 100, 50);
 */

class Ship {
	/**
	 * @constructs Ship object
	 * @param {Number} x of initial location
	 * @param {Number} y of initial location
	 * @param {Number} height of new object
	 * @param {Number} width will default to half the height
	 * @param {{}} [options] will default with standard matter.js properties
	 */
	constructor(x, y, sides, radius, options = {}) {
        
    // build the ship from array of bodies
    this.body = Bodies.polygon(x, y, sides, radius, { chamfer: { radius: radius / 6 } }),

		//Matter.Body.setAngle(this.body, Math.PI/2);
    Matter.Body.setCentre(this.body, { x: x+10, y: y });
    Matter.World.add(engine.world, this.body);

		// Setup the player controller
		this.controller = new KeyboardControl();
		this.controller.bindKey('w', () => this.thrust(0.01));
		this.controller.bindKey('e', () => this.rotateRight(0.1), () => this.rotateLeft(0));
		this.controller.bindKey('q', () => this.rotateLeft(0.1), () => this.rotateRight(0));

		this.controller.init();
		console.log('Ship created at', x, y, 'with size', radius);
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
	 * @method thrust
	 * @param {Number} force - The speed at which the player moves up.
	 * @description Moves the player up by setting its velocity.
	 */
	thrust(force) {
		Matter.Body.applyForce(this.body, this.body.position, {
			x: force * Math.sin(this.body.angle - Math.PI / 2),
			y: -force * Math.cos(this.body.angle - Math.PI / 2)
		});
	}

	/** @method rotateLeft
	 * @param {Number} rotation - The amount to rotate the player left.
	*/
	rotateLeft(rotation) {
		Matter.Body.setAngularVelocity(this.body, -rotation)
        console.log(`Rotating right by ${this.body.angle}`)
	}
	/** @method rotateRight
	 * @param {Number} rotation - The amount to rotate the player right.
	*/
	rotateRight(rotation) {
		Matter.Body.setAngularVelocity(this.body, rotation);
        console.log(`Rotating right by ${this.body.angle}`)
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
		this.controller.cleanup();
		this.body = null;
		this.controller = null;
	}
}