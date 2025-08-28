// Matter.js Libaray Aliases
const Common = Matter.Common,
  Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Events = Matter.Events,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Constraint = Matter.Constraint,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Vector = Matter.Vector,
  Bounds = Matter.Bounds,
  Detector = Matter.Detector;

// Create ENGINE & top level COMPOSITE "world"
const engine = Engine.create(),
  world = engine.world;

export { engine };
import { Ship } from "./lib/ship.js";
import { ProgressBar } from "./lib/progress_bar.js";

// Set WORLD Properties
engine.gravity.scale = 0.0;

// Create & start the RUNNER
var runner = Runner.create();
Runner.run(runner, engine);

// Create & start the RENDERER
const render = Render.create({
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
export { render };

//---FOR DEBUGGING ONLY---//
document.engine = engine;
document.render = render;

// Create composite for our contain{er
const container = Composite.create({
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

// Create MOUSE Object and MouseContraint
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
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

// Create PLAYER object
// import { Player } from "./lib/player.js";
// var player0 = new Player(400, 300, 25);
// player0.body.label = 'player0';

// Create SHIP object
const ship = new Ship(400, 300, 25);
ship.body.label = "ship";

window.ship = ship;
//Create Progress_Bar
window.progbar1 = new ProgressBar(25, 300, ship, "ship.fuel", 0, 1);
//let progbar2 = new ProgressBar(35, 325, ship, "fuel", 1, 0)
console.log("progBar1", progbar1);

//---MAIN_GAME_LOOP---//
// Events.on(engine, "beforeUpdate", function () {
// 	//Everything below this will run before every engine update
// })

const ctx = render.canvas.getContext("2d");

// TODO: add this as method to the MOUSE object created above
// EXAMPLE Mouse.Tracking = true
// if (tracking) fucntion() { INSERT CODE DIRECTLY BELOW }

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

ctx.font = "12px sans-serif";

Events.on(render, "afterRender", function () {
  // ctx.lineWidth = 1
  // ctx.strokeStyle = "rgba(211, 211, 211, 0.75)"
  // ctx.strokeRect(10, 325, 5, 250)

  //ctx.fillRect(10, 325, 5, 50);

  if (render.canvas.hoverOver) {
    ctx.fillStyle = "lightgrey";
    ctx.fillText(
      `x: ${Math.floor(mouse.absolute.x)}`,
      mouse.absolute.x + 20,
      mouse.absolute.y + 25
    );
    ctx.fillText(
      `y: ${Math.floor(mouse.absolute.y)}`,
      mouse.absolute.x + 20,
      mouse.absolute.y + 37
    );
  }

  //console.log(mouse.absolute.x + 50, mouse.absolute.y + 50)
});
