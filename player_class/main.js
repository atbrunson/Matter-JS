
// Matter.js Module Aliases

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
	Events = Matter.Events;

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

// Add MOUSE control
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


// Arrange the VIEWPORT in the world
Render.lookAt(render, {
	min: { x: 0, y: 0 },
	max: { x: 800, y: 600 }
});


// get the centre of the viewport
    var viewportCentre = {
        x: render.options.width * 0.5,
        y: render.options.height * 0.5
    };

    // create limits for the viewport
    var extents = {
        min: { x: -300, y: -300 },
        max: { x: 1100, y: 900 }
    };

    // keep track of current bounds scale (view zoom)
    var boundsScaleTarget = 1,
        boundsScale = {
            x: 1,
            y: 1
        };

    // use a render event to control our view
    Events.on(render, 'beforeRender', function() {
        var world = engine.world,
            mouse = mouseConstraint.mouse,
            translate;

        // mouse wheel controls zoom
        var scaleFactor = mouse.wheelDelta * -0.1;
        if (scaleFactor !== 0) {
            if ((scaleFactor < 0 && boundsScale.x >= 0.6) || (scaleFactor > 0 && boundsScale.x <= 1.4)) {
                boundsScaleTarget += scaleFactor;
            }
        }

        // if scale has changed
        if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
            // smoothly tween scale factor
            scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
            boundsScale.x += scaleFactor;
            boundsScale.y += scaleFactor;

            // scale the render bounds
            render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
            render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

            // translate so zoom is from centre of view
            translate = {
                x: render.options.width * scaleFactor * -0.5,
                y: render.options.height * scaleFactor * -0.5
            };

            Bounds.translate(render.bounds, translate);

            // update mouse
            Mouse.setScale(mouse, boundsScale);
            Mouse.setOffset(mouse, render.bounds.min);
        }

        // get vector from mouse relative to centre of viewport
        var deltaCentre = Vector.sub(mouse.absolute, viewportCentre),
            centreDist = Vector.magnitude(deltaCentre);

        // translate the view if mouse has moved over 50px from the centre of viewport
        if (centreDist > 50) {
            // create a vector to translate the view, allowing the user to control view speed
            var direction = Vector.normalise(deltaCentre),
                speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

            translate = Vector.mult(direction, speed);

            // prevent the view moving outside the extents
            if (render.bounds.min.x + translate.x < extents.min.x)
                translate.x = extents.min.x - render.bounds.min.x;

            if (render.bounds.max.x + translate.x > extents.max.x)
                translate.x = extents.max.x - render.bounds.max.x;

            if (render.bounds.min.y + translate.y < extents.min.y)
                translate.y = extents.min.y - render.bounds.min.y;

            if (render.bounds.max.y + translate.y > extents.max.y)
                translate.y = extents.max.y - render.bounds.max.y;

            // move the view
            Bounds.translate(render.bounds, translate);

            // we must update the mouse too
            Mouse.setOffset(mouse, render.bounds.min);
        }
    });





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

//create new PLAYER object
let player1 = new Player(250, 250, 100)





Composite.add(world,
	[box]
);



