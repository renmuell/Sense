define([
	'three',
	'emitter'
],function(
	THREE,
	Emitter
) {

	'use strict';

	function	TextureManager() {
		this.textures = {};
	}

	TextureManager.prototype = {
		load: function (texture) {
			this.textures[texture.name] = THREE.ImageUtils.loadTexture(texture.path, undefined, this._loadTextureHandler.bind(this));
		},
		get: function (name) {
			return this.textures[name];
		},
		_loadTextureHandler: function(){
			this.emit('loaded');
		},
	};

	Emitter(TextureManager.prototype); // jshint ignore:line

	return new TextureManager();

});