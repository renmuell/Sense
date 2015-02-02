define([
	'emitter',
	'./../core/introPage'
],function(
	Emitter,
	IntroPage
){

	'use strict';

	var

	instance = null;

	function	BackgroundMusic() {
		this.context = getAudioContext();
		this._started = false;
		this._init = false;
		if (this.context) {
			this.byteFrequencyData = [];
			this.boost = 0;
		}
	}

	BackgroundMusic.prototype.setup = function () {
		if (!this._init) {

			this._init = true;
			var that = this;
			var url = 'media/music/slowmotion.mp3';
		  var request = new XMLHttpRequest();
		  request.open('GET', url, true);
		  request.responseType = 'arraybuffer';

		  // Decode asynchronously
		  request.onload = function() {
		    that.context.decodeAudioData(request.response, deodeAudioData_Handler.bind(that));
		  }
		  request.send();
		}
	};

	BackgroundMusic.prototype.hasStarted = function () {
		return this._started;
	};

	BackgroundMusic.prototype.play = function () {
		if (this._started) {
			this.source.connect(this.analyser);
			this.source.connect(this.context.destination);
		} else {
			this.source.start(0);
			this._started = true;
		}
	};

	BackgroundMusic.prototype.stop = function () {
		this.source.disconnect();
	}

	Emitter(BackgroundMusic.prototype);

	BackgroundMusic.getInstance = function () {
		if (instance === null) {
			instance = new BackgroundMusic();
		}
		return instance;
	};

	return BackgroundMusic.getInstance();

	function deodeAudioData_Handler (buffer) {
		if(!buffer) {
			return;
		}

		this.sourceJs = this.context.createScriptProcessor(2048, 1, 1);
		this.sourceJs.buffer = buffer;
		this.sourceJs.onaudioprocess = onAudioProcess_Handler.bind(this);

		this.analyser = this.context.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.6;
		this.analyser.fftSize = 512;

		this.source = this.context.createBufferSource();
		this.source.buffer = buffer;
		this.source.loop = true;

		this.sourceJs.connect(this.context.destination);
		this.analyser.connect(this.sourceJs);
		this.source.connect(this.analyser);
		this.source.connect(this.context.destination);

		this.emit('loaded');
	}

	function onAudioProcess_Handler (e) {
		this.byteFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(this.byteFrequencyData);
		this.boost = 0;

		for (var i = this.byteFrequencyData.length-1 ; i >= 0 ; i--) {
			this.boost += this.byteFrequencyData[i];
		}

		this.boost = this.boost / this.byteFrequencyData.length;
	}

	function deodeAudioData_Error () {

	}

	function getAudioContext () {
		var context;
		try {
			if(typeof webkitAudioContext === 'function') {
			   context = new webkitAudioContext();
			} else {
			   context = new AudioContext();
			}
		} catch (e) {

		}
		return context;
	}

});