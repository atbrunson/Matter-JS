
// Matter.js Module Aliases

var Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Events = Matter.Events,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Constraint = Matter.Constraint,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
	Common = Matter.Common,
	Mouse = Matter.Mouse,
	MouseConstraint = Matter.MouseConstraint,
	Vector = Matter.Vector,
	Bounds = Matter.Bounds,
	Detector = Matter.Detector;

// Create the ENGINE
var engine = Engine.create(),
	world = engine.world;

// Set WORLD Properties
world.gravity.scale = 0.0

// Create & start the RUNNER
var runner = Runner.create();
Runner.run(runner, engine);


// Create & start the RENDERER
var render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600,
		hasBounds: true,
		wireframes: false,
		showAngleIndicator: true,
		showCollisions: false,
		showVelocity: true,
		showDebug: true,
	}
});
Render.run(render);

// Add mouse element and mouse constraint to allow mouse controls
var mouse = Mouse.create(render.canvas),
	mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		}
	});

Composite.add(world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;

// get the centre of the viewport
var viewportCentre = {
	x: render.options.width * 0.5,
	y: render.options.height * 0.5
};

// create limits for the viewport
var extents = {
	min: { x: -100, y: -100 },
	max: { x: render.canvas.width + 25, y: render.canvas.height + 25 }
};

// keep track of current bounds scale (view zoom)
var boundsScaleTarget = 1,
	boundsScale = {
		x: 1,
		y: 1
	};

// create and additional render property to track if the mouse is hovering over the canvas
render.canvas.addEventListener('mouseover', function() {
	render.canvas.hoverOver = true;
	//console.log(`Hover over: ${render.canvas.hoverOver}`)
});
render.canvas.addEventListener('mouseout', function() {
	render.canvas.hoverOver = false
	//console.log(`Hover over: ${render.canvas.hoverOver}`)
});

let wheelCounter = 0

render.canvas.addEventListener('wheel', function() {
// console.log(`matter wheel: ${mouse.wheelDelta} | wheelcounter: ${wheelCounter}`)
})
//logs keyup events
document.addEventListener('keyup', function(event) {
	// console.log(`keyup: ${event.key}`);
	} 
)



// use the matter.js render events to control view
Events.on(render, 'beforeRender', function () {
	var translate;

	// BROKEN: Mouse scroll wheel controls 
	var scaleFactor = mouse.wheelDelta * -0.1;
	
	wheelCounter += mouse.wheelDelta
	

	
	if (scaleFactor !== 0) {
		if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
			boundsScaleTarget += scaleFactor;
		}
		// console.log(`scaleFactor: ${scaleFactor} | boundsScaleTarget: ${boundsScaleTarget}`);
	}

	// if scale has changed
	if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
		// smoothly translate between scale factors
		scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
		boundsScale.x += scaleFactor;
		boundsScale.y += scaleFactor;

		// scale the render bounds
		render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
		render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

		// translate so zoom is from centre of view
		translate = {
			x: render.options.width * scaleFactor * -0.5,
			y: render.options.height * scaleFactor * -0.5
		};

		Bounds.translate(render.bounds, translate);

		// update mouse
		Mouse.setScale(mouse, boundsScale);
		Mouse.setOffset(mouse, render.bounds.min);

	}

	// get vector from mouse relative to centre of viewport
	let deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
		centreDist = Vector.magnitude(deltaCentre);
	
	// if the mouse is within 80% of the viewport width or height, allow scrolling
	// this is to prevent accidental scrolling when mouse moves out of the viewport
	let scrolling = render.canvas.hoverOver
	&& Math.abs(deltaCentre.x) >= 0.80 * render.canvas.width / 2
	&& Math.abs(deltaCentre.x) < render.canvas.width / 2
	|| render.canvas.hoverOver
	&& Math.abs(deltaCentre.y) >= 0.80 * render.canvas.height / 2
	&& Math.abs(deltaCentre.y) < render.canvas.height / 2;

	//DISPLAY MOUSE POSITION
	// console.log(`
	// 	scrolling: ${scrolling}
	// 	m.offset:  ${mouse.offset.x}, ${mouse.offset.y}
	// 	m.position: ${mouse.position.x}, ${mouse.position.y}
	// 	m.absolute: ${mouse.absolute.x}, ${mouse.absolute.y}
	// 	deltaCentre: ${deltaCentre.x}, ${deltaCentre.y}
	// 	centreDist: ${centreDist}
	// 	`);

	if (scrolling) {

		// create a vector to translate the view, allowing the user to control view speed
		let direction = Vector.normalise(deltaCentre),
			speed = Math.min(10, Math.pow(centreDist, 2) * 0.00001);

		// Show so translation direction and speed
		render.context.fillText(`dir: ${direction.x}${direction.y},spd ${speed}`, mouse.absolute.x + 10, mouse.absolute.y + 10);

		// Translate in direction at speed
		translate = Vector.mult(direction, speed);

		// prevent the view moving outside the extents
		if (render.bounds.min.x + translate.x < extents.min.x)
			translate.x = extents.min.x - render.bounds.min.x;

		if (render.bounds.max.x + translate.x > extents.max.x)
			translate.x = extents.max.x - render.bounds.max.x;

		if (render.bounds.min.y + translate.y < extents.min.y)
			translate.y = extents.min.y - render.bounds.min.y;

		if (render.bounds.max.y + translate.y > extents.max.y)
			translate.y = extents.max.y - render.bounds.max.y;

		// move the view
		Bounds.translate(render.bounds, translate);

		// we must update the mouse too
		Mouse.setOffset(mouse, render.bounds.min);
			
	}


});

let box = {}

// create four boxes for walls floor & ceiling
Composite.add(world, [
	// walls
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
	Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
	Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
	Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);



//create new PLAYER object
//var player0 = new Player(400, 300, 25);
//player0.body.label = 'player0';
// console.log(player)

// var ship = new Ship(
// 	400, 	// initial x position
// 	300, 	// initial y position
// 	10 	// radius
// );

var player = new Player(400, 300, 25)
player.update()


document.onclose = function() {
	// ship.destroy()
	player.kill()
};
console.log(engine)