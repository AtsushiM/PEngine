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
