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
