define([
	'three',
	'emitter'
],function(
	THREE,
	Emitter
) {

	'use strict';

	var
	instance = null;

	function	TextureManager() {
		this.textures = {};
	}

	TextureManager.prototype.load = function (texture) {
		var that = this;
		this.textures[texture.name] = THREE.ImageUtils.loadTexture(texture.path, undefined, function () {
			that.emit('loaded');
		});
	};

	TextureManager.prototype.get = function (name) {
		return this.textures[name];
	};

	Emitter(TextureManager.prototype);

	TextureManager.getInstance = function () {
		if (instance === null) {
			instance = new TextureManager();
		}
		return instance;
	}

	return TextureManager.getInstance();

});