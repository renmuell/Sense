define([
	'three',
	'objcoord'
],function(
	THREE
) {

	'use strict';

	var
	instance = null;

	function	Hub() {
	}

	Hub.prototype.init = function (camera, renderer) {
		this.camera = camera;
		this.renderer = renderer;
	};

	Hub.prototype.removeText = function (element) {
		document.body.removeChild(element);
	};

	Hub.prototype.showText = function (sceneeBody, text, cssClass) {
		var div, position;

		var element = document.createElement('div');

		element.innerHTML   = text;
		element.style.position  = 'absolute';
		element.className = "message " + cssClass;

		var position  	= THREEx.ObjCoord.cssPosition(sceneeBody, this.camera, this.renderer);
		element.style.left  = (position.x-element.offsetWidth /2) +'px';
		element.style.top   = (position.y-element.offsetHeight/2) - 50 +'px';
		document.body.appendChild(element);
		return element;
	}

	Hub.getInstance = function () {
		if (instance === null) {
			instance = new Hub();
		}
		return instance;
	}

	return Hub.getInstance();

});