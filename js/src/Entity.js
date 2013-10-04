// PhysicsEntity
var PhysicsEntity = classExtendObserver({
    'init': function(config) {
        config = config || NULLOBJ;

        var that = this,
            temp;

        that['_super']();

        that._collision = 'elastic';

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
