/** Player Class
 * The @class Player class creates a new controllable
 * object to interact within a predefined engine.world
 * 
 * The Player object needs at least an origin & a height:
 * @param x of origin
 * @param y of origin
 * @param height of Player object
*/
class Player {
	constructor(x, y, height, width = height/2,  options = {}) {
		
		this.body = Matter.Bodies.rectangle(x, y, width, height, {
			chamfer: { radius: width/2.2 }
			}
		);
		this.width = width;
		this.height = height;
		Matter.World.add(engine.world, this.body);
	}

	follow(){
		// TODO: implement keeping the Player
		 // object centered in the viewPort 
	}
	moveLeft(speed) {
		Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
	}

	moveRight(speed) {
		Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });
	}

	jump(force) {
		Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
	}

	update() {
		// Additional logic to update player state

	}

}