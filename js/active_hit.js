// active_hit
(function() {
    var $stage = document.getElementById('stage'),
        ctx = $stage.getContext('2d'),
        engine = new PE({
            gravity: {
                y: 0.000580665
            }
        }),
        detector = new PE.CollisionDetector(),
        stage_collision = new PE.Entity({
            width: 400,
            height: 300
        });
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

    setInterval(addEntity, 200);
    /* addEntity(); */
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

    function addEntity() {
        var entity = new PE.Entity({
                width: 20,
                height: 20,
                elapsed: 0.5,
                position: {
                    x: Math.round(Math.random() * 380 / 20) * 20,
                    h: 0
                }
            });

        // entity.on('step', function(collision) {
        //     if (!detector.collideRect(stage_collision, this)) {
        //         engine.removeEntity(this);
        //         engine.removeCollision(this);
        //     }
        //     else if (collision) {
        //         direction = Math.random() < 0.5 ? -1 : 1;

        //         this.velocity({
        //             x: Math.random() / 10 * direction,
        //             y: this.vy - Math.random() / 10
        //         });
        //     }
        // });

        engine.addCollision(entity);
        engine.addEntity(entity);

        setTimeout(function() {
            engine.removeEntity(entity);
            engine.removeCollision(entity);
        }, 20000);
    }
}());

