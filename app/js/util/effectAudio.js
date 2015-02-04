define([
	'emitter'
],function(
	Emitter
){

	'use strict';

	var

	URL = 'media/effects/{{titel}}.ogg',

	/* @type { EffectAudio } */
	instance;

	/**
	 *  Effect Audio
	 *  @constructor
	 */
	function EffectAudio() {
		this.context = getAudioContext();
		this.loadedSounds = {};
	}

	/**
	 *  Loads effect audio
	 *  @public
	 *  @param {string} filename
	 */
	EffectAudio.prototype.load = function (filename) {
		var that = this,
				request = new XMLHttpRequest();
	  request.open('GET', getUrl(filename), true);
	  request.responseType = 'arraybuffer';
	  request.onload = function () {
	  	that.context.decodeAudioData(request.response, function (buffer) {
	  		that.loadedSounds[filename] = buffer;
	  		that.emit('loaded');
	  	});
	  };
	  request.send();
	};

	/**
	 *  Play loaded effect audio
	 *  @public
	 *  @param {string} filename
	 *  @param {number} volume
	 */
	EffectAudio.prototype.play = function (filename, volume){
			var src = this.context.createBufferSource();
			var gain = this.context.createGain();
      src.buffer = this.loadedSounds[filename];
      src.connect(gain);
      gain.connect(this.context.destination);
      src.start(0);
	};

	Emitter(EffectAudio.prototype);

	return instance = instance || new EffectAudio();

	function getUrl (filename) {
		return URL.replace('{{titel}}', filename);
	}

	function getAudioContext () {
		return webkitAudioContext ? new webkitAudioContext() : new AudioContext();
	}

});