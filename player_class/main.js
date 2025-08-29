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
engine.gravity.scale = 0.0;

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
  },
});
Render.run(render);

// Create composite for our contain{er
var container = Composite.create({
  bodies: [
    // Specifies four rectangles for the walls floor & ceiling
    Bodies.rectangle(400, -25, 850, 50, { isStatic: true, label: "Ceiling" }),
    Bodies.rectangle(400, 625, 850, 50, { isStatic: true, label: "Floor" }),
    Bodies.rectangle(825, 300, 50, 700, {
      isStatic: true,
      label: "Right Wall",
    }),
    Bodies.rectangle(-25, 300, 50, 700, { isStatic: true, label: "Left Wall" }),
  ],
  label: "Container",
});
Composite.add(world, container);

//create new PLAYER object
var player = new Player(400, 300, 200);
player.body.label = "player";
//console.log(player);

// var ship = new Ship(
// 	400, 	// initial x position
// 	300, 	// initial y position
// 	15 		// radius
// );
//let progbar1 = new ProgressBar (25,325,ship,"fuel",1,0)
//let progbar2 = new ProgressBar(35, 325, ship, "fuel", 1, 0);

// var player = new Player(400, 300, 100)
// document.onclose = function() {
// 	// ship.destroy()
// 	player.kill()
// };


var mouse = Matter.Mouse.create(render.canvas),
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;

// Show so translation direction and speed
ctx = render.canvas.getContext("2d");

// create an additional render property to track if the mouse is hovering over the canvas
render.canvas.hoverOver = false;

render.canvas.addEventListener("mouseover", function () {
  render.canvas.hoverOver = true;
  //console.log(`Hover over: ${render.canvas.hoverOver}`)
});
render.canvas.addEventListener("mouseout", function () {
  render.canvas.hoverOver = false;
  //console.log(`Hover over: ${render.canvas.hoverOver}`)
});

console.log(render);

ctx.font = "12px sans-serif";

Events.on(render, "afterRender", function () {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(211, 211, 211, 0.75)";
  ctx.strokeRect(10, 325, 5, 250);
  ctx.fillRect(10, 325, 5, 50);

  if (render.canvas.hoverOver) {
    ctx.fillStyle = "lightgrey";
    ctx.fillText(
      `x: ${Math.floor(mouse.absolute.x)} y: ${Math.floor(mouse.absolute.y)}`,
      mouse.absolute.x + 20,
      mouse.absolute.y + 25
    );
    //console.log(mouse.absolute.x + 50, mouse.absolute.y + 50)
  }
});
