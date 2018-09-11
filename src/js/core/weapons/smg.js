(function() {

/*global require, module */
var Emitter = require('../../util/emitter');
var Mouse = require('../../util/mouse');
var EffectAudio = require('../../util/effectAudio');
var Projectile = require('../entities/projectile');
var Projectiles = require('../entities/projectiles');

var

FIRE_MODES = {
	SINGLE:1,
	BURST:2,
	CONTINUOUS:3
};

function SMG() {
	this.triggerPressed = false;
	this.isShooting = false;
	this.canShoot = true;

	this.fireMode = FIRE_MODES.SINGLE;
	this.recoil = 2;

	this.isReloading = false;
	this.reloadTime = 1000;
	this.currentReloadTime = 0;

	this.magazineSize = 15;
	this.currentMagazineSize = this.magazineSize;

	this.shootingTimePerRound = 100;
	this.currentShootingTimePerRound = 0;
}

SMG.prototype = {

	pullTrigger: function (){
		this.triggerPressed = true;
	},

	releaseTrigger: function () {
		this.triggerPressed = false;
	},

	switchFireMode: function () {
		switch(this.fireMode) {
			case FIRE_MODES.SINGLE : {
				this.fireMode = FIRE_MODES.BURST;
				break;
			}
			case FIRE_MODES.BURST : {
				this.fireMode = FIRE_MODES.CONTINUOUS;
				break;
			}
			default: {
				this.fireMode = FIRE_MODES.SINGLE;
			}
		}
	},

	logic: function (timeDelta, playerPosition) {
		if (this.canShoot) {
			if (this.triggerPressed && this.currentMagazineSize > 0) {
				this.canShoot = false;
				this.isShooting = true;
				this.currentMagazineSize--;

				this._fireShot(playerPosition);

			} else if (this.currentMagazineSize === 0) {
				this.emit('reloadStart');
				this.canShoot = false;
				this.isReloading = true;
				this.currentReloadTime = 0;
			}
		} else if (this.isReloading) {
			this.currentReloadTime += timeDelta;
			if (this.currentReloadTime >= this.reloadTime) {
				this.emit('reloadEnd');
				this.canShoot = true;
				this.isReloading = false;
				this.currentMagazineSize = 15;
			}

		} else if (this.isShooting){
			this.currentShootingTimePerRound += timeDelta;
			if (this.currentShootingTimePerRound >= this.shootingTimePerRound) {
					this.canShoot = true;
					this.isShooting = false;
					this.currentShootingTimePerRound = 0;
			}
		}
	},

	_fireShot: function (playerPosition) {
		var direction = Mouse.getDirectionTo(
			playerPosition.x,
			playerPosition.y,
			playerPosition.z);

		var position = playerPosition.clone();

		position.x += direction.x * 2;
		position.y += direction.y * 2;
		position.z += direction.z * 2;

		EffectAudio.play('shoot');
		//setTimeout(function (){
			this.emit('fire', {
				recoilFeedback:direction.clone().multiplyScalar(this.recoil),
			});

			Projectiles.add(new Projectile({
				direction: direction,
				velocity: 100,
				position: position,
				mass: 2
			}));
		//}, 1000);
	}
};

SMG.FIRE_MODES = FIRE_MODES;

Emitter(SMG.prototype);

module.exports = SMG;

}());
