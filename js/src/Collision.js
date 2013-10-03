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
