define([
	'jquery',
	'emitter'
],function(
	$,
	Emitter
){

	'use strict';

	function IntroPage() {
	}

	IntroPage.prototype = {
		setup: function () {
			var that = this;

			$('#intro').addClass('open');

			//EffectAudio.play('open');

			$('.start').click(function(){
				$(this).blur();
				that.emit('startGame');
			});
		}
	};

	Emitter(IntroPage.prototype); // jshint ignore:line

	return new IntroPage();

});