(function() {

/*global module */

var MIN_RESTRUCTURE_NUM = 20;

/***
 *       _____                _                   _
 *      / ____|              | |                 | |
 *     | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __
 *     | |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
 *     | |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |
 *      \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|
 *
 */

function Projectiles() {
	this._container = [];
	this._containerNumUndefined = 0;
}

Projectiles.prototype = {

	/***
	 *      _____       _     _ _
	 *     |  __ \     | |   | (_)
	 *     | |__) |   _| |__ | |_  ___
	 *     |  ___/ | | | '_ \| | |/ __|
	 *     | |   | |_| | |_) | | | (__
	 *     |_|    \__,_|_.__/|_|_|\___|
	 *
	 */

	add: function (projectile) {
		this._container.push(projectile);
	},

	isProjectile: function (physicBody) {
		for (var count = this._container.length - 1; count >= 0; count--) {
			if (this._container[count]) {
				if (physicBody.id === this._container[count].getPhysicBodyId()) {
					return true;
				}
			}
		}
		return false;
	},

	logic: function (scene, physicWorld, timeDelta) {
		for (var index = 0, count = this._container.length - 1; count >= 0; count--, index++) {
			var projectile = this._container[index];
			if (projectile) {
				if (!projectile.isCreated) {
					projectile.create(scene, physicWorld);
				}

				projectile.logic(timeDelta);

				if (projectile.canKill) {
					projectile.kill(scene, physicWorld);
					this._container[index] = undefined;
					this._containerNumUndefined++;
				}
			}
		}

		if (this._container.length > MIN_RESTRUCTURE_NUM && this._containerNumUndefined > this._container.length/2) {
			this.reStructureContainer();
		}
	},

	reStructureContainer: function () {
		var newContainer = [];

		for (var count = this._container.length - 1, newIndex = 0; count >= 0; count--) {
			if(this._container[count]) {
				newContainer[newIndex] = this._container[count];
				newIndex++;
			}
		}

		this._container = newContainer;
		this._containerNumUndefined = 0;
	}

};

module.exports = new Projectiles();

}());
