// scroll
!function() {
    bg();
    chara();
}();
function chara() {
    var $stage = document.getElementById('stage'),
        ctx = $stage.getContext('2d'),
        engine = new PE({
            sticky_threshold: 0.0004,
            gravity: {
                x: 0,
                y: 0
            }
        }),
        chara = new PE.Entity({
            width: 10,
            height : 10,
            acceleration: {
                x: 0,
                y: 0.000980665
            },
            position: {
                x: 100,
                y: 100
            }
        }),
        elapsed = Date.now();

    engine.addCollision(new PE.Entity({
        width: 440,
        height: 1000,
        restitution: 0.5,
        position: {
            x: -20,
            y: 280
        }
    }));

    engine.addEntity(chara);

    chara.on('step', function() {
        console.log(this.y);
    });

    $stage.addEventListener('click', function() {
        chara.velocity({
            y: chara.vy - 0.5
        });
    });

    loop();

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
}
function bg() {
    var $stage = document.getElementById('bg'),
        ctx = $stage.getContext('2d'),
        engine = new PE({
            sticky_threshold: 0.0004,
            gravity: {
                y: 0,
                x: 0
            }
        }),
        temp,
        elapsed = Date.now(),
        detector = new PE.CollisionDetector(),
        stage_collision = new PE.Entity({
            width: 400,
            height: 300
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

    function onStep(entity) {
        var direction;

        setTimeout(function() {
            engine.removeEntity(entity);
            engine.removeCollision(entity);
        }, 2000);
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
                width: 1,
                height: 1,
                acceleration: {
                    x: -0.000980665,
                    y: 0
                },
                position: {
                    y: Math.floor(Math.random() * 390),
                    x: 399 
                }
            });

            onStep(entity);

            engine.addEntity(entity);
            engine.addCollision(entity);

            randamAddEntity();
        }, Math.floor(Math.random() * 10));
    }
}
