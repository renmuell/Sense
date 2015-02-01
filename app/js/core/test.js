define(function (require) {
	'use strict';

	var

	THREE  				= require('three'),
	_ 		 			 	= require('underscore'),
	CANNON 		 		= require('cannon'),
	Stats 		  	= require('stats'),
	dat 		  		= require('datGui'),
	emitter 		  = require('emitter'),
	$ 		  			= require('jquery');

	require('objcoord');
	require('rendererstats');

	return {
		run : function () {
		console.log(THREE);
		console.log(_);
		console.log(CANNON);
		console.log(Stats);
		console.log(dat);
		console.log(emitter);
		console.log($);
		}
	};
});