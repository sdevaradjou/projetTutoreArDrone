var socket = io();


///////////////////

/*MODE MANUEL*/

//////////////////

function decollage() {
	socket.emit('decoller'); 
}

function atterrir() {
	socket.emit('atterrir'); 
}

function stabiliser() {
	socket.emit('stabiliser'); 
}

function avancer() {
	socket.emit('avancer'); 
}

function reculer() {
	socket.emit('reculer'); 
}

function tournerDroite() {
	socket.emit('tournerD'); 
}

function tournerGauche() {
	socket.emit('tournerG'); 
}

function monter() {
	socket.emit('monter'); 
}

function descendre() {
	socket.emit('descendre'); 
}

function calibrer() {
	socket.emit('calibrer'); 
}

function inclinerGauche() {
	socket.emit('inclinerG'); 
}

function inclinerDroite() {
	socket.emit('inclinerD'); 
}



////////////////////////////////////////

/*MODE AUTO*/

////////////////////////////////////////

function monterAuto() {
	socket.emit('monterAuto'); 
}

function descendreAuto() {
	socket.emit('descendreAuto'); 
}

function avancerAuto() {
	socket.emit('avancerAuto'); 
}

function inclinerGaucheAuto() {
	socket.emit('inclinerGAuto'); 
}

function inclinerDroiteAuto() {
	socket.emit('inclinerDAuto'); 
}

function tournerDroiteAuto() {
	socket.emit('tournerDAuto'); 
}

function tournerGaucheAuto() {
	socket.emit('tournerGAuto'); 
}



//////////////////////////////////////

/*MODE MANETTE*/

//////////////////////////////////////

function avancerManette() {
	socket.emit('avancerManette'); 
}

function reculerManette() {
	socket.emit('reculerManette'); 
}

function tournerDroiteManette() {
	socket.emit('tournerDManette'); 
}

function tournerGaucheManette() {
	socket.emit('tournerGManette'); 
}

function monterManette() {
	socket.emit('monterManette'); 
}

function descendreManette() {
	socket.emit('descendreManette'); 
}

function inclinerGaucheManette() {
	socket.emit('inclinerGManette'); 
}

function inclinerDroiteManette() {
	socket.emit('inclinerDManette'); 
}



    var speed = 4,
	inc=0,
    applyDeadzone = function(number, threshold){
        percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    },
    gamepad = null,
    joystickXh = 0,
	joystickXv = 0,
	joystickYh = 0,
	joystickYv = 0,

	
    gameloop = function(){
			
		gamepad = navigator.getGamepads()[0];
		if(gamepad){
		  
			joystickXh = applyDeadzone(gamepad.axes[0], 0.25) * speed;
			joystickXv = applyDeadzone(gamepad.axes[1], 0.25) * speed;
			joystickYh = applyDeadzone(gamepad.axes[2], 0.25) * speed;
			joystickYv = applyDeadzone(gamepad.axes[3], 0.25) * speed;
			
			//JOYSTICK GAUCHE
			//joy à droite -> incline droite
			if(joystickXh>0){
				inclinerDroiteManette();
				console.log("droite");
			}
			//joy a gauche -> incline gauche
			if(joystickXh<0){
				inclinerGaucheManette();
				console.log("gauche");
			}
			//joy en haut -> avance
			if(joystickXv<0){
				avancerManette();
				console.log("avant");
			}
			//joy en bas -> recule
			if(joystickXv>0){
				reculerManette();
				console.log("arriere");
			}
			
			
			//JOYSTICK DROIT
			//joy à droite -> tourner droite
			if(joystickYh>0){
				tournerDroiteManette();
				console.log("droite");
			}
			//joy a gauche -> tourner gauche
			if(joystickYh<0){
				tournerGaucheManette();
				console.log("gauche");
			}
			
			
			//BOUTONS
			//A
			if(gamepad.buttons[0].pressed == true){
					decollage();
			}
			
			//B
			if(gamepad.buttons[1].pressed == true){
					atterrir();
			}
			
			//X
			if(gamepad.buttons[2].pressed == true){
					stabiliser();
			}
			
			//Y
			if(gamepad.buttons[3].pressed == true){
					calibrer();
			}
			
			//RT
			if(gamepad.buttons[7].value > 0.5){
					monterManette();
			}
			
			//LT
			if(gamepad.buttons[6].value > 0.5){
					descendreManette();
			}
		}
		window.requestAnimationFrame(gameloop);
    };


gameloop();