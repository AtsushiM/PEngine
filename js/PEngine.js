// Util
var win = window,
    doc = document,
    TRUE = true,
    FALSE = false,
    NULL = null,
    EMPTY = '',
    NULLOBJ = {},
    class_initializing = FALSE,
    class_fnTest = /0/.test(function() {
        0;
    }) ? /\b_super\b/ : /.*/;

var STICKY_THRESHOLD = .0004;
var GRAVITY_X = 0;
var GRAVITY_Y = 0.000980665;

if (!Date['now']) {
    Date['now'] = function() {
        return +new Date;
    };
}

function abs(num) {
    return Math.abs(num);
}

function this_uncontract(id /* varless */, temp, arg) {
    if (id) {
        // var temp = this._disposestore,
        //     arg = temp[id];
        temp = this._disposestore,
        arg = temp[id];

        delete temp[id];

        off(arg[0], arg[1], arg[2]);
    }
}
function this_contract(el, e, handler /* varless */, that, id) {
    that = this;

    if (!that._disposestore) {
        that._disposestore = {};
    }
    /* var id = ++this._disposecountid; */
    id = ++that._disposecountid;

    on(el, e, handler);
    that._disposestore[id] = [el, e, handler];

    return id;
}

function dateNow() {
    return Date['now']();
}

function override(target, vars /* varless */, i) {
    /* var i; */

    for (i in vars) {
        target[i] = vars[i];
    }

    return target;
}
function toArray(obj/* varless */, ary) {
    /* var ary = []; */
    ary = [];

    ary.push.apply(ary, obj);

    return ary;
}

function inArray(v, ary) {
    if (ary['indexOf']) {
        return ary['indexOf'](v);
    }

    var i = 0,
        len = ary.length;

    for (; i < len; i++) {
        if (v === ary[i]) {
            return i;
        }
    }

    return -1;
}

function is(key, vars) {
    return Object.prototype.toString.call(vars) == '[object ' + key + ']' ?
               TRUE : FALSE;
}
function isObject(vars) {
    return is('Object', vars);
}
function isNumber(vars) {
    return is('Number', vars);
}
function isString(vars) {
    return is('String', vars);
}
function isFunction(vars) {
    return is('Function', vars);
}
function isBoolean(vars) {
    return is('Boolean', vars);
}
function isArray(vars) {
    return is('Array', vars);
}
function isDefined(vars) {
    return vars === void 0 ? FALSE : TRUE;
}
function isTouchable() {
    return 'ontouchstart' in win;
}
function nullFunction() {
}
function abstractFunction() {
    throw new Error('call abstract-function.');
}
function size(obj, w, h) {
    if (!isDefined(w)) {
        return {
            'w': obj[label_w],
            'h': obj[label_h]
        };
    }
    if (!isDefined(h)) {
        h = w;
    }
    obj[label_w] = w;
    obj[label_h] = h;
}
function proxy(target, func) {
    return function() {
        return func.apply(target, arguments);
    };
}
function copyArray(ary) {
    return isArray(ary) ? ary.slice(0) : ary;
}
function copyObject(obj) {
    return isObject(obj) ? override({}, obj) : obj;
}

function deleteArrayKey(ary, no) {
    ary.splice(no, 1);
}

function inRange(val1, val2, num) {
    if (Math.abs(val1 - val2) <= num) {
        return true;
    }

    return false;
}
// Class
var Class = function() {};

