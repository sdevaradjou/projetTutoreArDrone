var socket = io();

var arDrone = require('ar-drone');
var client = arDrone.createClient();

///////////////////

var client = arDrone.createClient();
client.getPngStream()
    .on('error', console.log)
    .on('data', function(frame) {
        socket.emit('image', { image: frame });
    });

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
