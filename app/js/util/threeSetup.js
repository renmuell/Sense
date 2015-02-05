define([
	'jquery',
	'three',
	'datGui',
	'./mouse',
	'./hub',
	'rendererstats',
	'objcoord'
],function(
	$,
	THREE,
	dat,
	Mouse,
	Hub
){

	'use strict';

	/**
	 *
	 */
	function ThreeSetup () {
			this.scene = new THREE.Scene();

			rendererSetup.call(this);
			//depthoffieldSetup.call(this);
			cameraSetup.call(this);
			lightSetup.call(this);
			//rendererStatsSetup.call(this);

			Mouse.init(this.scene, this.camera);
			Hub.init(this.camera, this.renderer);
	}

	ThreeSetup.prototype = {
		clear: function () {
			this.renderer.clear(true);
		},
		draw: function (playerPosition) {
			Mouse.logic();
			setCameraPosition.call(this, playerPosition);

			//this.rendererStats.update(this.renderer);

			//this.depthOfField.render(this.scene, this.camera)
			this.renderer.render(this.scene, this.camera);
		}
	}

	return ThreeSetup;

	function rendererSetup () {
			this.renderer = new THREE.WebGLRenderer({ antialias: true, devicePixelRatio : 1});
			this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
			this.renderer.setSize( window.innerWidth, window.innerHeight );

			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapSoft = true;

			var element = this.renderer.domElement;
			$(element).addClass('hide');
			$('#game').append(element);
	}

	function depthoffieldSetup () {
			this.depthOfField = new THREEx.DepthOfField(this.renderer)

			this.depthOfField.uniforms['focus'].value	= 1.15;
			this.depthOfField.uniforms['aperture'].value	= 0.009;
			this.depthOfField.uniforms['maxblur'].value	= 0.012;

			var gui = new dat.GUI()
			THREEx.depthOfFieldDatGui(this.depthOfField, gui);
	}

	function cameraSetup () {
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth/window.innerHeight,
			1,
			10000);
		/*
			this.cameraAngle = 0;
			this.orbitRange = 25;
			this.orbitSpeed = 2 * Math.PI/180;
			this.desiredAngle = 90 * Math.PI/180;

			this.camera.position.set(this.orbitRange,25,25);
			this.camera.lookAt(new THREE.Vector3(0,0,0));


		this.camera.useQuaternion = true;
			*/


		this.camera.position.x = 25;
		this.camera.position.y = -25;
		this.camera.position.z = 25;

		this.camera.lookAt(this.scene.position);
		this.camera.rotation.z = 0.6;

	}

	function lightSetup () {
		//this.ambientLight = new THREE.AmbientLight(0x333333);
		//this.scene.add(this.ambientLight);

		this.directionalLight = new THREE.DirectionalLight(0xffffff);
		this.directionalLight.position.set(-25, -25, 25);
		this.directionalLight.lookAt(this.scene.position);

		this.directionalLight.castShadow = true;
		this.directionalLight.shadowDarkness = 0.2;
		this.directionalLight.shadowCameraNear = 20;
		this.directionalLight.shadowCameraFar = 120;
		this.directionalLight.shadowCameraLeft = -40;
		this.directionalLight.shadowCameraRight = 40;
		this.directionalLight.shadowCameraTop = 40;
		this.directionalLight.shadowCameraBottom = -40;

		this.directionalLight.shadowMapWidth = 1000;
		this.directionalLight.shadowMapHeight = 1000;

		this.directionalLight.shadowCameraVisible = false;
		this.scene.add(this.directionalLight);

		this.scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1));

	}

	function rendererStatsSetup () {
			this.rendererStats = new THREEx.RendererStats()

			this.rendererStats.domElement.style.position = 'absolute'
			this.rendererStats.domElement.style.left = '0px'
			this.rendererStats.domElement.style.bottom   = '0px'
			document.body.appendChild( this.rendererStats.domElement )
	}

	function setCameraPosition (playerPosition) {
		/*
		if (this.cameraAngle == this.desiredAngle) { this.orbitSpeed = 0; }
		else {
			this.cameraAngle += Mouse.getYAxisOffset() * 0.01;
		  this.camera.position.x = (Math.cos(this.cameraAngle) * this.orbitRange) + playerPosition.x;
		  this.camera.position.y = (Math.sin(this.cameraAngle) * this.orbitRange) + playerPosition.y;
		  this.camera.position.z = playerPosition.z + 25;
		}
		this.camera.lookAt(playerPosition);
		this.camera.rotation.z = this.cameraAngle + Math.PI /2;
		/*
		this.constant += 0.01;
		this.camera.position.x = playerPosition.x + 25 * Math.cos( this.constant );
		this.camera.position.y = playerPosition.y + 25 * Math.sin( this.constant );
		this.camera.lookAt( playerPosition );
		this.camera.rotation.z = Math.cos( this.constant );
	*/

		this.camera.position.set(
			playerPosition.x + 25,
			playerPosition.y - 25,
			playerPosition.z + 25);

		this.camera.lookAt(playerPosition);
		this.camera.rotation.z = 0.6;
	}

});