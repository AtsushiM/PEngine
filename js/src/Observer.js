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
            i = inArray(instance, childs);

            if (i !== -1) {
                Observer_removeChildExe(childs, i);

                return;
            }
        }
        else {
            for (; i--; ) {
                Observer_removeChildExe(childs, i);
            }
        }
    }
}),
