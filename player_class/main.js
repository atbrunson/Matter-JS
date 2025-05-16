
// Matter.jd Module Aliases

const
	Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Body = Matter.Body,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Constraint = Matter.Constraint,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Bodies = Matter.Bodies;

// Create the ENGINE & the WORLD
let engine = Engine.create(),
	world = engine.world;

// Set WORLD Properties
world.gravity.scale = 0.0

// Create the RUNNER
let runner = Runner.create();

// Run the ENGINE
Runner.run(runner, engine);


// Create RENDERER
let render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600,
		wireframes: false,
		showAngleIndicator: true,
		showCollisions: true,
		showVelocity: true,
		showDebug: true,
	}
});

// Run the RENDERER
Render.run(render);

// Arrange the VIEWPORT in the world
// TODO: implement zoom & edge scrolling
Render.lookAt(render, {
	min: { x: 0, y: 0 },
	max: { x: 800, y: 600 }
});

// add mouse control
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

// create four boxes for walls floor & ceiling
let box = Composite.create()

let ground = Bodies.rectangle(400, 625, 1000, 60, {
	isStatic: true,
	restitution: 1,

});
let leftWall = Bodies.rectangle(-25, 300, 60, 1000, {
	isStatic: true,
	restitution: 1,

});

let rightWall = Bodies.rectangle(825, 300, 60, 1000, {
	isStatic: true,
	restitution: 1,

});

let ceiling = Bodies.rectangle(400, -25, 1000, 60, {
	isStatic: true,
	restitution: 1,

});

Composite.add(box, ground)
Composite.add(box, leftWall)
Composite.add(box, rightWall)
Composite.add(box, ceiling)


// generate ring of bodies
// TODO:
// - create function that generates a ring of bodies
// - ringChain(, ringDia{default => no collisions}) circumference = bodies

let player1 = new Player(250, 250, 100)






Composite.add(world,
	[box]
);



