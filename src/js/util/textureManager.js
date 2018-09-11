(function() {

/*global require, module */

var THREE = require('../../vendors_dev/threejs-0.96.0/three');
var Emitter = require('../../vendors_dev/emitter-2.0.0/emitter');

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

Emitter.default(TextureManager.prototype); // jshint ignore:line

module.exports = new TextureManager();

}());
