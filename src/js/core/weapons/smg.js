(function() {

/*global require, module */

/***
 *      _____                  _          
 *     |  __ \                (_)         
 *     | |__) |___  __ _ _   _ _ _ __ ___ 
 *     |  _  // _ \/ _` | | | | | '__/ _ \
 *     | | \ \  __/ (_| | |_| | | | |  __/
 *     |_|  \_\___|\__, |\__,_|_|_|  \___|
 *                    | |                 
 *                    |_|                 
 */

var Projectile 	= require('../entities/projectile');
var Projectiles = require('../entities/projectiles');

var EffectAudio = require('../../util/effectAudio');
var Emitter 	= require('../../util/emitter');
var Mouse 		= require('../../util/mouse');

/***
 *       _____                _              _       
 *      / ____|              | |            | |      
 *     | |     ___  _ __  ___| |_ __ _ _ __ | |_ ___ 
 *     | |    / _ \| '_ \/ __| __/ _` | '_ \| __/ __|
 *     | |___| (_) | | | \__ \ || (_| | | | | |_\__ \
 *      \_____\___/|_| |_|___/\__\__,_|_| |_|\__|___/
 *                                                   
 *                                                   
 */

var

/**
 * 
 */
FIRE_MODES = {
	SINGLE:		1,
	BURST:		2,
	CONTINUOUS:	3
};

/***
 *       _____                _                   _
 *      / ____|              | |                 | |
 *     | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __
 *     | |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
 *     | |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |
 *      \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|
 *
 */

/**
 * 
 */
function SMG () {

	this.triggerPressed = false;
	this.isShooting = false;
	this.canShoot = true;

	this.fireMode = FIRE_MODES.CONTINUOUS;
	this.recoil = 2;

	this.isReloading = false;
	this.reloadTime = 1000;
	this.currentReloadTime = 0;

	this.magazineSize = 15;
	this.currentMagazineSize = this.magazineSize;

	this.shootingTimePerRound = 100;
	this.currentShootingTimePerRound = 0;
}

/***
 *      _____       _     _ _
 *     |  __ \     | |   | (_)
 *     | |__) |   _| |__ | |_  ___
 *     |  ___/ | | | '_ \| | |/ __|
 *     | |   | |_| | |_) | | | (__
 *     |_|    \__,_|_.__/|_|_|\___|
 *
 */

SMG.prototype = {

	/**
	 * 
	 */
	pullTrigger: function (){
		this.triggerPressed = true;
	},

	/**
	 * 
	 */
	releaseTrigger: function () {
		this.triggerPressed = false;
	},

	/**
	 * 
	 */
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

	/**
	 * 
	 */
	logic: function (timeDelta, playerPosition) {

		if (this.canShoot) {

			if (this.triggerPressed && this.currentMagazineSize > 0) {
				this.canShoot = false;
				this.isShooting = true;
				this.currentMagazineSize--;

				_fireShot(this, playerPosition);

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

		} else if (this.isShooting) {

			this.currentShootingTimePerRound += timeDelta;

			if (this.currentShootingTimePerRound >= this.shootingTimePerRound) {
					this.canShoot = true;
					this.isShooting = false;
					this.currentShootingTimePerRound = 0;
			}
		}
	}
};

SMG.FIRE_MODES = FIRE_MODES;

Emitter(SMG.prototype);

module.exports = SMG;

/***
 *      _____      _            _
 *     |  __ \    (_)          | |
 *     | |__) | __ ___   ____ _| |_ ___
 *     |  ___/ '__| \ \ / / _` | __/ _ \
 *     | |   | |  | |\ V / (_| | ||  __/
 *     |_|   |_|  |_| \_/ \__,_|\__\___|
 *
 */

 /**
  * 
  * @param {SMG} self 
  * @param {*} playerPosition 
  */
function _fireShot (self, playerPosition) {

	var direction = Mouse.getDirectionTo(
		playerPosition.x,
		playerPosition.y,
		playerPosition.z);

	var position = playerPosition.clone();

	position.x += direction.x * 2;
	position.y += direction.y * 2;
	position.z += direction.z * 2;

	EffectAudio.play('shoot');
	self.emit('fire', {
		recoilFeedback:direction.clone().multiplyScalar(self.recoil),
	});

	Projectiles.add(new Projectile({
		direction: direction,
		velocity: 100,
		position: position,
		mass: 2
	}));
}

}());
