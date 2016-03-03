// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require("dronestream").listen(3001);

var arDrone = require('ar-drone');
var client = arDrone.createClient();


// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server is listening on *:3000');
});

io.on('connection', function(socket){
  /**
   * Log de connexion et de déconnexion des utilisateurs
   */
	console.log('a user connected');
	socket.on('disconnect', function () {
		console.log('user disconected');
	});

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
	socket.on('decoller', function () {
		console.log('OK Je decolle maintenant');
		client.takeoff();
	});
  
	socket.on('atterrir', function () {
		console.log('OK Je vais atterir');
		client.land();
	});
  
	socket.on('stabiliser', function () {
		console.log('OK Je me stabilise');
		client.stop();
	});
	
	socket.on('avancer', function () {
		console.log('OK avance');
		client.front(0.1);
		/*client.after(1500, function() {
			client.stop();
		});*/
	});
	
	socket.on('reculer', function () {
		console.log('OK recule');
		client.animate('theta20degYawM200deg',5000);
		/*client.after(1500, function() {
			client.stop();
		});*/
	});
	
	socket.on('monter', function () {
		console.log('OK monter');
		client.up(0.7);
	});
	
	socket.on('tournerdroite', function () {
		console.log('OK droite');
		client.clockwise(0.5);
	/*	client.after(2000, function() {
			client.stop();
		});*/
	});
	
	socket.on('tournergauche', function () {
		console.log('OK gauche');
		client.counterClockwise(0.5);
		/*client.after(2000, function() {
			client.stop();
		});*/
	});
	

	
	socket.on('descendre', function () {
		console.log('OK descendre');
		client.down(0.3);
	});
  
  /*  
	client.takeoff();
	client.after(5000, function() {
	client.land();
	});
*/
  
});
