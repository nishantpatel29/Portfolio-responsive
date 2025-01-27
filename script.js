var Example = Example || {};

Example.timescale = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.querySelector('.main'),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            showAngleIndicator: false // Remove red angle indicator
        }
    });
    

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // Add invisible borders
    Composite.add(world, [
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { 
            isStatic: true,
            render: {
                visible: false // Ensure the top border is invisible
            }
        }), // Top border
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { 
            isStatic: true,
            render: {
                visible: false // Ensure the bottom border is invisible
            }
        }), // Bottom border
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { 
            isStatic: true,
            render: {
                visible: false // Ensure the right border is invisible
            }
        }), // Right border
        Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { 
            isStatic: true,
            render: {
                visible: false // Ensure the left border is invisible
            }
        }) // Left border
    ]);

    // Function to apply an explosion force to bodies
    var explosion = function(engine) {
        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];

            if (!body.isStatic && body.position.y >= window.innerHeight - 100) {
                // scale force for mass and time applied
                var forceMagnitude = 0.05 * body.mass;

                // apply the force over a single update
                Body.applyForce(body, body.position, {
                    x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
                    y: -forceMagnitude + Common.random() * -forceMagnitude
                });
            }
        }
    };

    // Trigger explosion once and adjust simulation parameters after
    setTimeout(() => {
        explosion(engine);
        engine.timing.timeScale = 0.5; // Slow down the simulation after explosion
        engine.world.gravity.scale = 0; // Set gravity to 0
    }, 2000); // Delay the explosion by 2 seconds

    var bodyOptions = {
        frictionAir: 0, 
        friction: 0.0001,
        restitution: 0.8
    };

    // Spread the bodies across the entire width of the canvas
    Composite.add(world, Composites.stack(0, 100, 15, 3, 0, 0, function(x, y) {
        var xPos = Common.random(0, window.innerWidth);
        return Bodies.circle(xPos, y, Common.random(10, 20), bodyOptions);
    }));

    Composite.add(world, Composites.stack(0, 50, 8, 3, 0, 0, function(x, y) {
        var xPos = Common.random(0, window.innerWidth);
        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(xPos, y, Common.random(20, 50), Common.random(20, 50), bodyOptions);
            } else {
                return Bodies.rectangle(xPos, y, Common.random(80, 120), Common.random(20, 30), bodyOptions);
            }
        case 1:
            return Bodies.polygon(xPos, y, Math.round(Common.random(4, 8)), Common.random(20, 50), bodyOptions);
        }
    }));

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

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};


Example.timescale.title = 'Time Scaling';
Example.timescale.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.timescale;
}
