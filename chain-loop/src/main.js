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
world.gravity.scale = 0.0;

// create renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 1000,
    height: 1000,
    wireframes: false,
    showAngleIndicator: true,
    showCollisions: false,
    showVelocity: true,
    showDebug: true,
		showIds: false
  },
});

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: render.options.width, y: render.options.height },
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
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// create four boxes for walls floor & ceiling
let box = Composite.create();

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

Composite.add(box, ground);
Composite.add(box, leftWall);
Composite.add(box, rightWall);
Composite.add(box, ceiling);

// generate ring of bodies
// TODO:
// - ringChain(, ringDia{default => no collisions}) circumference = bodies

let linkDia = 5;
let linkMass = 10;
let cLength = 0.30 * (linkDia / 2);
let cDamp = .5;
let cStiff = .1;
let displayLink = false
let nBodies = 200;
// create ring of bodies
let ringDia = (nBodies * linkDia + (nBodies - 1) * cLength) / Math.PI;
let ringAngle = (2 * Math.PI) / nBodies;
let ring = Composite.create({ label: "Ring" });

for (let i = 0; i < nBodies; i++) {
  let x = 400 + ringDia * Math.cos(ringAngle * i);
  let y = 300 + ringDia * Math.sin(ringAngle * i);

  let link = Bodies.circle(x, y, linkDia, {
    render: { fillStyle: "darkgrey" },
    label: "link" + i,
  });
  Composite.addBody(ring, link);
}

Composites.chain(ring, 0.45, 0, -0.45, 0, {
  stiffness: cStiff,
  length: cLength,
  mass: linkMass,
  render: {
    type: "line",
    visible: displayLink,
  },
});

/*

Add a constraint from the last chain body to the first chain body
TODO:
- should add closing constraint in the same way that the Composites.chain() does
- create function to close a chained composite
> function closeLoop(chain)

*/

Composite.add(
  ring,
  Constraint.create({
    bodyA: ring.bodies[ring.bodies.length - 1],
    pointA: { x: 0.9 * linkDia, y: 0 },
    bodyB: ring.bodies[0],
    pointB: { x: -0.9 * linkDia, y: 0 },
    stiffness: cStiff,
    length: cLength,
    render: {
      type: "line",
      visible: displayLink,
    },
  })
);

ring.bodies[0].render.fillStyle = "Red";
ring.bodies[ring.bodies.length - 1].render.fillStyle = "Blue";
ring.bodies.forEach((b) => {
	Body.rotate(b, Math.PI/2 + ( ringAngle ) * ring.bodies.indexOf(b))
	console.log("body " + b.id, 45 + ringAngle * ring.bodies.indexOf(b));
})
console.log(ring);



Composite.add(world, [ring]);
