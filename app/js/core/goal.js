define([
	'./entities/dummy',
	'three',
	'emitter',
	'./levels/world'
],function(
	Dummy,
	THREE,
	Emitter,
	World
){

	'use strict';

	function	Goal() {
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

	Emitter(Goal.prototype); // jshint ignore:line

	return new Goal();

});