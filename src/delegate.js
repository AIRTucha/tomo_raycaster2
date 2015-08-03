/**
 * @classdesc
 * Delegate
 * 
 * @class Delegate
 * @this {RC.Delegate}
 * @author sogimu@nxt.ru Aleksandr Lizin aka sogimu
 * @version 0.1
 *
 * @requires NamespaceRC.js
 */

(function(namespace) {
    var Delegate = function(O) {

        var me = {};
        me.class = this;

        me._functions = [];
        me._context = window;

        me.Add = function(func) {
            // gizmo.Filter(func, "Function");
            me._functions.push(func);

        };

        me.Remove = function() {

        };

        me.Call = function(value, context) {
            // var context = gizmo.isSet(context)? context : me._context;
            var context = context ? context : me._context;

            for(i in me._functions) {
                var func = me._functions[i];
                func.call(context, value);
            };

        };

        me.IsEmpty = function() {
            return me._functions.length == 0;

        };

        me.SetConfig = function(O) {
            // gizmo.Filter(O, "Object");
            for(prop in O) {
                switch(prop) {
                    case "context": {
                        // gizmo.Filter(O[prop], "Object");
                        this._context = O[prop];
                    };break;

                };    
            };

        };

        /**
        * Constructor
        *
        * @method Delegate.Constructor
        * @this {RC.Delegate}
        * @Delegate {Object} O
        * @Delegate {Object} O.self         Context for calling
        */
        me.Constructor = function(O) {
            this.SetConfig(O);
            
        };

        me.Constructor(O);

        return me;

    };
    
    namespace.Delegate = Delegate;

})(window.RC);