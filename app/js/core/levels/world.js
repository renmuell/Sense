define([
	'three',
	'./../../util/mouse',
	'./../../util/backgroundMusic'
],function(
	THREE,
	Mouse,
	BackgroundMusic
){

	'use strict';

	var

	instance = null,
	SIZE = 10;

	function	World() {
		this.worldTiles = [];
		this.world = new THREE.Group();
	}

	World.prototype.setup = function (scene, physicWorld) {
		this.scene = scene;
		this.physicWorld = physicWorld;
		this.scene.add(this.world);
		/*
		var colors = [
			0x009e60,
			0x009e60,
			0x0051ba,
			0x0051ba,
			0xffd500,
			0xffd500,
			0xff5800,
			0xff5800,
			0xC41E3A
		];

		var colors = [
			0xFF7FCD,
			0xFF91C0,
			0xF9F8D9,
			0xD0CBAD,
			0x83D593,

			0xCBF7DA,

			0x664E41,
			0x9B8F85,
			0x80BBBC
		];
	*/
		createWorld.call(this, this.world, physicWorld);
	};

	World.prototype.logic = function () {
		//this.world.rotation.z += BackgroundMusic.boost/10000;

		for (var i = this.worldTiles.length - 1; i >= 0; i--) {
			var drawBody = this.worldTiles[i].drawBody;
			var physicBody = this.worldTiles[i].physicBody;

			if (this.worldTiles[i].actsToMusic) {
				var musicValue = 0;
				if (BackgroundMusic.byteFrequencyData.length > 0) {
					 musicValue = BackgroundMusic.byteFrequencyData[i * 3] / 256;
				}
				drawBody.position.z = -6.25 + (4 * musicValue);
			} else {
				drawBody.position.copy(physicBody.position);
				drawBody.quaternion.copy(physicBody.quaternion);
			}

			/*
			for (var m = drawBody.material.materials.length - 1; m >= 0; m--) {
				drawBody.material.materials[m].opacity = 1 -musicValue;
			};
			*/


		};
	};

	World.getInstance = function (){
		if (instance === null) {
			instance = new World();
		}
		return instance;
	};

	return World.getInstance();

	function createWorld (world, physicWorld) {
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				//if ((x === 0 && y === 0) || Math.random() > 0.2) {
					createTile.call(this, world, physicWorld, x, y);
				//}
			}
		}
	}

	function createTile (world, physicWorld, x, y) {
		var
		z = (-2.5 * (Math.random() * 2.5)),
		size = SIZE,
		tileSetup = {
			x: (x * size) - 25,
			y: (y * size) - 25,
			z: z,
			width: size,
			height: size,
			depth: SIZE,
			mass: 0,
			materialsColor :[
										0x148040,
					0x148040,
					0x5DB847,
					0x5DB847,
					0x92DB49,
					0x92DB49,


			]
		};

		var actsToMusic = (Math.random() > 0.5 && (x !== 0 || y !== 0));

		if (actsToMusic) {
			tileSetup.materialsColor = [
				0x7ECECA,
				0x7ECECA,
				0x693A5,
				0x693A5,
				0x45B5C4,
				0x45B5C4,
			];
		}

		var wolrdBody = createDrawTile.call(this, world, tileSetup, actsToMusic);

		this.worldTiles.push(
		{
			drawBody   : wolrdBody,
			actsToMusic : actsToMusic,
			position: new THREE.Vector3(tileSetup.x, tileSetup.y, tileSetup.z),
			physicBody : !actsToMusic ? createPhysicTile(physicWorld, tileSetup) : undefined,
		});

		Mouse.addSceneBody(wolrdBody);
	}

	function createDrawTile (world, tileSetup, actsToMusic) {
			var geometry = new THREE.BoxGeometry(
				tileSetup.width,
				tileSetup.height,
				tileSetup.depth );

			var materials = [];

			for (var index = 0, count = tileSetup.materialsColor.length - 1; count >= 0; index++, count--) {
				var m = new THREE.MeshBasicMaterial({ color: tileSetup.materialsColor[index] });
				m.transparent = true;
				if (actsToMusic) {
					m.opacity = 0.8;
				}
				materials.push(m);
			};

			this.material  = new THREE.MeshFaceMaterial( materials );
			this.material.transparent = true;

			var body = new THREE.Mesh( geometry, this.material  );

			body.position.x = tileSetup.x;
			body.position.y = tileSetup.y;
			body.position.z = actsToMusic ? 0 : tileSetup.z;

			body.receiveShadow = true;
			body.castShadow = true;

			world.add(body);

			return body;
	}

	function createPhysicTile (physicWorld, tileSetup) {
		var body = new CANNON.Body({
			mass: tileSetup.mass
		});

		var shape = new CANNON.Box(new CANNON.Vec3(
			tileSetup.width/2,
			tileSetup.height/2,
			tileSetup.depth/2));

		body.addShape(shape);

		body.position.set(
			tileSetup.x,
			tileSetup.y,
			tileSetup.z);

		physicWorld.add(body);

		return body;
	}

});