(function() {

/*global require, module, AudioContext, THREEx */

var dat = require('../../vendors_dev/dat-gui-js-0.7.2/dat.gui');	

function Hub() {
	//this.settings = new dat.GUI();
}

Hub.prototype = {

	init : function (camera, renderer) {
		this.camera = camera;
		this.renderer = renderer;
	},

	removeText : function (element) {
		document.body.removeChild(element);
	},

	showText : function (sceneeBody, text, cssClass) {
		var position;

		var element = document.createElement('div');

		element.innerHTML   = text;
		element.style.position  = 'absolute';
		element.className = 'message ' + cssClass;

		position = THREEx.ObjCoord.cssPosition(sceneeBody, this.camera, this.renderer);

		element.style.left  = (position.x-element.offsetWidth /2) +'px';
		element.style.top   = (position.y-element.offsetHeight/2) - 50 +'px';
		document.body.appendChild(element);
		return element;
	}
};

module.exports = new Hub();

}());
