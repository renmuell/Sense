(function() {

/*global require, module */

var $ = require('../vendors_dev/jquery-3.3.1/jquery-3.3.1');
var Game = require('./core/game');
var IntroPage = require('./core/introPage');
var EffectAudio = require('./util/effectAudio');

$(document).ready(function () {

  var game = new Game();

  IntroPage.setup();
  IntroPage.on('startGame', function () {
    $('#game').removeClass('hide');
    $('#intro').addClass('hide');
    game.run();
    setTimeout(function () {
        EffectAudio.play('zing');
    }, 500);
  });
  

});

}());
