(function() {

/*global require, module */

var THREE = require('../../vendors_dev/threejs-0.96.0/three');

function Mouse() {
	this.collidableMeshList = [];
}

Mouse.prototype = {

	init: function(scene, camera) {
		this.camera = camera;
		this.scene = scene;
		this.sceneSetup(scene);
		document.addEventListener('mousemove',
			this._mousemoveHandler.bind(this));
		this.mouseX = window.innerWidth/2;
		this.mosueY = window.innerHeight/2;
	},

	addSceneBody: function (body) {
		this.collidableMeshList.push(body);
	},

	logic: function () {
		var vector, dir, distance, pos, ray, collisionResults;

		vector = new THREE.Vector3();

		vector.set(
			(this.mouseX/ window.innerWidth)*2-1,
			-(this.mosueY /window.innerHeight)*2+1,
			0.5);

		vector.unproject(this.camera);

		dir = vector.sub(this.camera.position).normalize();

		distance = -this.camera.position.z/dir.z;

		ray = new THREE.Raycaster(this.camera.position, dir.normalize());

		collisionResults = ray.intersectObjects(this.collidableMeshList);

		if (collisionResults.length > 0 && collisionResults[0].distance < distance) {
			pos = collisionResults[0].point.clone();
		} else {
			pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
		}

		this.sceneBody.position.x = pos.x;
		this.sceneBody.position.y = pos.y;
		this.sceneBody.position.z = pos.z;
	},

	removeSceneBody: function(body) {
		var pos;
		for (var index = 0, count = this.collidableMeshList.length - 1; count >= 0; count--, index++) {
			if (this.collidableMeshList[index].id === body.id){
				pos = index;
				break;
			}
		}

		if (pos) {
			this.collidableMeshList.splice(pos, 1);
		}
	},

	getDirectionTo: function (x, y, z) {
		return new THREE.Vector3(x, y, z).sub(this.sceneBody.position).multiplyScalar(-1).normalize();
	},

	sceneSetup: function (scene) {
		var
		geometry = new THREE.BoxGeometry( 1, 1, 1 ),
		material = new THREE.MeshPhongMaterial( { color: 0x2E2633} ),
		body = new THREE.Mesh( geometry, material );

		scene.add(body);
		this.sceneBody = body;
	},

	_mousemoveHandler: function (event) {
		this.mouseX = event.clientX;
		this.mosueY = event.clientY;
	}
};

module.exports = new Mouse();

}());
