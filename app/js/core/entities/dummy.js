define([
	'three',
	'emitter',
	'./../../util/mouse',
	'./../../util/effectAudio',
	'./projectiles'
],function(
	THREE,
	Emitter,
	Mouse,
	EffectAudio,
	Projectiles
){

	'use strict';

	var
	SIZE = 1,
	COLOR_HIT = 0xC3D1EC;

	function	Dummy(scene, physicWorld, position) {
		var objSize = 4;
		var startSetup = {
			x: position.x,
			y: position.y,
			z: position.z,
			width: ((Math.random() * SIZE) )+ 1,
			height: ((Math.random() * SIZE) )+1,
			depth: ((Math.random() * SIZE) )+1,
			mass: 100,
		};

		setupScene.call(this, scene, startSetup);
		setupPhysicWorld.call(this, physicWorld, startSetup);

		this.id = this.drawBody.id;
		this.playerHit = false;
		this.lastProjectileId;
	}

	Dummy.prototype.logic = function (scene, physicWorld) {
		if (this.physicBody.position.z < -50) {
			Mouse.removeSceneBody(this.drawBody);
			scene.remove(this.drawBody);
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

		this.drawBody.position.copy(this.physicBody.position);
		this.drawBody.quaternion.copy(this.physicBody.quaternion);
	}

	Emitter(Dummy.prototype);

	return Dummy;

	function setupScene (scene, startSetup) {
		this.drawGeometry = new THREE.BoxGeometry(
			startSetup.width,
			startSetup.height,
			startSetup.depth);

		this.material  = new THREE.MeshBasicMaterial( { color: 0xff5800 } );
		this.material.transparent = true;

		this.drawBody = new THREE.Mesh( this.drawGeometry, this.material );

		this.drawBody.castShadow = true;
		this.drawBody.receiveShadow = true;

		this.drawBody.position.x = startSetup.x;
		this.drawBody.position.y = startSetup.y;
		this.drawBody.position.z = startSetup.z;

		Mouse.addSceneBody(this.drawBody);

		scene.add(this.drawBody);
	}

	function setupPhysicWorld (physicWorld, startSetup) {
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

		this.physicBody.addEventListener("collide",function(e){

			if (this.lastProjectileId !== e.body.id && Projectiles.isProjectile(e.body) ) {
				this.lastProjectileId = e.body.id;
				EffectAudio.play('oh2', 0.4);
				colorRed.call(that);
				that.playerHit = true;
			}

		});

		function colorRed () {
			this.drawBody.material.color = new THREE.Color( COLOR_HIT );
			this.drawBody.material.opacity = 0.6;
		}
	}

});