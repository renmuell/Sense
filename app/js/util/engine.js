define([
	'jquery',
	'emitter'
],function(
	$,
	Emitter
){

	'use strict';

	function Engine() {
	}

	Engine.prototype = {
		setup: function () {

		}
	};

	Emitter(Engine.prototype); // jshint ignore:line

	return new Engine();

});