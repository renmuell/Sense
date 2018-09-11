(function() {

/*global require, module, THREE, CANNON */

var Hub = require('../../util/hub');
//var EffectAudio = require('../../util/effectAudio');

var SIZE = 0.2;

var KILL_OFFSET_MS = 3000;

/***
 *       _____                _                   _
 *      / ____|              | |                 | |
 *     | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __
 *     | |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
 *     | |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |
 *      \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|
 *
 */

function Projectile(config) {
	this.isCreated = false;
	this.timeTillKill = 0;
	this.freeze = false;
	this.canKill = false;

	/*
	{
		direction: vect3
		velocity: num
		position: vect3
		mass: num
	}
	*/
	this.config = config;
}

Projectile.prototype = {

	/***
	 *      _____       _     _ _
	 *     |  __ \     | |   | (_)
	 *     | |__) |   _| |__ | |_  ___
	 *     |  ___/ | | | '_ \| | |/ __|
	 *     | |   | |_| | |_) | | | (__
	 *     |_|    \__,_|_.__/|_|_|\___|
	 *
	 */

	create: function (scene, physicWorld) {
		this.isCreated = true;
		this._physicSetup(physicWorld);
		this.sceneSetup(scene);
	},

	logic: function (timeDelta) {
		
		if (this.freeze) {
			//this.physicBody.velocity.set(0,0,0);
			if (this.timeTillKill <= 0) {
				this.canKill = true;
			} else {
				this.timeTillKill -= timeDelta;
			}
		}// else {
			this.sceneBody.position.copy(this.physicBody.position);
			this.sceneBody.quaternion.copy(this.physicBody.quaternion);

			if (this.physicBody.position.z < -50) {
				this.canKill = true;
			}
		//}
	},

	getPhysicBodyId: function () {
		return this.physicBody.id;
	},

	kill: function (scene, physicWorld) {
		scene.remove(this.sceneBody);
		physicWorld.remove(this.physicBody);
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

	_physicSetup: function (physicWorld) {
		var	that 	= this,
			body 	= new CANNON.Body({ mass: this.config.mass }),
			shape 	= new CANNON.Box(new CANNON.Vec3( SIZE/2, SIZE/2, SIZE/2));

		body.addShape(shape);

		physicWorld.add(body);

		body.velocity.set(
			this.config.direction.x * this.config.velocity,
			this.config.direction.y * this.config.velocity, 
			this.config.direction.z * this.config.velocity);

		body.position.set(
			this.config.position.x,
			this.config.position.y,
			this.config.position.z);

		body.addEventListener('collide', function(){
			if (that.freeze == false) {
				var element = Hub.showText(that.sceneBody, 'Hit', '');
				setTimeout( function () {
					Hub.removeText(element);
				}, 200);
				//EffectAudio.play('hit', 0.01);
				//body.mass = 0;
				body.velocity.set(0,0,0); // if not set, projectiles jump around, very cool :)
				that.timeTillKill = KILL_OFFSET_MS;
				that.freeze = true;
			}
		});

		this.physicBody = body;
	},

	sceneSetup: function (scene) {
		var	geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE),
			material = new THREE.MeshLambertMaterial({ color: 0xDA4D5E }),
			body 	 = new THREE.Mesh(geometry, material);

		scene.add(body);

		body.position.set(
			this.config.position.x,
			this.config.position.y,
			this.config.position.z);

		this.sceneBody = body;
	}

};

module.exports = Projectile;

}());
