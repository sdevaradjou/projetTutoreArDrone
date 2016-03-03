var socket = io();

var arDrone = require('ar-drone');
var client = arDrone.createClient();

$('#m').onclick(function(e) {
    e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
    // On crée notre objet JSON correspondant à notre message
   /* var message = {
        text : $('#m').val()
    }*/
    socket.emit('chat-message'); // On émet l'événement avec le message associé
   // $('#m').val(''); // On vide le champ texte
   // if (message.text.trim().length !== 0) { // Gestion message vide
    //  socket.emit('chat-message', message);
   // }
   // $('#chat input').focus(); // Focus sur le champ du message
	
	/**
	* Réception d'un message
	*/
	//socket.on('chat-message', function (message) {
	//	$('#messages').append($('<li>').text(message.text));
	//});
	/*
	client.takeoff();
	client.after(5000, function() {
		client.land();
	});*/
});

socket.emit('image', { image: 'whazzzup?' });
client.getPngStream()
    .on('error', console.log)
    .on('data', function(frame) {
        socket.emit('image', { image: frame });
    });

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
