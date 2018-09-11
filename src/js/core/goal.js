(function() {

/*global require, module */

var Dummy = require('./entities/dummy');
var THREE = require('../../vendors_dev/threejs-0.96.0/three');
var Emitter = require('../../vendors_dev/emitter-2.0.0/emitter');
var World = require('./levels/world');

function Goal() {
	this.dummies = [];
}

Goal.prototype = {

	setup : function (scene, physicWorld) {
		this.scene = scene;
		this.physicWorld = physicWorld;
		this._addDummies();
	},

	logic : function (timeDelta, camera) {
		var hitCount  = 0;

		for (var i = this.dummies.length - 1; i >= 0; i--) {
			if (this.dummies[i]) {
				if(this.dummies[i].playerHit) {
					hitCount++;
				}
				this.dummies[i].logic(this.scene, this.physicWorld, timeDelta, camera);
			}
		}

		if (hitCount === this.dummies.length) {
			this.emit('finish');
		}
	},

	_addDummies: function () {
		for (var i = World.worldTiles.length - 1; i >= 0; i--) {
			var worldTile = World.worldTiles[i];
			if (worldTile) {
				if (Math.random() > 0.5) {
					var dummy = new Dummy(
						this.scene,
						this.physicWorld,
						new THREE.Vector3(
							worldTile.position.x,
							worldTile.position.y,
							worldTile.position.z + 12));
					dummy.on('death', this._removeDummmy.bind(this));
					this.dummies.push(dummy);
				}
			}
		}
	},

	_removeDummmy: function (dummy) {
		for (var i = this.dummies.length - 1; i >= 0; i--) {
			if (this.dummies[i] && this.dummies[i].id === dummy.id) {
					delete this.dummies[i];
			}
		}
	}
};

Emitter.default(Goal.prototype); // jshint ignore:line

module.exports = new Goal();

}());
