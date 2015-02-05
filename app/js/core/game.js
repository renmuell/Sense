define([
	'./../util/ThreeSetup',
	'./entities/player',
	'./levels/world',
	'./../util/keyboard',
	'./goal',
	'./entities/projectiles',
	'cannon',
	'stats',
	'./../util/backgroundMusic',
	'./../util/loader'
],function(
	ThreeSetup,
	Player,
	World,
	Keyboard,
	Goal,
	Projectiles,
	CANNON,
	Stats,
	BackgroundMusic,
	Loader
){

	'use strict';

	/**
	 *
	 */
	function Game () {
		this.isRunning = false;
		this.lastFrameTime;

		Loader.on('loaded', function (){
			$('#intro').show();
			$('#load').hide();
		});

		Loader.load();

		this.threeSetup = new ThreeSetup();
		this.scene = this.threeSetup.scene;

		PhysicSetup.call(this);

		World.setup(this.scene, this.physicWorld);
		Player.Setup(this.scene, this.physicWorld);

		Keyboard.onKeydown(Keyboard.KeyCode.ESC, PauseHandler.bind(this));

		Goal.setup(this.scene, this.physicWorld);
		Goal.on('finish', endGame.bind(this));

		StatsSetup.call(this);
	}

	Game.prototype.run = function (){
		if (!this.isRunning) {
			BackgroundMusic.play();
			this.isRunning = true;
			frame.call(this);
		}
	}

	return Game;

	function endGame () {
		/*
		this.isRunning = false;
		this.threeSetup.clear();
		if (BackgroundMusic.hasStarted()) {
			BackgroundMusic.stop();
		}
		*/
	}

	/**
	 *
	 */
	function frame (timestamp){
		var timeDelta;
		this.stats.begin();
		try {
			if (this.isRunning) {

				timeDelta = Date.now() - (this.lastFrameTime || Date.now());
				this.lastFrameTime = Date.now();

				logic.call(this, timeDelta);

				this.physicWorld.step(timeDelta / 1000);
				applyPhysic.call(this);

				draw.call(this);

				window.requestAnimationFrame(frame.bind(this));
			}
		} catch (e) {
			this.isRunning = false;
			console.log(e);
		}
		this.stats.end();
	}

	/**
	 *
	 */
	function logic (timeDelta) {
		Player.Logic(timeDelta);
		Projectiles.logic(this.scene, this.physicWorld);
		World.logic(timeDelta);
		Goal.logic();
	}

	function applyPhysic () {
		Player.ApplyPhysic();
	}

	/**
	 *
	 */
	function draw () {
		this.threeSetup.draw(Player.position);
	}

	function PauseHandler() {
		var that = this;
		if (this.isRunning) {
			$('.ft').removeClass('fa-close').addClass('fa-open').on('webkitAnimationEnd', function(){
				that.isRunning = false;
				that.threeSetup.clear();
				if (BackgroundMusic.hasStarted()) {
					BackgroundMusic.stop();
				}
				$(this).off('webkitAnimationEnd');
			});
		} else {
			this.lastFrameTime = undefined;
			this.isRunning = true;
			$('.ft').removeClass('fa-open').addClass('fa-close');
			if (BackgroundMusic.hasStarted()) {
				BackgroundMusic.play();
			}

			frame.call(this);
		}
	}

	function PhysicSetup () {
		this.physicWorld = new CANNON.World();
		this.physicWorld.gravity.set(0,0,-23.82);
		this.physicWorld.broadphase = new CANNON.NaiveBroadphase();
	}

	function StatsSetup () {
		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms

		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';

		document.body.appendChild( this.stats.domElement );
	}

});