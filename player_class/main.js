
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

// Set properties of the WORLD
engine.gravity.scale = 0.0

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
		showAngleIndicator: false,
		showCollisions: false,
		showVelocity: true,
		showDebug: false,
	}
});
Render.run(render);

//logs keyup events
document.addEventListener('keyup', function(event) {
	// console.log(`keyup: ${event.key}`);
	} 
)

// create four boxes for walls floor & ceiling
Composite.add(world, [
	// walls
	Bodies.rectangle(400, -25, 850, 50, { isStatic: true }),
	Bodies.rectangle(400, 625, 850, 50, { isStatic: true }),
	Bodies.rectangle(825, 300, 50, 700, { isStatic: true }),
	Bodies.rectangle(-25, 300, 50, 700, { isStatic: true })
]);



//create new PLAYER object
//var player0 = new Player(400, 300, 25);
//player0.body.label = 'player0';
// console.log(player)

var ship = new Ship(
	400, 	// initial x position
	300, 	// initial y position
	15 		// radius
);
// Events.on(engine,"beforeUpdate", function(){
// 	ship.update()
// });


// var player = new Player(400, 300, 100)
// document.onclose = function() {
// 	// ship.destroy()
// 	player.kill()
// };

//let progbar1 = new ProgressBar (25,325,ship,"fuel",1,0)
let progbar2 = new ProgressBar (35,325,ship,"fuel",1,0)

