
// Matter.js Module Aliases

var Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Events = Matter.Events,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
	Common = Matter.Common,
	Mouse = Matter.Mouse,
	MouseConstraint = Matter.MouseConstraint,
	Vector = Matter.Vector,
	Bounds = Matter.Bounds;

// Create the ENGINE
let engine = Engine.create(),
	world = engine.world;

// Set WORLD Properties
world.gravity.scale = 0.0

// Create the RUNNER
let runner = Runner.create();
Runner.run(runner, engine);


// Create RENDERER
let render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600,
		hasBounds: true,
		wireframes: false,
		showAngleIndicator: true,
		showCollisions: true,
		showVelocity: true,
		showDebug: true,
	}
});


Render.run(render);

// Add MOUSE control
let mouse = Mouse.create(render.canvas),
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
	max: { x: render.canvas.width + 100, y: render.canvas.height + 100 }
};

// keep track of current bounds scale (view zoom)
var boundsScaleTarget = 1,
	boundsScale = {
		x: 1,
		y: 1
	};

// use a render event to control our view
Events.on(render, 'beforeRender', function () {
	var world = engine.world,
		mouse = mouseConstraint.mouse,
		translate;

	// mouse wheel controls zoom
	var scaleFactor = mouse.wheelDelta * -0.1;
	if (scaleFactor !== 0) {
		if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
			boundsScaleTarget += scaleFactor;
		}
	}

	// if scale has changed
	if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
		// smoothly tween scale factor
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
	var deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
		centreDist = Vector.magnitude(deltaCentre);
 

	if (Math.abs(deltaCentre.x) > 0.975 * render.canvas.width / 2		//Used canvas pecentages for boundry dection 97.5% --> 100%
		&& Math.abs(deltaCentre.x) < render.canvas.width / 2
		|| Math.abs(deltaCentre.y) > 0.975 * render.canvas.height / 2
		&& Math.abs(deltaCentre.y) < render.canvas.height / 2) {
		
		// create a vector to translate the view, allowing the user to control view speed
		var direction = Vector.normalise(deltaCentre), // <-- speed = 0 at 0, 90, 180, 270 degrees from normalized?
			speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.00001);
		
		// Show so translatation direction and speed
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
	box,
	// walls
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
	Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
	Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
	Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);




//create new PLAYER object
//let player1 = new Player(250, 250, 100)

