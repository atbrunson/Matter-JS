// install plugin
Matter.use(
  "matter-attractors", // PLUGIN_NAME
);

var Example = Example || {};

Example.magnet = function () {
  // module aliases
  var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Bodies = Matter.Bodies;
  Vertices = Matter.Vertices;
  Vector = Matter.Vector;
  // create engine
  var engine = Engine.create();

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(document.documentElement.clientWidth, 1024),
      height: Math.min(document.documentElement.clientHeight, 1024),
      wireframes: false,
      showAngleIndicator: true,
    },
  });

  // create runner
  var runner = Runner.create();

  Runner.run(runner, engine);
  Render.run(render);

  // create demo scene

  var world = engine.world;
  world.gravity.scale = 0.0;

  // Magnet polarization grid engine
  // - initialize new engine
  // - initialize triangle grid for polarization
  // - initialize triangle grid for field lines
  // - initialize random polarization at each grid point
  // - update polarization at each grid point based on body magnetic fields
  //  - smoothly translate polarization of each grid point to align with body magnetic fields
  //  - restrain field lines from interacting with each other

  // render magnetization grid like showAngleIndicator
  // - draw lines from center via render.context at each grid point
  //  - context.beginPath();
  //  - context.moveTo(x1, y1);
  //  - context.lineTo(x2, y2); <-- calculate angle of polarization
  //  - context.endPath();

  // function add permenent magnet properties to a body
  let magnet = function (bodyA, bodyB) {
    // axis of the magnetization
    let magA = bodyA.axes[bodyA.axes.length - 1];
    // test if bodyB is also a magnet
    if (bodyB.isMagnet) {
      // get axis magnetization of bodyB
      let magB = bodyB.axes[bodyB.axes.length - 1];

      // on contact combine the magnetic fields
      // find pairs containing bodyA and bodyB
      // find psuedo center of all connected magnets
      // find psuedo axis of all connected magnets
      // apply torque to both bodies

      return;
    }

    if (bodyB.isMagnetic) {
      // apply force to bodyB
      // on contact expand the magnetic field of bodyA
      return;
    }

    // find the top and bottom of the magnets
    let topA = Vertices.mean([
      bodyA.vertices[0],
      bodyA.vertices[bodyA.vertices.length - 1],
    ]);

    let botB = Vertices.mean([
      bodyB.vertices[Math.floor((bodyB.vertices.length - 1) / 2)],
      bodyB.vertices[Math.ceil((bodyB.vertices.length - 1) / 2)],
    ]);

    return {
      // return the force
      x: (topA.x - botB.x) * 1e-5, //Math.sin(badyA.angle - Math.PI / 2)
      y: (topA.y - botB.y) * 1e-5, //bodyA.bounds.min.y*Math.cos(this.body.angle - Math.PI / 2)
    };
  };

  // function to add femagnetic properties to a body
  let magnetic = function (bodyA, bodyB) {
    // forces of the magnet body and the magnetic body are equal to each other
  };

  // create a body with an attractor
  var attractiveBody0 = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2,
    50,
    {
      mass: 10,
      restitution: 0.0,
      friction: 0.0,
      isStatic: false,

      // example of an attractor function that
      // returns a force vector that applies to bodyB
      // plugin: {
      //   attractors: [magnetic]
      // },
    },
  );
  Body.rotate(attractiveBody0, -Math.PI);
  var attractiveBody1 = Bodies.circle(
    render.options.width / 4,
    render.options.height / 4,
    50,
    {
      mass: Infinity,
      restitution: 0.0,
      friction: 0.0,
      isStatic: true,

      // example of an attractor function that
      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [],
      },
    },
  );
  Body.rotate(attractiveBody0, 0);

  World.add(world, [attractiveBody1, attractiveBody0]);

  // add some bodies that to be attracted
  for (var i = 0; i < 0; i += 1) {
    var body = Bodies.polygon(
      Common.random(0, render.options.width),
      Common.random(0, render.options.height),
      Common.random(1, 1),
      Common.random() > 0.9 ? Common.random(15, 25) : Common.random(10, 10),
    );
    body.friction = 0.001;
    body.restitution = 0.0;
    body.frictionAir = 0.05;
    Body.rotate(body, -Math.PI / 4);
    World.add(world, body);
  }

  // add mouse control
  var mouse = Mouse.create(render.canvas);

  Events.on(engine, "afterUpdate", function () {
    if (!mouse.position.x) {
      return;
    }

    // smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody1, {
      x: (mouse.position.x - attractiveBody1.position.x) * 0.25,
      y: (mouse.position.y - attractiveBody1.position.y) * 0.25,
    });
  });

  console.log("engine: ", engine);
  console.log("render: ", render);
  console.log("runner: ", runner);

  // return a context for MatterDemo to control

  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};
