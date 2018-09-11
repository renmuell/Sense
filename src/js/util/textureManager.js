(function() {

/*global require, module, THREE */

var Emitter = require('./emitter');

function TextureManager() {
	this.textures = {};
}

TextureManager.prototype = {
	load: function (texture) {
		var loader =  new THREE.TextureLoader();
		this.textures[texture.name] = 
		loader.load(texture.path, this._loadTextureHandler.bind(this));
	},
	get: function (name) {
		return this.textures[name];
	},
	_loadTextureHandler: function(){
		this.emit('loaded');
	},
};

Emitter(TextureManager.prototype);

module.exports = new TextureManager();

}());
