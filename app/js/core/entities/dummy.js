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

		// fast vendor copy:
		// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Texture-Animation.html
		function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
		{
		    // note: texture passed by reference, will be updated by the update function.

		    this.tilesHorizontal = tilesHoriz;
		    this.tilesVertical = tilesVert;

		    // how many images does this spritesheet contain?
		    //  usually equals tilesHoriz * tilesVert, but not necessarily,
		    //  if there at blank tiles at the bottom of the spritesheet.
		    this.numberOfTiles = numTiles;
		    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		    texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

		    // how long should each image be displayed?
		    this.tileDisplayDuration = tileDispDuration;

		    // how long has the current image been displayed?
		    this.currentDisplayTime = 0;

		    // which image is currently being displayed?
		    this.currentTile = 0;

		    this.update = function( milliSec )
		    {
		        this.currentDisplayTime += milliSec;
		        while (this.currentDisplayTime > this.tileDisplayDuration)
		        {
		            this.currentDisplayTime -= this.tileDisplayDuration;
		            this.currentTile++;
		            if (this.currentTile == this.numberOfTiles)
		                this.currentTile = 0;
		            var currentColumn = this.currentTile % this.tilesHorizontal;
		            texture.offset.x = currentColumn / this.tilesHorizontal;
		            var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
		            texture.offset.y = currentRow / this.tilesVertical;
		        }
		    };
		}

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

		var runnerTexture = THREE.ImageUtils.loadTexture('media/img/emotion/normal.png');
		this.annie = new TextureAnimator( runnerTexture, 3, 1, 3, 200 );
		this.emtionSprite = new THREE.Sprite( new THREE.SpriteMaterial({ map: runnerTexture, useScreenCoordinates: true, opacity: 0.7 }))

		this.emtionSprite.position.set(startSetup.x,startSetup.y, startSetup.y);
		this.emtionSprite.scale.set(4, 4, 4)

		scene.add(this.emtionSprite);

	/*
		var runnerTexture = new THREE.ImageUtils.loadTexture( 'media/img/emotion/normal.png' );
		// a texture with 10 frames arranged horizontally, display each for 75 millisec
		this.annie = new TextureAnimator( runnerTexture, 3, 1, 3, 250 );
		var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, transparent: true } );

		var runnerGeometry = new THREE.PlaneBufferGeometry(100, 100, 1, 1);
		this.runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
		this.runner.position.set(startSetup.x,startSetup.y, startSetup.y);
		this.runner.scale.set(0.02, 0.02, 0.02)

		scene.add(this.runner);
		*/
	}

	Dummy.prototype.logic = function (scene, physicWorld, timeDelta, camera) {
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