Class.extend = function(props/* varless */, SuperClass, i) {
    // var SuperClass = this,
    //     i;
    SuperClass = this;

    function Class() {
        if (!class_initializing && this['init']) {
            this['init'].apply(this, arguments);
        }
    }

    class_initializing = TRUE;
    Class.prototype = new SuperClass();
    class_initializing = FALSE;

    Class.prototype['constructor'] = Class;

    for (i in props) {
        if (props.hasOwnProperty(i)) {
            addMethod(i);
        }
    }

    function addMethod(key) {
        var prop = props[key],
            _super = SuperClass.prototype[key],
            isMethodOverride = (
                isFunction(prop) &&
                isFunction(_super) &&
                class_fnTest.test(prop)
            );

        if (isMethodOverride) {
            Class.prototype[key] = function() {
                var that = this,
                    ret,
                    tmp = that['_super'];

                that['_super'] = _super;

                ret = prop.apply(that, arguments);

                that['_super'] = tmp;

                return ret;
            };
        }
        else {
            Class.prototype[key] = prop;
        }
    }

    Class.extend = SuperClass.extend;

    return Class;
};

function classExtend(cls, prop, support /* varless */, klass) {
    cls = cls || Class;

    /* var klass = cls.extend(prop); */
    klass = cls.extend(prop);

    if (isDefined(support)) {
        klass['support'] = support;
    }

    return klass;
}
function classExtendBase(prop, support) {
    return classExtend(Base, prop, support);
}
function classExtendObserver(prop, support) {
    return classExtend(Observer, prop, support);
}
// Base
// Observer
var Observer = classExtend(NULL, {
    _disposecountid: 0,
    'dispose': function(/* varless */ that, i, temp) {
        that = this;

        /* var temp = that._disposestore; */
        temp = that._disposestore;

        for (i in temp) {
            off.apply(NULL, temp[i]);
        }

        for (i in that) {
            temp = that[i];

            if (temp && temp['dispose']) {
                temp['dispose']();
            }
        }

        that.__proto__ = NULL;

        for (i in that) {
            that[i] = NULL;
            delete that[i];
        }
    },
    'contract': this_contract,
    'uncontract': this_uncontract,
    'init': function() {
        this._observed = {};
        this._childs = [];
    },
    'on': function(key, func /* varless */, that, observed) {
        that = this;
        observed = that._observed;

        if (!observed[key]) {
            observed[key] = [];
        }

        observed[key].push(func);
    },
    'one': function(key, func /* varless */, that, wrap) {
        /* var that = this; */
        that = this;
        wrap = function() {
            func.apply(that, arguments);
            that['off'](key, wrap);
        };

        wrap.original = func;

        that['on'](key, wrap);
    },
    'off': function(key, func /* varless */, that, observed, target, i) {
        // var observed = that._observed,
        //     target = observed[key],
        //     i;
        that = this;
        observed = that._observed;

        if (func) {
            target = observed[key];

            if (target) {
                for (i = target.length; i--;) {
                    if (func == target[i] || func == target[i].original) {
                        deleteArrayKey(target, i);

                        if (target.length == 0) {
                            delete observed[key];
                        }

                        return TRUE;
                    }
                }
            }

            return FALSE;
        }

        return delete observed[key];
    },
    'fire': Observer_bubble,
    'bubble': Observer_bubble,
    'capture': function() {
        var that = this,
            args = arguments,
            childs = that._childs,
            i = childs.length,
            temp;

        if (FALSE !== that['only'].apply(that, args)) {
            for (; i--;) {
                temp = childs[i];
                temp['capture'].apply(temp, args);
            }
        }
    },
    'only': function() {
        var args = toArray(arguments),
            e = Observer_event(this, args),
            target = this._observed[e['type']] || [],
            temp,
            i = target.length;

        deleteArrayKey(args, 0);
        args[args.length] = e;

        for (; i--;) {
            temp = target[i];
            if (temp) {
                temp = temp.apply(this, args);

                if (temp === FALSE || e._flgPreventDefault) {
                    return temp;
                }
            }
        }

        return e;
    },
    'addChild': function(instance) {
        if (instance._parentObserver) {
            instance._parentObserver['removeChild'](instance);
        }

        instance._parentObserver = this;
        this._childs.push(instance);
    },
    'removeChild': function(instance) {
        var childs = this._childs,
            i = childs.length;

        if (instance) {
            for (; i--; ) {
                if (childs[i] === instance) {
                    Observer_removeChildExe(childs, i);

                    return;
                }
            }
        }
        else {
            for (; i--; ) {
                Observer_removeChildExe(childs, i);
            }
        }
    }
});

