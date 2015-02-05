define([
	'jquery',
	'three',
	'./../../util/keyboard',
	'./../weapons/smg',
	'./../enum/dir',
	'./../levels/world',
	'./../../util/hub',
	'./../../util/effectAudio'
],function(
	$,
	THREE,
	Keyboard,
	SMG,
	DIR,
	World,
	Hub,
	EffectAudio
){

	'use strict';

	var

	instance = null,

	MAX_VELOCITY  = 7,
	SIZE 					= 1,
	START_OPACITY = 0.7,

	RESPAWN_TIME = 1000,
	GREETING_OFFSET_TIME = 1500,
	GREETING_REMOVE_TIME = 2000,
	WALKING_TIME = 400,

	GREETING_TEXT = 'Hi',
	RELOADING_TEXT = 'Reloading',

	COLOR_RELOAD = 0xDA4D5E,
	COLOR_SHOOT  = 0xDA4D5E,
	COLOR_NORMAL = 0xDA4D5E,
	COLOR_COLIDE = 0xDA4D5E,

	START_SETUP = {
		width: 	SIZE,
		height: SIZE,
		depth: 	SIZE,
		x: 			-25,
		y: 			-25,
		z:      6,
		mass:   100,
		numSegments: 1,
		color: COLOR_NORMAL
	};

	/* --------------------------------------------------------------------------
	/* Prototype
	/* ----------------------------------------------------------------------- */

	function Player(scene, physicWorld) {
		Init.call(this);
	}

	Player.prototype.Setup = function (scene, physicWorld){
		this.scene = scene;
		this.physicWorld = physicWorld;

		SetupWeapon.call(this,scene, physicWorld);
		SetupScene.call(this, scene);
		SetupPhysicWorld.call(this, physicWorld);
	};

	Player.prototype.Logic = function (timeDelta) {
		if (!this.isAlive) {
			return;
		}

		if (this.skipFirstFrame) {
			this.skipFirstFrame = false;
			return;
		}

		CheckIsOnGround.call(this);
		CheckGreeting.call(this);
		//ScaleBodyToNormal.call(this);
		CheckDeath.call(this);
		SetVelocity.call(this);
		SetWalkingTime.call(this, timeDelta);

		this.weapon.logic(timeDelta, this.physicBody.position);
	};

	Player.prototype.ApplyPhysic = function () {
		this.drawBody.position.copy(this.physicBody.position);
		this.drawBody.quaternion.copy(this.physicBody.quaternion);
	};

	Player.getInstance = function () {
		if (instance === null) {
			instance = new Player();
		}
		return instance;
	};

	return Player.getInstance();

	/* --------------------------------------------------------------------------
	/* Private
	/* ----------------------------------------------------------------------- */

	function Init() {
		this.isAlive = true;
		this.isOnGround = false;
		this.sayHello = true;
		this.lastColidedObject;
		this.walkSoundTime = WALKING_TIME;
		this.currentWalkSoundTime = this.walkSoundTime;
		this.skipFirstFrame = true;
		this.text;
	}

	/* --------------------------------------------------------------------------
	/* Life
	/* ----------------------------------------------------------------------- */

	function KillHimself () {
		EffectAudio.play('death');
		this.isAlive = false;
		this.scene.remove(this.drawBody);
		this.physicWorld.remove(this.physicWorld);
		setTimeout(Respawn.bind(this), RESPAWN_TIME);
	}

	function Respawn () {
		Init.call(this)
		this.Setup(this.scene, this.physicWorld);
	}

	function CheckGreeting () {
		if (this.sayHello) {
			this.sayHello = false;
			setTimeout(CheckGreeting_Offset.bind(this), GREETING_OFFSET_TIME);
		}
	}

	function CheckGreeting_Offset () {
		EffectAudio.play('hello', 0.5);
		var element = Hub.showText(this.drawBody, GREETING_TEXT, '');
		setTimeout( CheckGreeting_RemoveText.bind(element), GREETING_REMOVE_TIME);
		$('#intro').addClass('noCursor');
	}

	function CheckGreeting_RemoveText () {
		Hub.removeText(this);
	}

	function CheckDeath () {
		if (this.isAlive && this.position.z < - 50 ) {
			KillHimself.call(this);
		}
	}

	function SetWalkingTime (timeDelta) {
		if (this.currentWalkSoundTime < this.walkSoundTime) {
			this.currentWalkSoundTime += timeDelta;
		}
	}

	/* --------------------------------------------------------------------------
	/* Physic
	/* ----------------------------------------------------------------------- */

	function CheckIsOnGround () {
		this.isOnGround = false;
		if (this.lastColidedObject && Math.pow(this.physicBody.velocity.z, 2) < 8) {
			var dz = this.lastColidedObject.position.z - this.physicBody.position.z;
			if (Math.pow(dz, 2) < Math.pow(7, 2)) {
				this.isOnGround = true;
			}
		}
	}

	function SetVelocity () {
		var velocityAdd = 1;

		if (Keyboard.dirPressed(DIR.FRONT)) {
			this.physicBody.velocity.x -= velocityAdd;
			this.physicBody.velocity.y += velocityAdd;
		}
		if (Keyboard.dirPressed(DIR.BACK)) {
			this.physicBody.velocity.x += velocityAdd;
			this.physicBody.velocity.y -= velocityAdd;
		}
		if (Keyboard.dirPressed(DIR.LEFT)) {
			this.physicBody.velocity.x -= velocityAdd;
			this.physicBody.velocity.y -= velocityAdd;
		}
		if (Keyboard.dirPressed(DIR.RIGHT)) {
			this.physicBody.velocity.x += velocityAdd;
			this.physicBody.velocity.y += velocityAdd;
		}
		if (Keyboard.keySpacePressed && this.isOnGround){
			EffectAudio.play('jump');
			this.physicBody.velocity.z = 15;
		}

		AdjustVelocity.call(this);
	}

	function AdjustVelocity () {
		if (this.physicBody.velocity.x > MAX_VELOCITY) {
			this.physicBody.velocity.x = MAX_VELOCITY;
		}
		if (this.physicBody.velocity.y > MAX_VELOCITY) {
			this.physicBody.velocity.y = MAX_VELOCITY;
		}
		if (this.physicBody.velocity.x < -MAX_VELOCITY) {
			this.physicBody.velocity.x = -MAX_VELOCITY;
		}
		if (this.physicBody.velocity.y < -MAX_VELOCITY) {
			this.physicBody.velocity.y = -MAX_VELOCITY;
		}
	}

	function ScaleBodyToNormal (){
		if (this.drawBody.scale.x < 1) {
			if (this.drawBody.material.color.r === new THREE.Color(COLOR_NORMAL).r) {
				this.drawBody.material.color = new THREE.Color(COLOR_COLIDE);
			}

			BodyScale.call(this, 1.01);

			if (this.drawBody.scale.x >= 1) {
				ScaleToNormal.call(this);
			}
		}
	}

	function ScaleBody (scale) {
		this.drawBody.scale.multiplyScalar(scale);
		this.physicBody.shapes[0].halfExtents.x *= scale;
 		this.physicBody.shapes[0].halfExtents.z *= scale;
		this.physicBody.shapes[0].halfExtents.y *= scale;

		//this.physicBody.mass *= scale;
		//this.drawBody.material.opacity *= 1.5;
	}

	function ScaleToNormal () {
		//this.drawBody.material.opacity = START_OPACITY;
		this.drawBody.material.color = new THREE.Color(COLOR_NORMAL);
		this.drawBody.scale.x = 1;
		this.drawBody.scale.y = 1;
		this.drawBody.scale.z = 1;

		this.physicBody.shapes[0].halfExtents.x = SIZE/2;
 		this.physicBody.shapes[0].halfExtents.z = SIZE/2;
		this.physicBody.shapes[0].halfExtents.y = SIZE/2;

		//this.physicBody.mass = 10;
	}

	/* --------------------------------------------------------------------------
	/* SETUP
	/* ----------------------------------------------------------------------- */

	function SetupScene (scene) {
		this.drawGeometry = new THREE.BoxGeometry(
			START_SETUP.width,
			START_SETUP.height,
			START_SETUP.depth);

		this.drawMaterial = new THREE.MeshBasicMaterial( { color: START_SETUP.color } );

		//this.drawMaterial.opacity = START_OPACITY;

		this.drawBody = new THREE.Mesh( this.drawGeometry, this.drawMaterial );

		this.drawBody.castShadow = true;
		this.drawBody.receiveShadow = true;

		this.drawBody.position.x = START_SETUP.x;
		this.drawBody.position.y = START_SETUP.y;
		this.drawBody.position.z = START_SETUP.z;

		scene.add(this.drawBody);
	}

	function SetupPhysicWorld (physicWorld) {

		this.physicBody = new CANNON.Body({
		   mass: START_SETUP.mass
		});

		this.physicShape = new CANNON.Box(new CANNON.Vec3(
			START_SETUP.width/2,
			START_SETUP.height/2,
			START_SETUP.depth/2));

		this.physicBody.addShape(this.physicShape);

		this.physicBody.position.set(
			START_SETUP.x,
			START_SETUP.y,
			START_SETUP.z);

		this.position = this.physicBody.position;

		physicWorld.add(this.physicBody);

		this.physicBody.addEventListener("collide", Collide_Handler.bind(this));
	}

	function Collide_Handler (event) {
		if (this.currentWalkSoundTime >= this.walkSoundTime
			&& (Math.pow(this.physicBody.velocity.x, 2) > 2
				|| Math.pow(this.physicBody.velocity.y, 2) > 2
				|| Math.pow(this.physicBody.velocity.z, 2) > 2)) {

			EffectAudio.play('colide', 0.5);

			if (this.physicBody.velocity.z <= -10) {
				if (this.drawBody.scale.x == 1) {
					//ScaleBody.call(this, 0.7)
				}
			}

			this.currentWalkSoundTime = 0;
		}

	 	var upAxis = new CANNON.Vec3(0,0,1);
    var contact = event.contact;
    var contactNormal = new CANNON.Vec3();
    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    if(contact.bi.id == this.physicBody.id)  // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal);
    else
        contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
        this.lastColidedObject = event.body;
	}

	function SetupWeapon (scene, physicWorld) {
		this.weapon = new SMG(scene, physicWorld);
		this.weapon.on('fire', FireCallback_Hanlder.bind(this));
		this.weapon.on('reloadStart', ReloadStartCallback_Hanlder.bind(this));
		this.weapon.on('reloadEnd', ReloadEndCallback_Hanlder.bind(this));

		window.addEventListener("mousedown", MouseDown_Handler.bind(this));
		window.addEventListener("mouseup", MouseUp_Handler.bind(this));
	}

	/* --------------------------------------------------------------------------
	/* Callback
	/* ----------------------------------------------------------------------- */

	function MouseDown_Handler () {
		this.weapon.pullTrigger();
		if (!this.weapon.isReloading) {
			this.drawBody.material.color = new THREE.Color(COLOR_SHOOT);
		}
	}

	function MouseUp_Handler () {
		this.weapon.releaseTrigger();
		if (!this.weapon.isReloading) {
			this.drawBody.material.color = new THREE.Color(COLOR_NORMAL);
		}
	}

	function FireCallback_Hanlder (event) {
		//ScaleBody.call(this, 0.9);

		this.physicBody.velocity.x -= event.recoilFeedback.x;
		this.physicBody.velocity.y -= event.recoilFeedback.y;
		//this.physicBody.velocity.z -= event.recoilFeedback.z;
	}

	function ReloadStartCallback_Hanlder () {
		EffectAudio.play('reload');
		this.text = Hub.showText(this.drawBody, RELOADING_TEXT, '');
		this.drawBody.material.color = new THREE.Color( COLOR_RELOAD );
	}

	function ReloadEndCallback_Hanlder () {
		if (this.text) {
			Hub.removeText(this.text);
		}

		this.drawBody.material.color = new THREE.Color( COLOR_NORMAL );
	}

});