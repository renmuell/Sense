(function() {

/*global require, module, AudioContext */

var Emitter = require('../../vendors_dev/emitter-2.0.0/emitter');

function Engine() {
}

Engine.prototype = {
	setup: function () {

	}
};

Emitter.default(Engine.prototype); // jshint ignore:line

module.exports = new Engine();

}());
