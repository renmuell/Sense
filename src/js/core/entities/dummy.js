(function() {

/*global require, module, THREE, CANNON */

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

var Projectiles 	= require('./projectiles');

var EffectAudio 	= require('../../util/effectAudio');
var Emitter 		= require('../../util/emitter');
var Mouse 			= require('../../util/mouse');
var TextureManager 	= require('../../util/textureManager');

var TextureAnimator	= require('../../../vendors_dev/textureAnimator/textureAnimator');

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
 * The default body size.
 * 
 * @const
 * @private
 * @type {number}
 */
SIZE = 1,

/**
 * The default color when hit by bullet.
 * 
 * @const
 * @private
 * @type {number}
 */
COLOR_HIT = 0xC3D1EC;

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
 * Creates new entity instance of Dummy. 
 * 
 * @constructor
 * @emits death - When entity died.
 * @param {THREE.Scene} scene - The render scene.
 * @param {CANNON.World} physicWorld - The physics world.
 * @param {THREE.Vector3} position  - The position in the world.
 */
function Dummy(scene, physicWorld, position) {

	this.lastProjectileId = undefined;
	this.drawGeometry = undefined;
	this.material = undefined;
	this.drawBody = undefined;

	var startSetup = {
		x: position.x,
		y: position.y,
		z: position.z,
		width: ((Math.random() * SIZE) ) + 1,
		height: ((Math.random() * SIZE) ) + 1,
		depth: ((Math.random() * SIZE) ) + 1,
		mass: 100,
	};

	_setupScene(this, scene, startSetup);
	_setupPhysicWorld(this, physicWorld, startSetup);

	this.id = this.drawBody.id;
	this.playerHit = false;

	var emotionTexture = TextureManager.get('emotion_normal');
	this.annie = new TextureAnimator( emotionTexture, 4, 1, 4, 175 );
	this.emotionSprite = new THREE.Sprite( new THREE.SpriteMaterial({
		map: emotionTexture,
		opacity: 0.7
	}));

	this.emotionSprite.position.set(startSetup.x,startSetup.y, startSetup.y);
	this.emotionSprite.scale.set(4, 4, 4);

	scene.add(this.emotionSprite);
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

Dummy.prototype = {

	/**
	 * One logical step of this entity.
	 *
	 * @public
	 * @emits death - When entity died.
 	 * @param {THREE.Scene} scene - The drawing world of THREE.
	 * @param {CANNON.World} physicWorld - The physic world of CANNON.
	 * @param {number} timeDelta - Time since last call.
	 * @returns {undefined}
	 */
	logic: function (scene, physicWorld, timeDelta) {

		if (this.physicBody.position.z < -50 || this.physicBody.position.z > 50) {
			Mouse.removeSceneBody(this.drawBody);
			scene.remove(this.drawBody);
			scene.remove(this.emotionSprite);
			physicWorld.remove(this.physicBody);
			this.emit('death', this);
		}

		if (!this.playerHit) {
			var moveX = Math.random() > 0.98;
			var moveY = Math.random() > 0.98;

			var jump = Math.random() > 0.999;

			if(moveX) {
				var dirX = Math.random() > 0.5 ? -1 : 1;
				this.physicBody.velocity.x += dirX * 3;
			}

			if(moveY) {
				var dirY = Math.random() > 0.5 ? -1 : 1;
				this.physicBody.velocity.y += dirY * 3;
			}

			if(jump) {
				this.physicBody.velocity.z += 5;
			}
		} else {
			this.physicBody.velocity.z += 0.5;
		}

		this.emotionSprite.position.copy(this.physicBody.position);
		this.emotionSprite.position.z += 3;

		this.drawBody.position.copy(this.physicBody.position);
		this.drawBody.quaternion.copy(this.physicBody.quaternion);

		this.annie.update(timeDelta);
	}
};

Emitter(Dummy.prototype);

module.exports = Dummy;

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
 * Setup entity into the drawing world of THREE.
 * 
 * @private 
 * @param {Dummy} self - The instance.
 * @param {THREE.Scene} scene - The drawing world of THREE.
 * @param {object} startSetup - Startup settings.
 * @returns {undefined}
 */
function _setupScene (self, scene, startSetup) {

	self.drawGeometry = new THREE.BoxGeometry(
		startSetup.width,
		startSetup.height,
		startSetup.depth);

	self.material = new THREE.MeshLambertMaterial( { color: 0xff5800 } );
	self.material.transparent = true;

	self.drawBody = new THREE.Mesh(self.drawGeometry, self.material );

	self.drawBody.castShadow = true;
	self.drawBody.receiveShadow = true;

	self.drawBody.position.x = startSetup.x;
	self.drawBody.position.y = startSetup.y;
	self.drawBody.position.z = startSetup.z;

	Mouse.addSceneBody(self.drawBody);

	scene.add(self.drawBody);
}

/**
 * Setup entity into the physical world of CANNON.
 * 
 * @private
 * @param {Dummy} self - The instance.
 * @param {CANNON.World} physicWorld - The physic world of CANNON.
 * @param {object} startSetup - Startup settings.
 * @returns {undefined}
 */
function _setupPhysicWorld (self, physicWorld, startSetup) {

	self.physicBody = new CANNON.Body({
		mass: startSetup.mass
	});

	self.physicShape = new CANNON.Box(new CANNON.Vec3(
		startSetup.width/2,
		startSetup.height/2,
		startSetup.depth/2));

	self.physicBody.addShape(self.physicShape);

	self.physicBody.position.set(
		startSetup.x,
		startSetup.y,
		startSetup.z);

	physicWorld.add(self.physicBody);

	self.physicBody.addEventListener('collide', function (e) {

		if (self.lastProjectileId !== e.body.id && Projectiles.isProjectile(e.body)) {
			self.lastProjectileId = e.body.id;
			EffectAudio.play('oh2', 0.4);
			_colorHit(self);
			self.playerHit = true;
			var emotionTexture = TextureManager.get('emotion_ohh');
			self.annie = new TextureAnimator( emotionTexture, 4, 1, 4, 175 );
			self.emotionSprite.material.map = emotionTexture;
		}
	});
}

/**
 * Set hit color.
 * 
 * @private
 * @param {Dummy} self - The instance.
 * @return {undefined}
 */
function _colorHit (self) {
	self.drawBody.material.color = new THREE.Color(COLOR_HIT);
	self.drawBody.material.opacity = 0.6;
}

}());
