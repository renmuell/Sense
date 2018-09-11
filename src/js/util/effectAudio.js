(function() {

/*global require, module, AudioContext */

var Emitter = require('./emitter');
var Settings = require('../settings');
	
var URL = 'media/effects/{{titel}}.ogg';

/**
 *  Effect Audio
 *  @constructor
 */
function EffectAudio() {
	this.context = new AudioContext();
	this.loadedSounds = {};
}

EffectAudio.prototype = {

	/**
	 *  Loads effect audio
	 *  @public
	 *  @param {string} filename
	 */
	load: function (filename) {
		var that = this,
			request = new XMLHttpRequest();
		request.open('GET', this._getUrl(filename), true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			that.context.decodeAudioData(request.response, function (buffer) {
				that.loadedSounds[filename] = buffer;
				that.emit('loaded');
			});
		};
		request.send();
	},

	/**
	 *  Play loaded effect audio
	 *  @public
	 *  @param {string} filename
	 *  @param {number} volume
	 */
	play: function (filename, volume) {
		var src = this.context.createBufferSource(),
			gain = this.context.createGain();

		volume = volume || 1;

		gain.gain.value = Settings.audio.effects.volume * volume;
		src.buffer = this.loadedSounds[filename];
		src.connect(gain);
		gain.connect(this.context.destination);
		src.start(0);
	},

	_getUrl: function (filename) {
		return URL.replace('{{titel}}', filename);
	}
};

Emitter(EffectAudio.prototype);

module.exports = new EffectAudio();

}());
