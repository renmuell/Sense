(function() {

/*global require, module */

var $ = require('../../vendors_dev/jquery-3.3.1/jquery-3.3.1');
var Emitter = require('../../vendors_dev/emitter-2.0.0/emitter');

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

Emitter.default(IntroPage.prototype); // jshint ignore:line

module.exports = new IntroPage();

}());
