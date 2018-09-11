(function() {

/*global require */

var Game = require('./core/game');
var IntroPage = require('./core/introPage');
var EffectAudio = require('./util/effectAudio');

var game = new Game();

IntroPage.setup();
IntroPage.on('startGame', function () {
  document.getElementById('game').classList.remove('hide');
  document.getElementById('intro').classList.add('hide');
  game.run();
  setTimeout(function () {
      EffectAudio.play('zing');
  }, 500);
});

}());
