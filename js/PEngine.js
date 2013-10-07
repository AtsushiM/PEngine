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
    }) ? /\b_super\b/ : /.*/,
    Class;

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

function on(el, eventname, handler) {
    el.addEventListener(eventname, handler, FALSE);
}
function off(el, eventname, handler) {
    el.removeEventListener(eventname, handler, FALSE);
}

function classExtend(cls, prop, support /* varless */, klass) {
    cls = cls || Class;

    /* var klass = cls.extend(prop); */
    klass = cls.extend(prop);

    if (isDefined(support)) {
        klass['support'] = support;
    }

    return klass;
}
function classExtendObserver(prop, support) {
    return classExtend(Observer, prop, support);
}

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

if (!Date['now']) {
    Date['now'] = function() {
        return +new Date;
    };
}
// Class
Class = function() {};
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
// Base
var 
// Observer
Observer = classExtend(NULL, {
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
    'emit': Observer_bubble,
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
}),
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
// Collision Decorator Pattern Abstraction
// PhysicsEntity
PhysicsEntity = classExtendObserver({
    'init': function(config) {
        config = config || NULLOBJ;

        var that = this,
            temp;

        that['_super']();

        that['size'](config);

        this['restitution'] = isNumber(config['restitution']) ? config['restitution'] : 0.2;

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
}),
// CollisionDetector
CollisionDetector = classExtendObserver({
    'detectCollisions': function(collider, collidees) {
        var i = collidees.length,
            temp;

        for (; i--; ) {
            temp = collidees[i];
            if (collider !== temp && this['collideRect'](collider, temp)) {
                return temp;
            }
        }

        return NULL;
    },
    'collideRect': function(collider, collidee) {
        if (
            collider['getBottom']() <= collidee['getTop']() ||
            collider['getTop']() >= collidee['getBottom']() ||
            collider['getRight']() <= collidee['getLeft']() ||
            collider['getLeft']() >= collidee['getRight']()
        ) {
            return FALSE;
        }
        return TRUE;
    }
}),
// CollisionResolver
CollisionResolver = classExtendObserver({
    'init': function(config) {
        this['_super']();
        this._engine = config['engine'];
    },
    'resolve': function(target, entity) {
        var sticky_threshold = this._engine._sticky_threshold,
            pMidX = target['getMidX'](),
            pMidY = target['getMidY'](),
            aMidX = entity['getMidX'](),
            aMidY = entity['getMidY'](),
            dx = (aMidX - pMidX) / entity._halfWidth,
            dy = (aMidY - pMidY) / entity._halfHeight,
            absDX = abs(dx),
            absDY = abs(dy);
        
        if (abs(absDX - absDY) < 0.1) {
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
            if (Math.random() < 0.5) {

                // Reflect the velocity at a reduced rate
                target['vx'] = -target.vx * entity['restitution'];

                // If the object's velocity is nearing 0, set it to 0
                if (abs(target['vx']) < sticky_threshold) {
                    target['vx'] = 0;
                }
            } else {

                target['vy'] = -target['vy'] * entity['restitution'];
                if (abs(target['vy']) < sticky_threshold) {
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
            target['vx'] = -target.vx * entity['restitution'];

            if (abs(target['vx']) < sticky_threshold) {
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
            target['vy'] = -target['vy'] * entity['restitution'];
            if (abs(target['vy']) < sticky_threshold) {
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