function Observer_removeChildExe(childs, i) {
    delete childs[i]._parentObserver;
    deleteArrayKey(childs, i);
}
function Observer_bubble() {
    var that = this,
        args = arguments,
        temp = that['only'].apply(that, args);

    if (FALSE !== temp && !(temp || NULLOBJ)._flgStopPropagation) {
        /* that._parentFire.apply(that, args); */
        temp = this._parentObserver;

        if (temp) {
            temp['bubble'].apply(temp, args);
        }
    }
}
function Observer_preventDefault() {
    this._flgPreventDefault = TRUE;
}
function Observer_stopPropagation() {
    this._flgStopPropagation = TRUE;
}
function Observer_event(that, args /* varless */, e) {
    e = args[0];

    if (isString(e)) {
        e = {
            'type': e,
            'arguments': args,
            _flgPreventDefault: FALSE,
            _flgStopPropagation: FALSE,
            'preventDefault': Observer_preventDefault,
            'stopPropagation': Observer_stopPropagation
        };
    }

    e['before'] = e['target'];
    e['target'] = that;

    return e;
}
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
// Collision Decorator Pattern Abstraction
var Collision = {
    'elastic': function(restitution) {
        this.restitution = restitution || 0.2;
    },
    'displace': function() {
        // While not supported in this engine
        // the displacement collisions could include
        // friction to slow down entities as they slide
        // across the colliding entity
    }
};
// PhysicsEntity
var PhysicsEntity = classExtendObserver({
    'init': function(config) {
        config = config || NULLOBJ;

        var that = this,
            temp;

        that['_super']();

        that._type = config['type'] || PhysicsEntity.DYNAMIC;
        that._collision = config['collisionName'] || PhysicsEntity.ELASTIC;

        that['size'](config);

        temp = Collision[that._collision];
        temp.call(that);

        // Position
        that['x'] = 0;
        that['y'] = 0;
        that['position'](config['position'] || NULLOBJ);

        // Velocity
        that['vx'] = 0;
        that['vy'] = 0;
        that['velocity'](config['velocity'] || NULLOBJ);

        // Acceleration
        that['ax'] = 0;
        that['ay'] = 0;
        that['acceleration'](config['acceleration'] || NULLOBJ);

    },
    // Update bounds includes the rect's
    // boundary updates
    _updateBounds: function() {
        var that = this;

        that._halfWidth = that['width'] * .5;
        that._halfHeight = that['height'] * .5;
    },

    'size': function(config) {
        var that = this;

        that['width'] = config['width'];
        that['height'] = config['height'];

        that._updateBounds();
    },

    'position': function(config) {
        var that = this;

        if (isNumber(config['x'])) {
            that['x'] = config['x'];
        }
        if (isNumber(config['y'])) {
            that['y'] = config['y'];
        }
    },

    'velocity': function(config) {
        var that = this;

        if (isNumber(config['x'])) {
            that['vx'] = config['x'];
        }
        if (isNumber(config['y'])) {
            that['vy'] = config['y'];
        }
    },

    'acceleration': function(config) {
        var that = this;

        if (isNumber(config['x'])) {
            that['ax'] = config['x'];
        }
        if (isNumber(config['y'])) {
            that['ay'] = config['y'];
        }
    },

    // Getters for the mid point of the rect
    'getMidX': function() {
        return this._halfWidth + this['x'];
    },

    'getMidY': function() {
        return this._halfHeight + this['y'];
    },

    // Getters for the top, left, right, and bottom
    // of the rectangle
    'getTop': function() {
        return this['y'];
    },
    'getLeft': function() {
        return this['x'];
    },
    'getRight': function() {
        return this['x'] + this['width'];
    },
    'getBottom': function() {
        return this['y'] + this['height'];
    }
});
PhysicsEntity.KINEMATIC = 'kinematic';
PhysicsEntity.DYNAMIC   = 'dynamic';
PhysicsEntity.DISPLACE = 'displace';
PhysicsEntity.ELASTIC = 'elastic';
// CollisionDetector
var CollisionDetector = classExtendObserver({
    // 'init': function() {
    //     this['_super']();
    // }
    'detectCollisions': function(collider, collidees) {
        var ret = [],
            i = collidees.length;

        for (; i--; ) {
            if (this['collideRect'](collider, collidees[i])) {
                ret.push(collidees[i]);
            }
        }

        return ret.length ? ret : NULL;
    },
    'collideRect': function(collider, collidee) {
        if (
            collider['getBottom']() < collidee['getTop']() ||
            collider['getTop']() > collidee['getBottom']() ||
            collider['getRight']() < collidee['getLeft']() ||
            collider['getLeft']() > collidee['getRight']()
        ) {
            return FALSE;
        }
        return TRUE;
    }
});
// CollisionResolver
var CollisionResolver = classExtendObserver({
    'resolve': function(target, entities) {
        var i = entities.length;

        for (; i--; ) {
            this['resolveElastic'](target, entities[i]);
        }
    },
    'resolveElastic': function(target, entity) {
        var pMidX = target['getMidX'](),
            pMidY = target['getMidY'](),
            aMidX = entity['getMidX'](),
            aMidY = entity['getMidY'](),
            dx = (aMidX - pMidX) / entity._halfWidth,
            dy = (aMidY - pMidY) / entity._halfHeight,
            absDX = abs(dx),
            absDY = abs(dy);
        
        if (abs(absDX - absDY) < .1) {
            // If the target is approaching from positive X
            if (dx < 0) {

                // Set the target x to the right side
                target['x'] = entity['getRight']();

            // If the target is approaching from negative X
            } else {

                // Set the target x to the left side
                target['x'] = entity['getLeft']() - target['width'];
            }

            // If the target is approaching from positive Y
            if (dy < 0) {

                // Set the target y to the bottom
                target['y'] = entity['getBottom']();

            // If the target is approaching from negative Y
            } else {

                // Set the target y to the top
                target['y'] = entity['getTop']() - target['height'];
            }
            
            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                // Reflect the velocity at a reduced rate
                target['vx'] = -target.vx * entity.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // STICKY_THRESHOLD is set to .0004
                if (abs(target['vx']) < STICKY_THRESHOLD) {
                    target['vx'] = 0;
                }
            } else {

                target['vy'] = -target['vy'] * entity.restitution;
                if (abs(target['vy']) < STICKY_THRESHOLD) {
                    target['vy'] = 0;
                }
            }

        // If the object is approaching from the sides
        } else if (absDX > absDY) {

            // If the target is approaching from positive X
            if (dx < 0) {
                target['x'] = entity['getRight']();

            } else {
            // If the target is approaching from negative X
                target['x'] = entity['getLeft']() - target['width'];
            }
            
            // Velocity component
            target['vx'] = -target.vx * entity.restitution;

            if (abs(target['vx']) < STICKY_THRESHOLD) {
                target['vx'] = 0;
            }

        // If this collision is coming from the top or bottom more
        } else {

            // If the target is approaching from positive Y
            if (dy < 0) {
                target['y'] = entity['getBottom']();

            } else {
            // If the target is approaching from negative Y
                target['y'] = entity['getTop']() - target['height'];
            }
            
            // Velocity component
            target['vy'] = -target['vy'] * entity.restitution;
            if (abs(target['vy']) < STICKY_THRESHOLD) {
                target['vy'] = 0;
            }
        }
    }
});
// namespace
win['PE'] = override(Engine, {
    'Entity': PhysicsEntity,
    'CollisionDetector': CollisionDetector,
    'CollisionResolver': CollisionResolver,
    'Observer': Observer
});
