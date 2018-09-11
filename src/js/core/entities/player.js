(function() {

/*global require, module, THREE, CANNON */

var Keyboard = require('../../util/keyboard');
var SMG = require('../weapons/smg');
var DIR = require('../enum/dir');
var Hub = require('../../util/hub');
var EffectAudio = require('../../util/effectAudio');

var	MAX_VELOCITY  = 7,
	SIZE 		  = 1,
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

/***
 *       _____                _                   _
 *      / ____|              | |                 | |
 *     | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __
 *     | |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
 *     | |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |
 *      \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|
 *
 */

function Player() {
	this._Init();
}

Player.prototype = {

	/***
	 *      _____       _     _ _
	 *     |  __ \     | |   | (_)
	 *     | |__) |   _| |__ | |_  ___
	 *     |  ___/ | | | '_ \| | |/ __|
	 *     | |   | |_| | |_) | | | (__
	 *     |_|    \__,_|_.__/|_|_|\___|
	 *
	 */

	Setup: function (scene, physicWorld){
		this.scene = scene;
		this.physicWorld = physicWorld;

		this._SetupWeapon(scene, physicWorld);
		this._SetupScene(scene);
		this._SetupPhysicWorld(physicWorld);
	},

	Logic: function (timeDelta) {
		if (!this.isAlive) {
			return;
		}

		if (this.skipFirstFrame) {
			this.skipFirstFrame = false;
			return;
		}

		this._CheckIsOnGround();
		this._CheckGreeting();
		this._ScaleBodyToNormal();
		this._CheckDeath();
		this._SetVelocity();
		this._SetWalkingTime(timeDelta);

		this.weapon.logic(timeDelta, this.physicBody.position);
	},

	ApplyPhysic: function () {
		this.drawBody.position.copy(this.physicBody.position);
		this.drawBody.quaternion.copy(this.physicBody.quaternion);
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

	_Init: function () {
		this.isAlive = true;
		this.isOnGround = false;
		this.sayHello = true;
		this.lastColidedObject = undefined;
		this.walkSoundTime = WALKING_TIME;
		this.currentWalkSoundTime = this.walkSoundTime;
		this.skipFirstFrame = true;
		this.text = undefined;
	},

	/* --------------------------------------------------------------------------
	/* Life
	/* ----------------------------------------------------------------------- */

	_KillHimself: function() {
		var that = this;
		EffectAudio.play('death');
		this.isAlive = false;
		this.scene.remove(this.drawBody);
		this.physicWorld.remove(this.physicWorld);
		setTimeout(function () {
			that._Respawn();
		}, RESPAWN_TIME);
	},

	_Respawn: function() {
		this._Init();
		this.Setup(this.scene, this.physicWorld);
	},

	_CheckGreeting: function () {
		var that = this;
		if (this.sayHello) {
			this.sayHello = false;
			setTimeout(function() {
				that._CheckGreetingOffset();
			}, GREETING_OFFSET_TIME);
		}
	},

	_CheckGreetingOffset: function() {
		EffectAudio.play('hello', 0.5);
		var element = Hub.showText(this.drawBody, GREETING_TEXT, '');
		setTimeout( function () {
			Hub.removeText(element);
		}, GREETING_REMOVE_TIME);
		document.getElementById('intro').classList.add('noCursor');
	},

	_CheckDeath: function() {
		if (this.isAlive && this.position.z < - 50 ) {
			this._KillHimself();
		}
	},

	_SetWalkingTime: function (timeDelta) {
		if (this.currentWalkSoundTime < this.walkSoundTime) {
			this.currentWalkSoundTime += timeDelta;
		}
	},

	/* --------------------------------------------------------------------------
	/* Physic
	/* ----------------------------------------------------------------------- */

	_CheckIsOnGround: function () {
		this.isOnGround = false;
		if (this.lastColidedObject && Math.pow(this.physicBody.velocity.z, 2) < 8) {
			var dz = this.lastColidedObject.position.z - this.physicBody.position.z;
			if (Math.pow(dz, 2) < Math.pow(7, 2)) {
				this.isOnGround = true;
			}
		}
	},

	_SetVelocity: function() {
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

		this._AdjustVelocity();
	},

	_AdjustVelocity: function () {
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
	},

	_ScaleBodyToNormal: function (){
		if (this.drawBody.scale.x < 1) {
			if (this.drawBody.material.color.r === new THREE.Color(COLOR_NORMAL).r) {
				this.drawBody.material.color = new THREE.Color(COLOR_COLIDE);
			}

			this._ScaleBody(1.01);

			if (this.drawBody.scale.x >= 1) {
				this._ScaleToNormal();
			}
		}
	},
	
	_ScaleBody: function (scale) {
		this.drawBody.scale.multiplyScalar(scale);
		this.physicBody.shapes[0].halfExtents.x *= scale;
		this.physicBody.shapes[0].halfExtents.z *= scale;
		this.physicBody.shapes[0].halfExtents.y *= scale;

		//this.physicBody.mass *= scale;
		this.drawBody.material.opacity *= 1.5;
	},

	_ScaleToNormal: function () {
		this.drawBody.material.opacity = START_OPACITY;
		this.drawBody.material.color = new THREE.Color(COLOR_NORMAL);
		this.drawBody.scale.x = 1;
		this.drawBody.scale.y = 1;
		this.drawBody.scale.z = 1;

		this.physicBody.shapes[0].halfExtents.x = SIZE/2;
		this.physicBody.shapes[0].halfExtents.z = SIZE/2;
		this.physicBody.shapes[0].halfExtents.y = SIZE/2;

		//this.physicBody.mass = 10;
	},

	/* --------------------------------------------------------------------------
	/* SETUP
	/* ----------------------------------------------------------------------- */

	_SetupScene: function (scene) {
		this.drawGeometry = new THREE.BoxGeometry(
			START_SETUP.width,
			START_SETUP.height,
			START_SETUP.depth);

		this.drawMaterial = new THREE.MeshLambertMaterial( { color: START_SETUP.color } );

		this.drawMaterial.opacity = START_OPACITY;

		this.drawBody = new THREE.Mesh( this.drawGeometry, this.drawMaterial );

		this.drawBody.castShadow = true;
		this.drawBody.receiveShadow = true;

		this.drawBody.position.x = START_SETUP.x;
		this.drawBody.position.y = START_SETUP.y;
		this.drawBody.position.z = START_SETUP.z;

		scene.add(this.drawBody);
	},

	_SetupPhysicWorld: function (physicWorld) {
		var that = this;

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

		this.physicBody.addEventListener('collide', function(event) {
			that._CollideHandler(event);
		});
	},

	_CollideHandler: function (event) {
		if (this.currentWalkSoundTime >= this.walkSoundTime && (Math.pow(this.physicBody.velocity.x, 2) > 2 || Math.pow(this.physicBody.velocity.y, 2) > 2 || Math.pow(this.physicBody.velocity.z, 2) > 2)) {

			EffectAudio.play('colide', 0.5);

			if (this.physicBody.velocity.z <= -10) {
				if (this.drawBody.scale.x === 1) {
					this._ScaleBody(0.7)
				}
			}

			this.currentWalkSoundTime = 0;
		}

		var upAxis = new CANNON.Vec3(0,0,1);
		var contact = event.contact;
		var contactNormal = new CANNON.Vec3();
		// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
		// We do not yet know which one is which! Let's check.
		if(contact.bi.id === this.physicBody.id)  // bi is the player body, flip the contact normal
		{
			contact.ni.negate(contactNormal);
		}
		else
		{
			contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
		}

		// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
		if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
		{
			this.lastColidedObject = event.body;
		}
	},

	_SetupWeapon: function (scene, physicWorld) {
		var that = this;
		this.weapon = new SMG(scene, physicWorld);
		this.weapon.on('fire', function (event) { that._FireCallbackHanlder(event); });
		this.weapon.on('reloadStart', function() { that._ReloadStartCallbackHanlder(); });
		this.weapon.on('reloadEnd', function() { that._ReloadEndCallbackHanlder(); });

		window.addEventListener('mousedown', function(event) { that._MouseDownHandler(event); });
		window.addEventListener('mouseup', function(event) { that._MouseUpHandler(event); });
	},

	/* --------------------------------------------------------------------------
	/* Callback
	/* ----------------------------------------------------------------------- */

	_MouseDownHandler: function (event) {
		if (event.which === 1) {
			this.weapon.pullTrigger();
			if (!this.weapon.isReloading) {
				this.drawBody.material.color = new THREE.Color(COLOR_SHOOT);
			}
		}
	},

	_MouseUpHandler: function (event) {
		if (event.which === 1) {
			this.weapon.releaseTrigger();
			if (!this.weapon.isReloading) {
				this.drawBody.material.color = new THREE.Color(COLOR_NORMAL);
			}
		}
	},

	_FireCallbackHanlder: function (event) {
		this._ScaleBody(0.9);

		this.physicBody.velocity.x -= event.recoilFeedback.x;
		this.physicBody.velocity.y -= event.recoilFeedback.y;
		//this.physicBody.velocity.z -= event.recoilFeedback.z;
	},

	_ReloadStartCallbackHanlder: function () {
		EffectAudio.play('reload');
		this.text = Hub.showText(this.drawBody, RELOADING_TEXT, '');
		this.drawBody.material.color = new THREE.Color( COLOR_RELOAD );
	},

	_ReloadEndCallbackHanlder: function () {
		if (this.text) {
			Hub.removeText(this.text);
		}

		this.drawBody.material.color = new THREE.Color( COLOR_NORMAL );
	}

};

module.exports = new Player();

}());
