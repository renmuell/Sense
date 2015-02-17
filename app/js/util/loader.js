define([
	'./backgroundMusic',
	'./effectAudio',
	'./textureManager',
	'emitter',
	'jquery',
	'bootstrap',
	'bootstrapProgressbar'
],function(
	BackgroundMusic,
	EffectAudio,
	TextureManager,
	Emitter,
	$
){

	'use strict';

	var

	instance = null,
	talking = [
		'(*_*)',
		'd(o_o)b',
		'(-_-)',
		'(╯°□°）╯︵ ┻━┻',
		'(๑>ᴗ<๑)',
		'(¬､¬)',
		'ლ(ಠ益ಠლ',
		'(^._.^)ﾉ',
		'ε===(っ≧ω≦)っ',
		'|ω・）'
	],
	resources =
	[
		[BackgroundMusic, 'slowmotion.mp3'],
		[EffectAudio, 'ah'],
		[EffectAudio, 'colide'],
		[EffectAudio, 'death'],
		[EffectAudio, 'hello'],
		[EffectAudio, 'hit'],
		[EffectAudio, 'jump'],
		[EffectAudio, 'kiss'],
		[EffectAudio, 'oh2'],
		[EffectAudio, 'ohyeah'],
		[EffectAudio, 'open'],
		[EffectAudio, 'ouch'],
		[EffectAudio, 'reload'],
		[EffectAudio, 'shoot'],
		[EffectAudio, 'zing'],
		[TextureManager, { name: 'emotion_normal', path: 'media/img/emotion/normal.png' }],
	];

	function Loader() {
		var that = this;
		this.numLoaded = 0;

		$('#load .progressbar').progressbar({
		    maximum: 100,
		    warningMarker: 100,
		    dangerMarker: 100,
		    step: 100/resources.length
		});

		BackgroundMusic.on('loaded', function () { that.step(); });
		EffectAudio.on('loaded', function () { that.step(); });
		TextureManager.on('loaded', function () { that.step(); });
	}

	Loader.prototype.step = function () {
		this.numLoaded++;
		this.check();
		$('#load .progressbar').progressbar('stepIt');
		$('.progressbar-talking').html(talking[Math.floor(Math.random() *  talking.length )]);
	};

	Loader.prototype.load = function () {
		for(var index = 0, count = resources.length - 1; count >= 0; count--, index++) {
			resources[index][0].load(resources[index][1]);
		}
	};

	Loader.prototype.check = function () {
		if (this.numLoaded == resources.length) {
			this.emit('loaded');
		}
	}

	Loader.getInstance = function () {
		if (instance === null) {
			instance = new Loader();
		}
		return instance;
	};

	Emitter(Loader.prototype);

	return Loader.getInstance();

});