(function() {

/*global module */

function Emitter(prototype) {

    prototype.emit = function (event, object){

        if (this._emitCallbacks == undefined) {
            this._emitCallbacks = {};
        }

        if (this._emitCallbacks[event]) {
            this._emitCallbacks[event].forEach(function(callback){
                callback(object);
            });
        }
    };

    prototype.on = function (event, callback){
        if (this._emitCallbacks == undefined) {
            this._emitCallbacks = {};
        }

        if (typeof this._emitCallbacks[event] === "undefined") {
            this._emitCallbacks[event] = [];
        }

        this._emitCallbacks[event].push(callback);
    };
}

module.exports = Emitter;

}());
    