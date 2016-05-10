var keys = {},
    speed = 4,
    player = document.getElementById('player'),
    applyDeadzone = function(number, threshold){
        percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    },
    gamepad = null,
    joystickX = 0, 
    horizontalMovement = 0,
    getHorizontalMovementFromKeys = function(){
      
      movement = 0;
      
      if(keys[37]){
        movement = -speed;
      }
      if(keys[39]){
        movement += speed;
      }
      
      return movement;
    },
    gameloop = function(){
      
      gamepad = navigator.getGamepads()[0];
      if(gamepad){
		  console.log("test");
        joystickX = applyDeadzone(gamepad.axes[0], 0.25) * speed;
        if(Math.abs(joystickX) > 0){
          horizontalMovement = joystickX;
        }else{
          horizontalMovement = getHorizontalMovementFromKeys();
        }
      }else{
        horizontalMovement = getHorizontalMovementFromKeys();
      }
       
      if(Math.abs(horizontalMovement) > 0){
        playerLeft = parseFloat(window.getComputedStyle(player,null).getPropertyValue("left"));

        if(playerLeft){
          player.style.left = (playerLeft + horizontalMovement) + "px";
        }
      }

      window.requestAnimationFrame(gameloop);
    };

window.onkeydown = function(e){
  var e = e || window.event;
  keys[e.keyCode] = true;
}

window.onkeyup = function(e){
  var e = e || window.event;
  delete keys[e.keyCode];
}

gameloop();