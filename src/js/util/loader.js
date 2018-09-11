(function() {

/*global require, module */

var BackgroundMusic = require('./backgroundMusic');	
var EffectAudio = require('./effectAudio');	
var TextureManager = require('./textureManager');
var Emitter = require('./emitter');

var
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
	'|ω・）',
	'( •̀ω•́ )σ',
	'(シ_ _)シ',
	'⋋( ◕ ∧ ◕ )⋌',
	'(=^･^=)',
	'~(=^–^)',
	'(☉_☉)',
	'~(‾▿‾~)',
	'(×_×;）',
	'(Ｕ^ω^)',
	'(-｀ω´-,,)'
],
resources = [
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
/*
progressbarData = {
	maximum: 100,
	warningMarker: 100,
	dangerMarker: 100,
	step: 100/resources.length
};
*/

function Loader() {
	this.numLoaded = 0;

	//this.$progressbar = $('#load .progressbar');
	//this.$progressbarTalking = $('.progressbar-talking');

	//this.$progressbar.progressbar(progressbarData);

	BackgroundMusic.on('loaded', this.step.bind(this) );
	EffectAudio.on('loaded', this.step.bind(this));
	TextureManager.on('loaded', this.step.bind(this));
}

Loader.prototype = {
	step: function () {
		if (++this.numLoaded === resources.length) {
			this.emit('loaded');
		} else {
			//this.$progressbar.progressbar('stepIt');
			//this.$progressbarTalking.html(this._getTalking());
		}
	},
	load: function () {
		for(var i = resources.length - 1; i >= 0; i--) {
			resources[i][0].load(resources[i][1]);
		}
	},
	_getTalking: function (){
		return talking[Math.floor(Math.random() * talking.length)];
	}
};

Emitter(Loader.prototype);

module.exports = new Loader();

}());
