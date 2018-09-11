(function() {

/*global require, module, THREE, CANNON */

var Emitter = require('../../util/emitter');
var TextureAnimator = require('../../../vendors_dev/textureAnimator/textureAnimator');
var Mouse = require('../../util/mouse');
var EffectAudio = require('../../util/effectAudio');
var TextureManager = require('../../util/textureManager');
var Projectiles = require('./projectiles');

var SIZE = 1,
	COLOR_HIT = 0xC3D1EC;

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

	this._setupScene(scene, startSetup);
	this._setupPhysicWorld(physicWorld, startSetup);

	this.id = this.drawBody.id;
	this.playerHit = false;


	var emotionTexture = TextureManager.get('emotion_normal');
	this.annie = new TextureAnimator( emotionTexture, 4, 1, 4, 175 );
	this.emtionSprite = new THREE.Sprite( new THREE.SpriteMaterial({
		map: emotionTexture,
		opacity: 0.7
	}));

	this.emtionSprite.position.set(startSetup.x,startSetup.y, startSetup.y);
	this.emtionSprite.scale.set(4, 4, 4);

	scene.add(this.emtionSprite);
}

Dummy.prototype = {

	/***
	 *      _____       _     _ _
	 *     |  __ \     | |   | (_)
	 *     | |__) |   _| |__ | |_  ___
	 *     |  ___/ | | | '_ \| | |/ __|
	 *     | |   | |_| | |_) | | | (__
	 *     |_|    \__,_|_.__/|_|_|\___|
	 *
	 */

	logic: function (scene, physicWorld, timeDelta) {
		if (this.physicBody.position.z < -50) {
			Mouse.removeSceneBody(this.drawBody);
			scene.remove(this.drawBody);
			scene.remove(this.emtionSprite);
			physicWorld.remove(this.physicBody);
			this.emit('death', this);
		}

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

		this.emtionSprite.position.copy(this.physicBody.position);
		this.emtionSprite.position.z += 3;

		this.drawBody.position.copy(this.physicBody.position);
		this.drawBody.quaternion.copy(this.physicBody.quaternion);

		this.annie.update(timeDelta);
	},

	/***
	 *      _____      _            _
	 *     |  __ \    (_)          | |
	 *     | |__) | __ ___   ____ _| |_ ___
	 *     |  ___/ '__| \ \ / / _` | __/ _ \
	 *     | |   | |  | |\ V / (_| | ||  __/
	 *     |_|   |_|  |_| \_/ \__,_|\__\___|
	 *
	 */

	_setupScene: function(scene, startSetup) {

		this.drawGeometry = new THREE.BoxGeometry(
			startSetup.width,
			startSetup.height,
			startSetup.depth);

		this.material = new THREE.MeshBasicMaterial( { color: 0xff5800 } );
		this.material.transparent = true;

		this.drawBody = new THREE.Mesh(this.drawGeometry, this.material );

		this.drawBody.castShadow = true;
		this.drawBody.receiveShadow = true;

		this.drawBody.position.x = startSetup.x;
		this.drawBody.position.y = startSetup.y;
		this.drawBody.position.z = startSetup.z;

		Mouse.addSceneBody(this.drawBody);

		scene.add(this.drawBody);
	},

	_setupPhysicWorld: function(physicWorld, startSetup) {
		var that = this;

		this.physicBody = new CANNON.Body({
			mass: startSetup.mass
		});

		this.physicShape = new CANNON.Box(new CANNON.Vec3(
			startSetup.width/2,
			startSetup.height/2,
			startSetup.depth/2));

		this.physicBody.addShape(this.physicShape);

		this.physicBody.position.set(
			startSetup.x,
			startSetup.y,
			startSetup.z);

		physicWorld.add(this.physicBody);

		this.physicBody.addEventListener('collide', function(e){

			if (that.lastProjectileId !== e.body.id && Projectiles.isProjectile(e.body) ) {
				that.lastProjectileId = e.body.id;
				EffectAudio.play('oh2', 0.4);
				that._colorRed(that);
				that.playerHit = true;
			}
		});
	},

	_colorRed: function() {
		this.drawBody.material.color = new THREE.Color( COLOR_HIT );
		this.drawBody.material.opacity = 0.6;
	}
};

Emitter(Dummy.prototype);

module.exports = Dummy;

}());
