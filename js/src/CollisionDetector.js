// CollisionDetector
CollisionDetector = classExtendObserver({
    'detectCollisions': function(collider, collidees) {
        var i = collidees.length;

        for (; i--; ) {
            if (collider !== collidees[i] && this['collideRect'](collider, collidees[i])) {
                return collidees[i];
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
