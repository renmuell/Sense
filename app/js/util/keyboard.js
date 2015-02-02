define([
	'./../core/enum/dir'
],function(
	DIR
){

	'use strict';

	var

	instance = null,

  KeyCode = {
    ESC 	: 27,
    SPACE : 32,
    LEFT 	: 37,
    UP 		: 38,
    RIGHT : 39,
    DOWN 	: 40,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
  };

	function Keyboard () {
		var keyboard = this;

	  	keyboard.keyUpPressed = false;
	  	keyboard.keyDownPressed = false;
	  	keyboard.keyLeftPressed = false;
	  	keyboard.keyRightPressed = false;
	  	keyboard.keySpacePressed = false;
	  	keyboard.keyEscPressed = false;

      this.keydownCallbacks = [];

	  	document.addEventListener("keydown", function(event) {
        if (typeof keyboard.keydownCallbacks[event.keyCode] !== 'undefined') {
          for (var i = keyboard.keydownCallbacks[event.keyCode].length - 1; i >= 0; i--) {
            keyboard.keydownCallbacks[event.keyCode][i].call(this, event);
          };
        }

	  		if(event.keyIdentifier === "Up" || event.keyCode === KeyCode.W) {
	  			keyboard.keyUpPressed = true;
	  		} else if (event.keyIdentifier === "Down" || event.keyCode === KeyCode.S) {
	  			keyboard.keyDownPressed = true;
	  		} else if (event.keyIdentifier === "Left" || event.keyCode === KeyCode.A) {
	  			keyboard.keyLeftPressed = true;
	  		} else if (event.keyIdentifier === "Right" || event.keyCode === KeyCode.D) {
	  			keyboard.keyRightPressed = true;
	  		} else if (event.keyCode === 32){
	  			keyboard.keySpacePressed = true;
	  		} else if (event.keyCode === KeyCode.ESC) {
	  			keyboard.keyEscPressed = true;
	  		}
	  	});

	  	document.addEventListener("keyup", function(event) {
	  		if(event.keyIdentifier === "Up" || event.keyCode === KeyCode.W) {
	  			keyboard.keyUpPressed = false;
	  		} else if (event.keyIdentifier === "Down" || event.keyCode === KeyCode.S) {
	  			keyboard.keyDownPressed = false;
	  		} else if (event.keyIdentifier === "Left" || event.keyCode === KeyCode.A) {
	  			keyboard.keyLeftPressed = false;
	  		} else if (event.keyIdentifier === "Right" || event.keyCode === KeyCode.D) {
	  			keyboard.keyRightPressed = false;
	  		} else if (event.keyCode === 32){
	  			keyboard.keySpacePressed = false;
	  		} else if (event.keyCode === KeyCode.ESC) {
	  			keyboard.keyEscPressed = false;
	  		}
	  	});
	}

	Keyboard.prototype = {
		dirPressed: function (dir) {

			if (dir === DIR.FRONT) {
				return this.keyUpPressed;
			} else if (dir === DIR.BACK) {
				return this.keyDownPressed;
			} else if (dir === DIR.LEFT) {
				return this.keyLeftPressed;
			} else if (dir === DIR.RIGHT) {
				return this.keyRightPressed;
			}
		},
    KeyCode: KeyCode,
    onKeydown : function (keyCode, callback) {
      if (typeof this.keydownCallbacks[keyCode] === 'undefined') {
        this.keydownCallbacks[keyCode] = [];
      }
      this.keydownCallbacks[keyCode].push(callback);
    }
	};

	Keyboard.getInstance = function () {
		if (instance === null) {
			instance = new Keyboard();
		}
		return instance;
	};

	return Keyboard.getInstance();

});