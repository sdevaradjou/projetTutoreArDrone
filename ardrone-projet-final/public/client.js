var socket = io();
var X = 0;
var Y = 0;
var B = 0;
var A = 0;


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

function animation() {
	socket.emit('animation'); 
}

//////////////////////////////////////

/*MODE MANETTE*/

//////////////////////////////////////

function stabiliserManette() {
	socket.emit('stabiliserManette');
}

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
	manette = false,
	
    gameloop = function(){
		manette=false;
		gamepad = navigator.getGamepads()[0];
		if(gamepad){
		  
			joystickXh = applyDeadzone(gamepad.axes[0], 0.25) * speed;
			joystickXv = applyDeadzone(gamepad.axes[1], 0.25) * speed;
			joystickYh = applyDeadzone(gamepad.axes[2], 0.25) * speed;
			joystickYv = applyDeadzone(gamepad.axes[3], 0.25) * speed;
			
			//JOYSTICK GAUCHE
			//joy à droite -> incline droite
			if(joystickXh>0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				inclinerDroiteManette();
				console.log("droite");
				
			}else{
				socket.emit('manettevide', { name: 'incdmanette'});
			}
			
			
			//joy a gauche -> incline gauche
			if(joystickXh<-0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				inclinerGaucheManette();
				console.log("gauche");
				
			}else{
				socket.emit('manettevide', { name: 'incgmanette'});
			}
			
			//joy en haut -> avance
			if(joystickXv<-0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				avancerManette();
				console.log("avant");
				
			}else{
				socket.emit('manettevide', { name: 'avancermanette'});
			}
			
			//joy en bas -> recule
			if(joystickXv>0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				reculerManette();
				console.log("arriere");
				
			}else{
				socket.emit('manettevide', { name: 'reculermanette'});
			}
			
			
			//JOYSTICK DROIT
			//joy à droite -> tourner droite
			if(joystickYh>0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				tournerDroiteManette();
				console.log("droite");
			}else{
				socket.emit('manettevide', { name: 'tourndmanette'});
			}
			
			//joy a gauche -> tourner gauche
			if(joystickYh<-0.9){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				tournerGaucheManette();
				console.log("gauche");
			}else{
				socket.emit('manettevide', { name: 'tourngmanette'});
			}
			
			
			//BOUTONS
			//A
			if(gamepad.buttons[0].pressed == true){
				X= 0;
				Y= 0;
				B= 0;
				A = A+1;
				manette=true;
				if(A == 1){
					decollage();
					
				}
			}else{
					socket.emit('manettevide', { name: 'decoller'});
				}
			
			//B
			if(gamepad.buttons[1].pressed == true){
				A = 0;
				X= 0;
				Y= 0;
				B = B+1;
				manette=true;
				if(B == 1){
					atterrir();
				}
			}else{
				socket.emit('manettevide', { name: 'atterrir'});
				}
			
			//X
			if(gamepad.buttons[2].pressed == true){
				A = 0;
				B= 0;
				Y= 0;
				X = X+1;
				manette=true;
				if(X == 1){
					stabiliserManette();
				}
			}else{
				socket.emit('manettevide', { name: 'stabiliserManette'});
				}
			
			//Y
			if(gamepad.buttons[3].pressed == true){
				A = 0;
				X= 0;
				B= 0;
				Y = Y+1;
				manette=true;
				if(Y == 1){
					calibrer();
				}
				
			}else{
					socket.emit('manettevide', { name: 'calibrer'});
				}
			
			//RT
			if(gamepad.buttons[7].value > 0.5){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				monterManette();
			}else{
				socket.emit('manettevide', { name: 'montermanette'});
			}
			
			//LT
			if(gamepad.buttons[6].value > 0.5){
				X= 0;
				Y= 0;
				B= 0;
				A = 0;
				manette=true;
				descendreManette();
			}else{
				socket.emit('manettevide', { name: 'descendremanette'});
			}
		
			if(manette==false){
				stabiliserManette();
			}
			
		}
		window.requestAnimationFrame(gameloop);
    };


gameloop();