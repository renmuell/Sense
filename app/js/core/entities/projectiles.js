define([
],function(
){

	'use strict';

	var

	instance = null,

	MIN_RESTRUCTURE_NUM = 20;

	function	Projectiles() {
		this._container = [];
		this._containerNumUndefined = 0;
	}

	Projectiles.prototype.add = function (projectile) {
		this._container.push(projectile);
	};

	Projectiles.prototype.isProjectile = function (physicBody) {
		for (var count = this._container.length - 1; count >= 0; count--) {
			if (this._container[count]) {
				if (physicBody.id === this._container[count].getPhysicBodyId()) {
					return true;
				}
			}
		}
		return false;
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
					this._container[index] = undefined;
					this._containerNumUndefined++;
				}
			}
		}

		if (this._container.length > MIN_RESTRUCTURE_NUM
		 && this._containerNumUndefined > this._container.length/2) {
			this.reStructureContainer();
		}
	};

	Projectiles.prototype.reStructureContainer = function () {
		var newContainer = [];

		for (var count = this._container.length - 1, newIndex = 0; count >= 0; count--) {
			if(this._container[count]) {
				newContainer[newIndex] = this._container[count];
				newIndex++;
			}
		};

		this._container = newContainer;
		this._containerNumUndefined = 0;
	};

	Projectiles.getInstance = function () {
		if (instance === null) {
			instance = new Projectiles();
		}
		return instance;
	};

	return Projectiles.getInstance();

});