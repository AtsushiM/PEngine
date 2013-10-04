// Engine
var Engine = classExtendObserver({
    'init': function(config) {
        config = config || NULLOBJ;

        var that = this,
            arg = {
                'engine': that
            };

        that['_super']();

        that._gravity = config['gravity'] || {
            'x': 0,
            'y': 0.000980665
        };
        that._sticky_threshold = config['sticky_threshold'] || 0.0004;

        that.entities = [];
        that.collidables = [];
        that.collider = new CollisionDetector(arg);
        that.solver = new CollisionResolver(arg);
    },
    'addEntity': function(entity) {
        this.entities.push(entity);
    },
    'removeEntity': function(entity) {
        this._removeEntity(this.entities, entity);
    },
    'addCollision': function(entity) {
        this.collidables.push(entity);
    },
    'removeCollision': function(entity) {
        this._removeEntity(this.collidables, entity);
    },
    _removeEntity: function(entities, entity) {
        var i = entities.length;

        for (; i--; ) {
            if (entities[i] === entity) {
                deleteArrayKey(entities, i);
                break;
            }
        }
    },
    'getEntities': function() {
        return this.entities;
    },
    'getCollidables': function() {
        return this.collidables;
    },
    'step': function(elapsed) {
        var that = this,
            gx = that._gravity['x'] * elapsed,
            gy = that._gravity['y'] * elapsed,
            entity,
            entities = this.entities,
            i = entities.length,
            collisions;
        
        for (; i--; ) {
            entity = entities[i];

            entity['vx'] += entity['ax'] * elapsed + gx;
            entity['vy'] += entity['ay'] * elapsed + gy;
            entity['x']  += entity['vx'] * elapsed;
            entity['y']  += entity['vy'] * elapsed;
        
            collisions = this.collider['detectCollisions'](
                entity, 
                this.collidables
            );

            if (collisions != NULL) {
                this.solver['resolve'](entity, collisions);
            }

            entity['emit']('step', collisions);
        }
    }
});
