// main
(function() {
    var $stage = document.getElementById('stage'),
        ctx = $stage.getContext('2d'),
        engine = new PE({
            sticky_threshold: 0.0004,
            gravity: {
                x: 0,
                y: 0.000980665
            }
        }),
        temp,
        elapsed = Date.now(),
        detector = new PE.CollisionDetector(),
        stage_collision = new PE.Entity({
            width: window.innerWidth,
            height: window.innerHeight
        });

    $stage.setAttribute('width', window.innerWidth);
    $stage.setAttribute('height', window.innerHeight);
    
    temp = new PE.Entity({
        width: window.innerWidth + 20,
        height: 1000,
        restitution: 0.5,
        position: {
            x: -20,
            y: window.innerHeight - 20
        }
    });

    engine.addCollision(temp);

    $stage.addEventListener('click', function() {
        var entities = engine.getEntities(),
            i = entities.length;

        for (; i--; ) {
            entities[i].velocity({
                x: -Math.random(),
                y: -Math.random()
            });
        }
    });

    loop();
    randamAddEntity();

    function render() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

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

    function onStep(entity) {
        var direction;

        // setTimeout(function() {
        //     engine.removeEntity(entity);
        //     engine.removeCollision(entity);
        // }, 3000);
        entity.on('step', function(collision) {
            if (!detector.collideRect(stage_collision, this)) {
                engine.removeEntity(this);
                engine.removeCollision(this);
            }
            else if (collision) {
                direction = Math.random() < 0.5 ? -1 : 1;

                this.velocity({
                    x: Math.random() / 10 * direction,
                    y: this.vy - Math.random() / 10
                });
            }
        });
    }

    function randamAddEntity() {
        setTimeout(function() {
            var entity = new PE.Entity({
                width: 50,
                height: 50,
                position: {
                    x: Math.floor(Math.random() * window.innerWidth - 5),
                    y: 0
                }
            });

            onStep(entity);

            engine.addEntity(entity);
            /* engine.addCollision(entity); */

            randamAddEntity();
        }, Math.floor(Math.random() * 100));
    }
}());
