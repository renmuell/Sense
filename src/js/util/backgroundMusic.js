(function() {

/*global require, module, AudioContext, Uint8Array */

var Emitter = require('./emitter');
var Settings = require('../settings');

function BackgroundMusic() {
	this.context = new AudioContext();
	this._started = false;
	this._init = false;
	if (this.context) {
		this.byteFrequencyData = [];
		this.boost = 0;
	}
}

BackgroundMusic.prototype = {

	load: function (filename) {
		var url = 'media/music/' + filename,
				request = new XMLHttpRequest();

		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = this._requestOnload.bind({ that: this, request: request });
		request.send();
	},

	hasStarted: function () {
		return this._started;
	},

	play: function () {
		if (this._started) {
			this.source.connect(this.analyser);
			this.source.connect(this.gain);
		} else {
			this.source.start(0);
			this._started = true;
		}
	},

	stop: function () {
		this.source.disconnect();
	},

	_requestOnload: function (){
		var that = this.that,
				request = this.request;

		that.context.decodeAudioData(
			request.response,
			that._deodeAudioDataHandler.bind(that));
	},

	_deodeAudioDataHandler: function (buffer) {
		if(buffer) {
			this.sourceJs = this.context.createScriptProcessor(2048, 1, 1);
			this.sourceJs.buffer = buffer;
			this.sourceJs.onaudioprocess = this._onAudioProcessHandler.bind(this);

			this.analyser = this.context.createAnalyser();
			this.analyser.smoothingTimeConstant = 0.6;
			this.analyser.fftSize = 512;

			this.source = this.context.createBufferSource();
			this.source.buffer = buffer;
			this.source.loop = true;

			this.gain = this.context.createGain();
			this.gain.gain.value = Settings.audio.music.volume;

			this.sourceJs.connect(this.context.destination);
			this.analyser.connect(this.sourceJs);
			this.source.connect(this.analyser);
			this.source.connect(this.gain);
			this.gain.connect(this.context.destination);

			this.emit('loaded');
		}
	},

	_onAudioProcessHandler: function () {
		this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(this.byteFrequencyData);
		this.boost = 0;

		for (var i = this.byteFrequencyData.length-1 ; i >= 0 ; i--) {
			this.boost += this.byteFrequencyData[i];
		}

		this.boost = this.boost / this.byteFrequencyData.length;
	}
};

Emitter(BackgroundMusic.prototype);

module.exports = new BackgroundMusic();

}());
