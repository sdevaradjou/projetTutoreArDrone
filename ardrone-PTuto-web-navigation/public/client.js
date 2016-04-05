var socket = io();


///////////////////



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
	socket.emit('tournerdroite'); 
}

function tournerGauche() {
	socket.emit('tournergauche'); 
}

function monter() {
	socket.emit('monter'); 
}

function descendre() {
	socket.emit('descendre'); 
}

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

function gaucheAuto() {
	socket.emit('gaucheAuto'); 
}

function droiteAuto() {
	socket.emit('droiteAuto'); 
}
//////////////////////////////////////
