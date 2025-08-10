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
	constructor(x, y, radius, options = {}) {
		// build the ship from array of vertices
		this.body = Bodies.fromVertices(x, y, [

			{ x: x + .75 * radius, y: y - radius / 5 },
			{ x: x + .75 * radius, y: y + radius / 5 },
			{ x: x + radius, y: y - radius },
			{ x: x - radius, y: y - radius / 500 },
			{ x: x - radius, y: y + radius / 500 },
			{ x: x + radius, y: y + radius },
		]);

		// set the ships initial fuel value
		this.fuel = radius * 0.025
		
		// FOR TESTING ONLY: adds the fuel mass to the ship
		Matter.Body.setMass(this.body, this.fuel + radius * 0.1);
		Matter.Body.setCentre(this.body, { x: x + .25 * radius, y: y });
		Matter.World.add(engine.world, this.body);

		// Setup the player controller
		this.controller = new KeyboardControl();
		this.controller.bindKey('w', () => this.forward(0.01));
		this.controller.bindKey('a', () => this.portward(0.005));
		this.controller.bindKey('s', () => this.aftward(0.0025));
		this.controller.bindKey('d', () => this.starward(0.005));
		this.controller.bindKey('e', () => this.rotateRight(0.05), () => this.rotateLeft(0));
		this.controller.bindKey('q', () => this.rotateLeft(0.05), () => this.rotateRight(0));

		this.controller.init();
		console.log('Ship created at', x, y, 'with size', radius);
		console.log(this);

		//Calls methods that should be calculated in time with the engine
		//NOTE: 
		Events.on(engine, "beforeUpdate", () => {
			this.update();
		});
	}
	/**
	 * @method update
	 * @description Updates the player state. This can be used to implement additional logic such as animations or physics interactions.
	 * @todo: Implement player state updates, such as animations or physics interactions.
	 */
	update() {
		if (this.fuel < 0.00) ship.fuel = 0
		this.speed = this.body.speed
		// this.handleThrust()
		/*
		Mass Balance:
			Any mass loaded, unloaded, ejected or jettisoned
			
		Engergy Balance:
			Any Radiant, Conductive, Convective
			Reactors turn mass into useable energy
			Thrusters eject energitc mass as propellant
			Produciton Modules use energy to process mass
		*/

		//console.log(this.fuel)

	}
	/**
	 * @method assemble
	 * @description Initializes ship by calculating thruster positions & summing up the thrust forces in each direction.
	 */
	assemble() {
	/*
		Check for thrusters
		for (thruster in thrusters){
			this.thrust += thruster.vector 
		}
		Check for storage modules
		Check for production modules
		Check for 
		
		Check for minimum ship systems:
		- (1) Thruster
		- (1) life support
		- (1) control module
		Matter.Composite.add(module || component)
		Matter.Constraint.create(this.body , module.body, CONSTRAINT_TYPE)
	*/
	}


	/**
	 * @method follow
	 * @description This method is intended to keep the player object centered in the viewport.
	 * @todo: implement keeping the Player object centered in the viewPort
	 */
	follow() {
		// Needs viewPoint logic
	};
	/**
	 * @method thrust
	 * @param {Number} force - The speed at which the player moves up.
	 * @description Moves the player up by setting its velocity.
	 */
	forward(force) {
		if (this.fuel > 0.00) {
			Matter.Body.applyForce(this.body, this.body.position, {
				x: force * Math.sin(this.body.angle - Math.PI / 2),
				y: -force * Math.cos(this.body.angle - Math.PI / 2)
			});

			this.fuel -= force * 0.5; // Decrease fuel based on thrust}

		}
	};
	/** */
	aftward(force) {
		if (this.fuel > 0.00) {
			Matter.Body.applyForce(this.body, this.body.position, {
				x: -force * Math.sin(this.body.angle - Math.PI / 2),
				y: force * Math.cos(this.body.angle - Math.PI / 2)
			});
			this.fuel -= 0.01; // Decrease fuel on thrust}
		}
	};
	/** */
	portward(force) {
		if (this.fuel > 0.00) {
			Matter.Body.applyForce(this.body, this.body.position, {
				x: -force * Math.cos(this.body.angle - Math.PI / 2),
				y: -force * Math.sin(this.body.angle - Math.PI / 2)
			});
			this.fuel -= 0.01; // Decrease fuel on thrust}
		}
	};
	/** */
	starward(force) {
		if (this.fuel > 0.00) {
			Matter.Body.applyForce(this.body, this.body.position, {
				x: force * Math.cos(this.body.angle - Math.PI / 2),
				y: force * Math.sin(this.body.angle - Math.PI / 2)
			});
			this.fuel -= 0.01; // Decrease fuel on thrust
		}
	};
	/** 
	 * @method rotateLeft
	 * @param {Number} rotation - The amount to rotate the player left.
	*/
	rotateLeft(rotation) {
		Matter.Body.setAngularVelocity(this.body, -rotation)
		//console.log(`Rotating right by ${this.body.angle}`)
	};
	/**
	 * @method rotateRight
	 * @param {Number} rotation - The amount to rotate the player right.
	*/
	rotateRight(rotation) {
		Matter.Body.setAngularVelocity(this.body, rotation);
		//console.log(`Rotating right by ${this.body.angle}`)
	};
	/**
	 * @method stop
	 * @description sets ship velocity to {x: 0, y: 0}
	 */
	stop() {
		Matter.Body.setVelocity(this.body, {
			x: 0,
			y: 0
		});
		// Log the speed for debugging purposes
		console.log(`${this} STOPPED!`);
	};
	/**	*/
	handleThrust() {
		if (this.controller.acitveKeys.size) {
			let showkeys = '';
			this.controller.acitveKeys.forEach(key => {
				showkeys += key + ' ';
			});
			console.log(showkeys);
		}
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



