require.config({
  paths: {
    three: '../vendors/threejs-r70/three.min',
    underscore: '../vendors/underscore-1.7.0/underscore-min',
    cannon: '../vendors/cannon-js-0.6.1/cannon.min',
    stats: '../vendors/stats-r12/stats.min',
    rendererstats: '../vendors/threex/rendererstats/threex.rendererstats',
    datGui : '../vendors/dat-gui-js-0.5/dat.gui.min',
    emitter: '../vendors-custom/emitter-1.1.3/index',
    objcoord: '../vendors/threex/objcoord/threex.objcoord',
    jquery: '../vendors/jquery-2.1.3/jquery-2.1.3.min'
  },
  shim: {
    three: {
      exports: 'THREE'
    },
    underscore: {
      exports: 'underscore'
    },
    cannon: {
      exports: 'CANNON'
    },
    rendererstats : {
      deps: ['three'],
    },
    stats: {
      exports: 'Stats',
    },
    datGui: {
      exports: 'dat'
    },
    objcoord :{
      deps: ['three'],
    },
  }
});

require([
	'test'
], function (
	test
) {
	test.run();
});