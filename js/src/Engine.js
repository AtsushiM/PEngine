// Engine
var Engine = classExtendObserver({
    'init': function(config) {
        var that = this,
            computed;

        that['_super']();

        that._canvas = config['canvas'];
        that._ctx = that._canvas.getContext('2d');

        computed = document.defaultView.getComputedStyle(that._canvas, null)

        that['width'] = +computed['width'].replace(/[^0-9\.]/g, '');
        that['height'] = +computed['height'].replace(/[^0-9\.]/g, '');

        that.entities = [];
        that.collidables = [];
        that.collider = new CollisionDetector;
        that.solver = new CollisionResolver;
    },
    'addEntity': function(entity) {
        this.entities.push(entity);
    },
    'addCollision': function(entity) {
        this.collidables.push(entity);
    },
    'render': function() {
        var that = this;

        that._ctx.clearRect(0, 0, that['width'], that['height']);

        that._render(that.entities);
        that._render(that.collidables);
    },
    _render: function(entities) {
        var i = entities.length,
            entity,
            ctx = this._ctx;

        for (; i--; ) {
            entity = entities[i];

            ctx.fillStyle = "rgb(150,29,28)";
            ctx.fillRect(entity['x'], entity['y'], entity['width'], entity['height']);
        }
    },
    'step': function(elapsed) {
        var gx = GRAVITY_X * elapsed,
            gy = GRAVITY_Y * elapsed,
            entity,
            entities = this.entities,
            i = entities.length,
            collisions;
        
        for (; i--; ) {
            entity = entities[i];

            switch (entity._type) {
                case PhysicsEntity.DYNAMIC:
                    entity['vx'] += entity['ax'] * elapsed + gx;
                    entity['vy'] += entity['ay'] * elapsed + gy;
                    entity['x']  += entity['vx'] * elapsed;
                    entity['y']  += entity['vy'] * elapsed;
                    break;
                case PhysicsEntity.KINEMATIC:
                    entity['vx'] += entity['ax'] * elapsed;
                    entity['vy'] += entity['ay'] * elapsed;
                    entity['x']  += entity['vx'] * elapsed;
                    entity['y']  += entity['vy'] * elapsed;
                    break;
            }
        
            collisions = this.collider['detectCollisions'](
                entity, 
                this.collidables
            );

            if (collisions != NULL) {
                this.solver['resolve'](entity, collisions);
            }
        }
    }
});
