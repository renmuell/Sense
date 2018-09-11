(function() {

/*global require, module, THREE */
//var dat = require('../../vendors_dev/dat-gui-js-0.7.2/dat.gui');
var Mouse = require('./mouse');
var Hub = require('./hub');

/**
 *
 */
function ThreeSetup () {
	this.scene = new THREE.Scene();

	this._rendererSetup();
	//this._depthoffieldSetup();
	this._cameraSetup();
	this._lightSetup();
	//this._rendererStatsSetup();

	Mouse.init(this.scene, this.camera);
	Hub.init(this.camera, this.renderer);
}

ThreeSetup.prototype = {
	clear: function () {
		this.renderer.clear(true);
	},
	draw: function (playerPosition) {
		Mouse.logic();
		this._setCameraPosition(playerPosition);

		//this.rendererStats.update(this.renderer);

		//this.depthOfField.render(this.scene, this.camera)
		this.renderer.render(this.scene, this.camera);
	},

	_rendererSetup: function() {
		//
		this.renderer = new THREE.WebGLRenderer({ antialias: false, devicePixelRatio : 1});
		this.renderer.setClearColor(new THREE.Color('white'));
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		var element = this.renderer.domElement;
		document.getElementById('game').appendChild(element);
	},

	/*
	_depthoffieldSetup: function () {
			this.depthOfField = new THREEx.DepthOfField(this.renderer)

			this.depthOfField.uniforms['focus'].value	= 1.15;
			this.depthOfField.uniforms['aperture'].value	= 0.009;
			this.depthOfField.uniforms['maxblur'].value	= 0.012;

			var gui = new dat.GUI()
			THREEx.depthOfFieldDatGui(this.depthOfField, gui);
	},
	*/

	_cameraSetup: function () {
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

		//this.camera.position.set(this.orbitRange,25,25);
		//this.camera.lookAt(new THREE.Vector3(0,0,0));

			
		this.camera.useQuaternion = true;
		*/
		this.constant = 0;

		this.camera.position.x = 25;
		this.camera.position.y = -25;
		this.camera.position.z = 25;

		this.camera.lookAt(this.scene.position);
		this.camera.rotation.z = 0.6;
	},

	_lightSetup: function() {
	
		//this.ambientLight = new THREE.AmbientLight(0x333333);
		//this.scene.add(this.ambientLight);

		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
		this.directionalLight.position.set(-25, -25, 25);
		this.directionalLight.lookAt(this.scene.position);

		this.directionalLight.castShadow = true;
		this.directionalLight.shadow.camera.near = 20;
		this.directionalLight.shadow.camera.far = 120;
		this.directionalLight.shadow.camera.left = -40;
		this.directionalLight.shadow.camera.right = 40;
		this.directionalLight.shadow.camera.top = 40;
		this.directionalLight.shadow.camera.bottom = -40;

		this.directionalLight.shadow.mapSize.width = 1000;
		this.directionalLight.shadow.mapSize.height = 1000;
		this.scene.add(this.directionalLight);

		//this.helper = new THREE.CameraHelper( this.directionalLight.shadow.camera )
		//this.scene.add(this.helper);

		//this.scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1));

	},

	/*
	_rendererStatsSetup: function () {
			this.rendererStats = new THREEx.RendererStats()

			this.rendererStats.domElement.style.position = 'absolute'
			this.rendererStats.domElement.style.left = '0px'
			this.rendererStats.domElement.style.bottom   = '0px'
			document.body.appendChild( this.rendererStats.domElement )
	},
	*/

	_setCameraPosition: function (playerPosition) {
		/*
		if (this.cameraAngle == this.desiredAngle) { this.orbitSpeed = 0; }
		else {
			this.cameraAngle += Mouse.getYAxisOffset() * 0.01;
			this.camera.position.x = (Math.cos(this.cameraAngle) * this.orbitRange) + playerPosition.x;
			this.camera.position.y = (Math.sin(this.cameraAngle) * this.orbitRange) + playerPosition.y;
			this.camera.position.z = playerPosition.z + 25;
		}
		this.camera.lookAt(new THREE.Vector3( playerPosition.x, playerPosition.y, playerPosition.z ));
		this.camera.rotation.z = this.cameraAngle + Math.PI /2;
		
		this.constant += 0.01;
		this.camera.position.x = playerPosition.x + 25 * Math.cos( this.constant );
		this.camera.position.y = playerPosition.y + 25 * Math.sin( this.constant );
		this.camera.lookAt( new THREE.Vector3( playerPosition.x, playerPosition.y, playerPosition.z ) );
		this.camera.rotation.z = Math.sin( this.constant );
		*/
		this.camera.position.set(
			playerPosition.x + 25,
			playerPosition.y - 25,
			playerPosition.z + 25);
		this.camera.lookAt(new THREE.Vector3( playerPosition.x, playerPosition.y, playerPosition.z ));
		this.camera.rotation.z = 0.6;
		
	}

};

module.exports = ThreeSetup;

}());
