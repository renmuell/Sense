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

	var

	instance = null;

	function	Goal() {
		this.dummies = [];
	}

	Goal.prototype.setup = function (scene, physicWorld) {
		this.scene = scene;
		this.physicWorld = physicWorld;
		addDummies.call(this);
	};

	Goal.prototype.logic = function (timeDelta, camera) {
		var hitCount  = 0;
		for (var i = this.dummies.length - 1; i >= 0; i--) {
			if (this.dummies[i]) {
				if(this.dummies[i].playerHit) { hitCount++; }

				this.dummies[i].logic(this.scene, this.physicWorld, timeDelta, camera);
			}
		}
		if (hitCount === this.dummies.length) {
			this.emit('finish');
		}
	}

	Emitter(Goal.prototype);

	Goal.getInstance = function () {
		if (instance === null) {
			instance = new Goal();
		}
		return instance;
	};

	return Goal.getInstance();

	function addDummies () {
		var that = this;
		for (var i = World.worldTiles.length - 1; i >= 0; i--) {
			var worldTile = World.worldTiles[i];
			if (worldTile) {
				var createDummy = Math.random() > 0.5;
				if (createDummy) {
					var dummy = new Dummy(this.scene, this.physicWorld, new THREE.Vector3(
						worldTile.position.x,
						worldTile.position.y,
						worldTile.position.z + 12));
					dummy.on('death', function (me) {
						removeDummmy.call(that, me);
					});
					this.dummies.push(dummy);
				}
			}
		}
		//setTimeout(addDummies.bind(this), 10000);
	}

	function removeDummmy(dummy) {
		for (var i = this.dummies.length - 1; i >= 0; i--) {
			if (this.dummies[i]) {
				if (this.dummies[i].id === dummy.id) {
						this.dummies[i] = undefined;
				}
			}
		}
	}

});