//matter.js testing


// module aliases
const Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Body = Matter.Body,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Constraint = Matter.Constraint,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Bodies = Matter.Bodies;

// create engine
let engine = Engine.create(),
	world = engine.world;

// set world properties
	world.gravity.scale = 0.0

// create renderer
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

// fit the render viewport to the scene
Render.lookAt(render, {
	min: { x: 0, y: 0 },
	max: { x: 800, y: 600 }
});

// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

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

let linkDia = 30;
let linkMass = 10;
let cLength = 10;
let cDamp = 1
let cStiff = .1


// generate ring of bodies
// TODO:
// - create function that generates a ring of bodies
// - ringChain(, ringDia{default => no collisions}) circumference = bodies

let flinks = Composites.stack(50, 175, 10, 1, 5, 5 , function(x, y) {
	return Bodies.circle(x , y , linkDia, {
			render: {fillStyle: "darkgrey"},
			mass: linkMass,
			dampening: cDamp,
	
			})
		});


// Composites.chain(flinks, 0.45 , 0, -0.45, 0, {
// 	stiffness: cStiff,
// 	length: cLength,
// 	mass: linkMass,
// 	render: {
// 		type: 'spring', 
// 		visible: true,
// 		},

// 	})

// Add a constraint from the last chain body to the first chain body
// TODO:
// - should add closing constraint in the same way that the Composites.chain() does
// - create function to close a chained composite
// > funciton closeLoop(chain)

// Composite.add(flinks, Constraint.create({
// 	bodyA: flinks.bodies[flinks.bodies.length - 1],
// 	pointA: { x: 30, y: 0},
// 	bodyB: flinks.bodies[0],
// 	pointB: { x: -30, y: 0 },
// 	stiffness: cStiff,
// 	length: cLength,
	
// 	render: {
// 		type: 'spring',
// 		visible: true,
// 	},
// 	}));

flinks.bodies[0].render.fillStyle = "Red"
flinks.bodies[flinks.bodies.length-1].render.fillStyle = "Blue"



Composite.add(world,
	[box, flinks]
);

console.log(world)



