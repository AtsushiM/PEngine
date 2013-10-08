// Engine
Engine = classExtendObserver({
    'init': function(config) {
        config = config || NULLOBJ;

        var that = this,
            arg = {
                'engine': that
            };

        that['_super']();

        that._gravity = config['gravity'];
        that._gravity['x'] = isNumber(that._gravity['x']) ? that._gravity['x'] : 0;
        that._gravity['y'] = isNumber(that._gravity['y']) ? that._gravity['y'] : 0.000980665;

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
        var i = inArray(entity, entities);
        
        if (i !== -1) {
            deleteArrayKey(entities, i);
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
            collision;
        
        for (; i--; ) {
            entity = entities[i];

            entity['vx'] += entity['ax'] * elapsed + gx;
            entity['vy'] += entity['ay'] * elapsed + gy;
            entity['x']  += entity['vx'] * elapsed;
            entity['y']  += entity['vy'] * elapsed;
        
            collision = this.collider['detectCollisions'](
                entity, 
                this.collidables
            );

            if (collision != NULL) {
                this.solver['resolve'](entity, collision);
            }

            entity['emit']('step', collision);
        }
    }
}),
