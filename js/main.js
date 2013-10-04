// main
(function() {
    var $stage = document.getElementById('stage'),
        ctx = $stage.getContext('2d'),
        engine = new PE({
            sticky_threshold: 0.0004,
            gravity: {
                x: 0.0000980665,
                y: 0.000980665
            }
        }),
        i = 20,
        temp,
        elapsed = Date.now(),
        detector = new PE.CollisionDetector(),
        stage_collision = new PE.Entity({
            width: 400,
            height: 300
        });
    
    for (; i--; ) {
        temp = new PE.Entity({
            width: 20,
            height: 20,
            position: {
                x: 20 * i,
                y: 10 * i
            }
        });

        temp.on('step', function(collision) {
            if (!detector.collideRect(stage_collision, this)) {
                engine.removeEntity(this);
            }
        });

        engine.addEntity(temp);
    }

    temp = new PE.Entity({
        width: 440,
        height: 1000,
        position: {
            x: -20,
            y: 280
        }
    });

    engine.addCollision(temp);

    $stage.addEventListener('click', function() {
        var entities = engine.getEntities(),
            i = entities.length;

        for (; i--; ) {
            entities[i].velocity({
                y: -Math.random()
            });
        }
    });

    loop();
    randamAddEntity();

    function render() {
        ctx.clearRect(0, 0, 400, 300);

        _render(engine.getEntities());
        _render(engine.getCollidables());
    }
    function _render(entities) {
        var i = entities.length,
            entity;

        for (; i--; ) {
            entity = entities[i];

            ctx.fillStyle = "rgb(150,29,28)";
            ctx.fillRect(entity['x'], entity['y'], entity['width'], entity['height']);
        }
    }

    function loop() {
        requestAnimationFrame(function() {
            temp = Date.now();

            engine.step(temp - elapsed);
            render();

            elapsed = temp;

            loop();
        });
    }
    function randamAddEntity() {
        setTimeout(function() {
            var entity = new PE.Entity({
                width: 20,
                height: 20,
                position: {
                    x: Math.floor(Math.random() * 390),
                    y: 0
                }
            });

            entity.on('step', function(collision) {
                if (!detector.collideRect(stage_collision, this)) {
                    engine.removeEntity(this);
                }
            });

            engine.addEntity(entity);

            randamAddEntity();
        }, Math.round(Math.random() * 10));
    }
}());
