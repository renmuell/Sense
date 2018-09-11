(function() {

/*global require, module, CANNON */

var ThreeSetup = require('../util/threeSetup');
var Player = require('./entities/player');
var World = require('./levels/world');
var Keyboard = require('../util/keyboard');
var Goal = require('./goal');
var Projectiles = require('./entities/projectiles');
var Stats = require('../../vendors_dev/stats-0.17.0/stats');
var BackgroundMusic = require('../util/backgroundMusic');
var Loader = require('../util/loader');

function Game () {
	var that = this;
	this.isRunning = false;
	this.lastFrameTime = undefined;

	Loader.on('loaded', function (){
		document.getElementById('intro').classList.remove('hide');
		document.getElementById('load').classList.add('hide');
	});

	Loader.load();

	this.threeSetup = new ThreeSetup();
	this.scene = this.threeSetup.scene;

	this.PhysicSetup();

	World.setup(this.scene, this.physicWorld);
	Player.Setup(this.scene, this.physicWorld);

	Keyboard.onKeydown(Keyboard.KeyCode.ESC, function(){
		that.PauseHandler();
	});

	Goal.setup(this.scene, this.physicWorld);
	Goal.on('finish', function() {
		that.endGame();
	});

	this.StatsSetup();
}

Game.prototype = {

	run: function (){
		if (!this.isRunning) {
			BackgroundMusic.play();
			this.isRunning = true;
			this.frame();
		}
	},

	endGame: function () {
		/*
		this.isRunning = false;
		this.threeSetup.clear();
		if (BackgroundMusic.hasStarted()) {
			BackgroundMusic.stop();
		}
		*/
	},

	frame: function  (){
		var timeDelta,
				that = this;

		this.stats.begin();

		try {
			if (this.isRunning) {

				timeDelta = Date.now() - (this.lastFrameTime || Date.now());
				this.lastFrameTime = Date.now();

				this.logic(timeDelta);

				this.physicWorld.step(timeDelta / 1000);
				this.applyPhysic();

				this.draw();

				window.requestAnimationFrame(function(){
					that.frame();
				});
			}
		} catch (e) {
			this.isRunning = false;
		}

		this.stats.end();
	},

	logic: function  (timeDelta) {
		Player.Logic(timeDelta);
		Projectiles.logic(this.scene, this.physicWorld);
		World.logic(timeDelta);
		Goal.logic(timeDelta, this.threeSetup.camera);
	},

	applyPhysic: function () {
		Player.ApplyPhysic();
	},

	draw: function  () {
		this.threeSetup.draw(Player.position);
	},

	PauseHandler: function () {
		//var that = this;

		if (this.isRunning) {
			/*
			$('.ft').removeClass('fa-close').addClass('fa-open').on('webkitAnimationEnd', function(){
				that.isRunning = false;
				that.threeSetup.clear();

				if (BackgroundMusic.hasStarted()) {
					BackgroundMusic.stop();
				}

				$(this).off('webkitAnimationEnd');
			});
			*/
		} else {
			this.lastFrameTime = undefined;
			this.isRunning = true;
			/*
			$('.ft').removeClass('fa-open').addClass('fa-close');
			if (BackgroundMusic.hasStarted()) {
				BackgroundMusic.play();
			}
			*/
			this.frame();
		}
	},

	PhysicSetup: function () {
		this.physicWorld = new CANNON.World();
		this.physicWorld.gravity.set(0,0,-23.82);
		this.physicWorld.broadphase = new CANNON.NaiveBroadphase();
	},

	StatsSetup: function () {
		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms

		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';

		document.body.appendChild(this.stats.domElement);
	}
};

module.exports = Game;

}());
