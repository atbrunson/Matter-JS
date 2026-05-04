// install plugin
Matter.use(
  "matter-attractors", // PLUGIN_NAME
);

var Example = Example || {};

Example.vector_field = function () {
  // module aliases
  var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Vertices = Matter.Vertices,
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
      wireframes: true,
      showAngleIndicator: false,
    },
  });

  // create runner
  var runner = Runner.create();

  Runner.run(runner, engine);
  Render.run(render);

  // create demo scene

  var world = engine.world;

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

  // generate grid points with a random polarization
  let field = [];
  f = field;
  f.size = 1024/16;
  f.buckets = [];

  field.init = function () {
    for (let i = 0; i < Math.floor(render.options.height / f.size); i++) {
      for (let j = 0; j < Math.floor(render.options.width / f.size); j++) {
        f.buckets.push({
          pos: Vector.create(i * f.size + f.size / 2, j * f.size + f.size / 2),
          pol: Vector.normalise(
            Vector.create(
              Math.random() * f.size - f.size / 2,
              Math.random() * f.size - f.size / 2,
            ),
          ),
          prev_pol: 0, //Vector.clone(f.buckets[i+j].pol)
        });
      }
    }
  };
  console.log("rows: " + Math.ceil(render.options.width / f.size));
  console.log("cols: " + Math.ceil(render.options.height / f.size));
  field.init();

  field.render = function () {
    // draw field lines
    render.context.globalCompositeOperation = "source-over";
    field.buckets.forEach((point) => {
      render.context.strokeStyle = "lime";
      render.context.lineWidth = 0.25;
      render.context.beginPath();
      render.context.arc(
        point.pos.x,
        point.pos.y,
        (0.9 * f.size) / 2,
        0,
        2 * Math.PI,
      );
      render.context.moveTo(point.pos.x, point.pos.y);
      angle = Math.atan2(point.pol.y, point.pol.x);
      scaled85 = Vector.mult(point.pol, (0.85 * f.size) / 2);
      scaled75 = Vector.mult(point.pol, (0.75 * f.size) / 2);
      scaled25 = Vector.mult(point.pol, (0.25 * f.size) / 2);
      render.context.lineTo(point.pos.x + scaled85.x, point.pos.y + scaled85.y);
      render.context.stroke();

      render.context.beginPath();

      render.context.lineWidth = 0.25;
      render.context.moveTo(point.pos.x + scaled75.x, point.pos.y + scaled75.y);
      render.context.lineTo(
        point.pos.x +
          scaled75.x +
          ((0.1 * f.size) / 2) * Math.cos(angle + Math.PI / 2),
        point.pos.y +
          scaled75.y +
          ((0.1 * f.size) / 2) * Math.sin(angle + Math.PI / 2),
      );
      render.context.lineTo(
        point.pos.x +
          scaled85.x +
          ((0.1 * f.size) / 2) * Math.cos(angle + Math.PI / 2),
        point.pos.y +
          scaled85.y +
          ((0.1 * f.size) / 2) * Math.sin(angle + Math.PI / 2),
      );
      render.context.lineTo(point.pos.x + scaled85.x, point.pos.y + scaled85.y);
      render.context.stroke();
    });
  };

  field.update = function () {
    // for each point in the field add the angles of nieghboring buckets
    field.buckets.forEach((point) => {});
    // subract the sum of nighboring angles from the current angle and save as new angle
  };

  //console.log(field);

  // add mouse control
  var mouse = Mouse.create(render.canvas);
  // update mouse position in synch the engine
  Events.on(engine, "afterUpdate", function () {
    if (!mouse.position.x) {
      return;
    }

    // smoothly move the vector field towards the mouse
  });

  // render context to canvas
  Events.on(render, "afterRender", function () {
    field.render();

    // draw mouse position
    render.context.globalCompositeOperation = "source-over";
    render.context.fillStyle = "rgba(255,255,255,0.9)";
    render.context.fillText(
      Math.floor(mouse.position.x) + " , " + Math.floor(mouse.position.y),
      mouse.position.x + 15,
      mouse.position.y + 30,
    );
  });

  return {
    world: world,
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    field: field,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};
