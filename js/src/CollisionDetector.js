// CollisionDetector
var CollisionDetector = classExtendObserver({
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
