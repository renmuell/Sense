require.config({
  paths: {
    three: 'vendors/threejs-r72/three',
    underscore: 'vendors/underscore-1.8.3/underscore',
    cannon: 'vendors/cannon-js-0.6.2/cannon',
    stats: 'vendors/stats-0.0.14/stats',
    rendererstats: 'vendors/threex/threex.rendererstats/threex.rendererstats',
    datGui : 'vendors/dat-gui-js-0.5/dat.gui',
    emitter: 'vendors-custom/emitter-1.2.0/emitter',
    textureAnimator: 'vendors-custom/textureAnimator/textureAnimator',
    objcoord: 'vendors-custom/threex/threex.objcoord/threex.objcoord',
    jquery: 'vendors/jquery-2.1.4/jquery-2.1.4',
    bootstrap: 'vendors/bootstrap-3.3.5/js/bootstrap',
    bootstrapProgressbar : 'vendors/bootstrap-progressbar-0.9.0/js/bootstrap-progressbar'
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