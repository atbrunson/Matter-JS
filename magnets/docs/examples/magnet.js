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
  console.log(engine)

  // create a body with an attractor
  var attractiveBody = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2,
    50,
    {
      mass: Infinity,
      restitution: 0.0,
      friction: 0.0,
      isStatic: true,
      
      // example of an attractor function that
      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            let topA = {
              x:
                bodyA.position.x +
                (bodyA.bounds.min.y - bodyA.position.y) *
                  Math.sin(bodyA.angle - Math.PI / 2), // the x component distance from the center to the top (ie north)
              y:
                bodyA.position.y -
                (bodyA.bounds.min.y - bodyA.position.y) *
                  Math.cos(bodyA.angle - Math.PI / 2),
            };
            let botB = { 
              x:
                bodyB.position.x -
                (bodyB.bounds.max.y - bodyB.position.y) *
                  Math.sin(bodyB.angle - Math.PI / 2), // the x component distance from the center to the bottom (ie south)
              y:
                bodyB.position.y +
                (bodyB.bounds.max.y - bodyB.position.y) *
                  Math.cos(bodyB.angle - Math.PI / 2),
              
            }
            //console.log(topA);
            //console.log(bodyA.position);
            return {
              x: (topA.x - botB.x) * 1e-5, //Math.sin(badyA.angle - Math.PI / 2)
              y: (topA.y - botB.y) * 1e-5, // bodyA.bounds.min.y*Math.cos(this.body.angle - Math.PI / 2)
            };
          },
        ],
      },
    },
  );
  Body.rotate(attractiveBody, -Math.PI / 2);
  World.add(world, attractiveBody);
  //console.log(attractiveBody);

  // add some bodies that to be attracted
  for (var i = 0; i < 1; i += 1) {
    var body = Bodies.polygon(
      Common.random(0, render.options.width),
      Common.random(0, render.options.height),
      Common.random(1, 1),
      Common.random() > 0.9 ? Common.random(15, 25) : Common.random(10, 10),
    );
    body.friction = 0.001;
    body.restitution = 0.0;
    body.frictionAir = 0.05;
    Body.rotate(body, -Math.PI/4);
    World.add(world, body);
  }

  // add mouse control
  var mouse = Mouse.create(render.canvas);

  Events.on(engine, "afterUpdate", function () {
    if (!mouse.position.x) {
      return;
    }

    // smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody, {
      x: (mouse.position.x - attractiveBody.position.x) * 0.25,
      y: (mouse.position.y - attractiveBody.position.y) * 0.25,
    });
  });

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
