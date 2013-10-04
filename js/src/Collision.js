// Collision Decorator Pattern Abstraction
var Collision = {
    'elastic': function(restitution) {
        this.restitution = restitution || 0.2;
    }
};
