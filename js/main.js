// main
(function() {
    var $stage = document.getElementById('stage'),
        engine = new PE({
            canvas: $stage
        }),
        i = 10,
        temp,
        elapsed = Date.now();
    
    for (; i--; ) {
        temp = new PE.Entity({
            width: 20,
            height: 20,
            position: {
                x: 20 * i,
                y: 20 * i
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

    loop();
    randamAddEntity();

    function loop() {
        requestAnimationFrame(function() {
            temp = Date.now();

            engine.step(temp - elapsed);
            engine.render();

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

            engine.addEntity(entity);

            randamAddEntity();
        }, 500 + Math.round(Math.random() * 1000));
    }
}());

