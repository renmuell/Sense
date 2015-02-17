require.config({
  paths: {
    three: 'vendors/threejs-r70/three',
    underscore: 'vendors/underscore-1.7.0/underscore',
    cannon: 'vendors/cannon-js-0.6.1/cannon',
    stats: 'vendors/stats-r12/Stats',
    rendererstats: 'vendors/threex/rendererstats/threex.rendererstats',
    datGui : 'vendors/dat-gui-js-0.5/dat.gui',
    emitter: 'vendors-custom/emitter-1.1.3/index',
    textureAnimator: 'vendors-custom/textureAnimator/textureAnimator',
    objcoord: 'vendors-custom/threex/objcoord/threex.objcoord',
    jquery: 'vendors/jquery-2.1.3/jquery-2.1.3',
    bootstrap: 'vendors/bootstrap-3.3.2/js/bootstrap',
    bootstrapProgressbar : 'vendors/bootstrap-progressbar/js/bootstrap-progressbar'
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
    bootstrap: {
      deps: ['jquery']
    },
    bootstrapProgressbar: {
      deps: ['jquery', 'bootstrap']
    }
  }
});

require([
  'jquery',
  'core/game',
  'core/introPage',
  'util/effectAudio'
], function (
  $,
  Game,
  IntroPage,
  EffectAudio
) {
    $(document).ready(function () {
      var game = new Game();
      IntroPage.setup();
      IntroPage.on('startGame', function () {
        game.run();
        $('.ft').removeClass('fa-open').addClass('fa-close');
        setTimeout(function () {
           EffectAudio.play('zing');
        }, 500);
      });
      $('#game canvas').removeClass('hide');
    });
});