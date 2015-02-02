define([
],function(
){

	'use strict';

	var instance = null;

	function	Projectiles() {
		this._container = [];
	}

	Projectiles.prototype.add = function (projectile) {
		this._container.push(projectile);
	};

	Projectiles.prototype.isProjectile = function (physicBody) {
		var isProjectile = false;
		for (var index = 0, count = this._container.length - 1; count >= 0; count--, index++) {
			var projectile = this._container[index];
			if (projectile) {
				if (physicBody.id === projectile.getPhysicBodyId()) {
					isProjectile = true;
				}
			}
		}
		return isProjectile;
	};

	Projectiles.prototype.logic = function (scene, physicWorld) {
		for (var index = 0, count = this._container.length - 1; count >= 0; count--, index++) {
			var projectile = this._container[index];
			if (projectile) {
				if (!projectile.isCreated) {
					projectile.create(scene, physicWorld);
				}

				projectile.logic();

				if (projectile.canKill) {
					projectile.kill(scene, physicWorld);
					// TODO: dynamic array shorten
					this._container[index] = undefined;
				}
			}
		};
	};

	Projectiles.getInstance = function () {
		if (instance === null) {
			instance = new Projectiles();
		}
		return instance;
	};

	return Projectiles.getInstance();

});