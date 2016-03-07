// Tout d'abbord on initialise notre application avec le framework Express 
// et la biblioth�que http integr�e � node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//require("dronestream").listen(3001);

var arDrone = require('ar-drone');

var client = arDrone.createClient();

require("./public/camera-feed");

// On g�re les requ�tes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));

// On lance le serveur en �coutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server is listening on *:3000');
});

io.on('connection', function(socket){
  /**
   * Log de connexion et de d�connexion des utilisateurs
   */
	console.log('utilisateur connecte');
	socket.on('disconnect', function () {
		console.log('utilisateur deconnecte');
	});
 client.config('control:altitude_max', 1500);
  /**
   * R�ception de l'�v�nement 'chat-message' et r��mission vers tous les utilisateurs
   */
	socket.on('decoller', function () {
console.log('OK Je vais decoller');
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
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('reculer', function () {
		console.log('OK recule');
		client.back(0.1);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('monter', function () {
		console.log('OK monter');
		client.up(0.3);
		client.after(1000, function() {
			client.stop();
		});
	});
		
	socket.on('descendre', function () {
		console.log('OK descendre');
		client.down(0.3);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('tournerdroite', function () {
		console.log('OK droite');
		client.clockwise(0.5);
		client.after(500, function() {
			client.stop();
			 client.config('demo:leftRightDegrees', 0.0);
		});
	});
	
	socket.on('tournergauche', function () {
		console.log('OK gauche');
		client.counterClockwise(0.5);
		client.after(500, function() {
			client.stop();
			 client.config('demo:leftRightDegrees', 0.0);
		});
	});
	
	setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },500);
  
  
	client.on('navdata', console.log);
  client.config('demo:leftRightDegrees', 0.0);
});
