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
