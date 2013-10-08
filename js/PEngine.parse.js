!function() {
    var f = void 0, h = null;
    function l(a) {
        return function() {
            return this[a]
        }
    }
    var m = window, n = !0, p = !1, q = {}, r = p, s = /0/.test(function() {
        0
    }) ? /\b_super\b/ : /.*/, t;
    function u(a, b) {
        return Object.prototype.toString.call(b) == "[object " + a + "]" ? n : p
    }
    function v(a) {
        return u("Number", a)
    }
    function w(a, b, d) {
        a.removeEventListener(b, d, p)
    }
    function x(a, b, d) {
        a = a || t;
        a = a.extend(b);
        (d === f ? p : n) && (a.support = d);
        return a
    }
    function z() {
        var a = arguments, b = this.only.apply(this, a);
        if (p !== b && !(b || q).h)
            (b = this.b) && b.bubble.apply(b, a)
    }
    function A() {
        this.g = n
    }
    function B() {
        this.h = n
    }
    Date.now || (Date.now = function() {
        return +new Date
    });
    t = function() {
    };
    t.extend = function(a, b, d) {
        function c() {
            !r && this.init && this.init.apply(this, arguments)
        }
        function e(d) {
            var e = a[d], y = b.prototype[d];
            u("Function", e) && u("Function", y) && s.test(e) ? c.prototype[d] = function() {
                var a, b = this._super;
                this._super = y;
                a = e.apply(this, arguments);
                this._super = b;
                return a
            } : c.prototype[d] = e
        }
        b = this;
        r = n;
        c.prototype = new b;
        r = p;
        c.prototype.constructor = c;
        for (d in a)
            a.hasOwnProperty(d) && e(d);
        c.extend = b.extend;
        return c
    };
    var C = x(h, {l: 0,dispose: function(a, b, d) {
            a = this;
            d = a.c;
            for (b in d)
                w.apply(h, d[b]);
            for (b in a)
                (d = a[b]) && d.dispose && d.dispose();
            a.__proto__ = h;
            for (b in a)
                a[b] = h, delete a[b]
        },contract: function(a, b, d, c, e) {
            c = this;
            c.c || (c.c = {});
            e = ++c.l;
            a.addEventListener(b, d, p);
            c.c[e] = [a, b, d];
            return e
        },uncontract: function(a, b, d) {
            a && (b = this.c, d = b[a], delete b[a], w(d[0], d[1], d[2]))
        },init: function() {
            this.f = {};
            this.e = []
        },on: function(a, b, d, c) {
            c = this.f;
            c[a] || (c[a] = []);
            c[a].push(b)
        },one: function(a, b, d, c) {
            d = this;
            c = function() {
                b.apply(d, 
                arguments);
                d.off(a, c)
            };
            c.q = b;
            d.on(a, c)
        },off: function(a, b, d, c, e, g) {
            c = this.f;
            if (b) {
                if (e = c[a])
                    for (g = e.length; g--; )
                        if (b == e[g] || b == e[g].q)
                            return e.splice(g, 1), 0 == e.length && delete c[a], n;
                return p
            }
            return delete c[a]
        },emit: z,bubble: z,capture: function() {
            var a = arguments, b = this.e, d = b.length, c;
            if (p !== this.only.apply(this, a))
                for (; d--; )
                    c = b[d], c.capture.apply(c, a)
        },only: function() {
            var a;
            a = [];
            a.push.apply(a, arguments);
            var b;
            b = a[0];
            u("String", b) && (b = {type: b,arguments: a,g: p,h: p,preventDefault: A,stopPropagation: B});
            b.before = b.target;
            b.target = this;
            var d = this.f[b.type] || [], c, e = d.length;
            a.splice(0, 1);
            for (a[a.length] = b; e--; )
                if (c = d[e])
                    if (c = c.apply(this, a), c === p || b.g)
                        return c;
            return b
        },addChild: function(a) {
            a.b && a.b.removeChild(a);
            a.b = this;
            this.e.push(a)
        },removeChild: function(a) {
            var b = this.e, d = b.length;
            if (a)
                for (; d--; ) {
                    if (b[d] === a) {
                        delete b[d].b;
                        b.splice(d, 1);
                        break
                    }
                }
            else
                for (; d--; ) {
                    a = b;
                    var c = d;
                    delete a[c].b;
                    a.splice(c, 1)
                }
        }}), F = x(C, {init: function(a) {
            a = a || q;
            var b = {engine: this};
            this._super();
            this.a = a.gravity;
            this.a.x = 
            v(this.a.x) ? this.a.x : 0;
            this.a.y = v(this.a.y) ? this.a.y : 9.80665E-4;
            this.n = a.sticky_threshold || 4E-4;
            this.entities = [];
            this.d = [];
            this.p = new D(b);
            this.r = new E(b)
        },addEntity: function(a) {
            this.entities.push(a)
        },removeEntity: function(a) {
            this.k(this.entities, a)
        },addCollision: function(a) {
            this.d.push(a)
        },removeCollision: function(a) {
            this.k(this.d, a)
        },k: function(a, b) {
            for (var d = a.length; d--; )
                if (a[d] === b) {
                    a.splice(d, 1);
                    break
                }
        },getEntities: l("entities"),getCollidables: l("d"),step: function(a) {
            for (var b = this.a.x * a, d = 
            this.a.y * a, c, e = this.entities, g = e.length, k; g--; )
                c = e[g], c.vx += c.ax * a + b, c.vy += c.ay * a + d, c.x += c.vx * a, c.y += c.vy * a, k = this.p.detectCollisions(c, this.d), k != h && this.r.resolve(c, k), c.emit("step", k)
        }}, f), G = x(C, {init: function(a) {
            a = a || q;
            this._super();
            this.size(a);
            this.restitution = v(a.restitution) ? a.restitution : 0.2;
            this.y = this.x = 0;
            this.position(a.position || q);
            this.vy = this.vx = 0;
            this.velocity(a.velocity || q);
            this.ay = this.ax = 0;
            this.acceleration(a.acceleration || q)
        },o: function() {
            this.j = 0.5 * this.width;
            this.i = 0.5 * this.height
        },
        size: function(a) {
            this.width = a.width;
            this.height = a.height;
            this.o()
        },position: function(a) {
            v(a.x) && (this.x = a.x);
            v(a.y) && (this.y = a.y)
        },velocity: function(a) {
            v(a.x) && (this.vx = a.x);
            v(a.y) && (this.vy = a.y)
        },acceleration: function(a) {
            v(a.x) && (this.ax = a.x);
            v(a.y) && (this.ay = a.y)
        },getMidX: function() {
            return this.j + this.x
        },getMidY: function() {
            return this.i + this.y
        },getTop: l("y"),getLeft: l("x"),getRight: function() {
            return this.x + this.width
        },getBottom: function() {
            return this.y + this.height
        }}, f), D = x(C, {detectCollisions: function(a, 
        b) {
            for (var d = b.length, c; d--; )
                if (c = b[d], a !== c && this.collideRect(a, c))
                    return c;
            return h
        },collideRect: function(a, b) {
            return a.getBottom() <= b.getTop() || a.getTop() >= b.getBottom() || a.getRight() <= b.getLeft() || a.getLeft() >= b.getRight() ? p : n
        }}, f), E = x(C, {init: function(a) {
            this._super();
            this.m = a.engine
        },resolve: function(a, b) {
            var d = this.m.n, c = a.getMidX(), e = a.getMidY(), g = b.getMidX(), k = b.getMidY(), c = (g - c) / b.j, e = (k - e) / b.i, k = Math.abs(c), g = Math.abs(e);
            0.1 > Math.abs(k - g) ? (a.x = 0 > c ? b.getRight() : b.getLeft() - a.width, a.y = 0 > 
            e ? b.getBottom() : b.getTop() - a.height, 0.5 > Math.random() ? (a.vx = -a.s * b.restitution, Math.abs(a.vx) < d && (a.vx = 0)) : (a.vy = -a.vy * b.restitution, Math.abs(a.vy) < d && (a.vy = 0))) : k > g ? (a.x = 0 > c ? b.getRight() : b.getLeft() - a.width, a.vx = -a.s * b.restitution, Math.abs(a.vx) < d && (a.vx = 0)) : (a.y = 0 > e ? b.getBottom() : b.getTop() - a.height, a.vy = -a.vy * b.restitution, Math.abs(a.vy) < d && (a.vy = 0))
        }}, f), H = {Entity: G,CollisionDetector: D,CollisionResolver: E,Observer: C};
    for (f in H)
        F[f] = H[f];
    m.PE = F;
}();
