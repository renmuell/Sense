define([
	'three',
	'./../../util/hub',
	'./../../util/effectAudio',
	'cannon'
],function(
	THREE,
	Hub,
	EffectAudio,
	CANNON
){

	'use strict';

	var SIZE = 0.2;

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

		logic: function () {
			this.sceneBody.position.copy(this.physicBody.position);
			this.sceneBody.quaternion.copy(this.physicBody.quaternion);

	    if (this.physicBody.position.z < -50) {
	    	this.canKill = true;
	    }
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
			var	that = this,
					body = new CANNON.Body({ mass: this.config.mass }),
					shape = new CANNON.Box(new CANNON.Vec3( SIZE/2, SIZE/2, SIZE/2));

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
				var element = Hub.showText(that.sceneBody, 'Hit', '');
				setTimeout( function () {
					Hub.removeText(element);
				}, 200);
				//EffectAudio.play('hit', 0.2);
				that.canKill = true;
	    });

	    this.physicBody = body;
		},

		sceneSetup: function (scene) {
			var	geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE),
					material = new THREE.MeshLambertMaterial({ color: 0xBE371E }),
					body = new THREE.Mesh(geometry, material);

		  scene.add(body);

			body.position.set(
	  		this.config.position.x,
	  		this.config.position.y,
	  		this.config.position.z);

			this.sceneBody = body;
		}

	};

	return Projectile;

});