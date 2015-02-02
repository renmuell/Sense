define([
],function(
){

	'use strict';

	var instance = null;

	function	EffectAudio() {
		this.context = getAudioContext();
	}

	EffectAudio.prototype.load = function (name) {
	};

	EffectAudio.prototype.play = function (name, volume){
		var that = this;
		var url = 'media/effects/' + name + '.ogg';
	  var request = new XMLHttpRequest();
	  request.open('GET', url, true);
	  request.responseType = 'arraybuffer';

	  // Decode asynchronously
	  request.onload = function() {
	    that.context.decodeAudioData(request.response, function(buffer) {
	      var src = that.context.createBufferSource();
	      src.buffer = buffer;
	      src.connect(that.context.destination);
	      src.start(0);
	    });
	  }
	  request.send();
	};

	EffectAudio.getInstance = function () {
		if(instance === null) {
			instance = new EffectAudio();
		}
		return instance;
	};

	return EffectAudio.getInstance();

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