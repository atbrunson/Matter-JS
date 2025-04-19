// module aliases
var Engine = Matter.Engine,
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
var engine = Engine.create(),
	world = engine.world;

// set world properties
	world.gravity.scale = 0.0

// create renderer
var render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600,
		showAngleIndicator: true,
		showCollisions: true,
		showVelocity: true,
		showDebug: true,
	}
});

console.log("")
console.table(render)

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

// create two boxes and a ground
// let boxA = Bodies.rectangle(400, 200, 20, 20);
//let boxB = Bodies.rectangle(450, 50, 20, 20);
let ground = Bodies.rectangle(400, 625, 1000, 60, { isStatic: true });
let leftWall = Bodies.rectangle(-25, 300, 60, 1000, { isStatic: true});
let rightWall = Bodies.rectangle(825, 300, 60, 1000, { isStatic: true });
ground.restitution = 1

let flinks = Composites.stack(250, 175 ,2 ,1 ,20 ,20 , function(x, y) {
	return Bodies.rectangle(x , y , 100, 50, {

			})
		});

Composites.chain(flinks, 0.45 , 0.45, -0.45, -0.45, { stiffness: .000001, length: 20, render: { type: 'line' } })


// add all of the bodies to the world
Composite.add(world,[ ground, leftWall, rightWall, flinks]);


