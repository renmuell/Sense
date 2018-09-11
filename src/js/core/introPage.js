(function() {

/*global require, module */

var Emitter = require('../util/emitter');

function IntroPage() {
}

IntroPage.prototype = {
	setup: function () {
		var that = this;
		document.getElementById('intro').classList.add('open');

		//EffectAudio.play('open');
		document.querySelector('.start').addEventListener('click', function(){
			that.emit('startGame');
		})
	}
};

Emitter(IntroPage.prototype);

module.exports = new IntroPage();

}());
