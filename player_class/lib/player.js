class Player {
	constructor(x, y, width, height, options = {}) {
		this.body = Matter.Bodies.rectangle(x, y, width, height, { ...options });
		Matter.World.add(engine.world, this.body);
		this.width = width;
		this.height = height;
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

	render(ctx) {
		const { x, y } = this.body.position;
		ctx.beginPath();
		ctx.rect(x - this.width / 2, y - this.height / 2, this.width, this.height);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.closePath();
	}
}