define([
	'jquery',
	'emitter',
	'./../util/effectAudio'
],function(
	$,
	Emitter,
	EffectAudio
) {

	'use strict';

	var

	instance = null;

	function	IntroPage() {
	}

	IntroPage.prototype.setup = function () {
		$('#intro').addClass('open');;

		//EffectAudio.play('open');

		var
		that = this;

		$('.start').click(function(){
			$(this).blur();
				that.emit('startGame');
		});
	};

	Emitter(IntroPage.prototype);

	IntroPage.getInstance = function () {
		if (instance === null) {
			instance = new IntroPage();
		}
		return instance;
	};

	return IntroPage.getInstance();
});