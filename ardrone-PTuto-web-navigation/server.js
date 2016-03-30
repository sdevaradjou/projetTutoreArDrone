// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//require("dronestream").listen(3001);
//require('ar-drone-png-stream')(client, { port: 3002 });

var arDrone = require('ar-drone');

var client = arDrone.createClient();

require('ar-drone-png-stream')(client, { port: 3001 });
	
var fs = require('fs');
var pngStream = client.getPngStream();
var frameCounter = 0;
var period = 90; // Save a frame every 5000 ms.
var lastFrameTime = 0;

pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    var now = (new Date()).getTime();
    if (now - lastFrameTime > period) {
      frameCounter++;
      lastFrameTime = now;
      //console.log('Sauvegarde frame');
      fs.writeFile('D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-PTuto-web-navigation\\public'+'\\frame' + '.png', pngBuffer, function(err) {
        if (err) {
          console.log('Erreur sauvegarde PNG: ' + err);
        }
      });
    }
  });

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));


// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server is listening on *:3000');
  console.log('Sauvegarde des frames');
});

  var callback = function(err) { if (err) console.log(err); };
  client.config({ key: 'general:navdata_demo', value: 'FALSE'});
  client.config({ key: 'control:altitude_max ', value: '300', timeout: 1000 });
client.config({ key: 'control:outdoor', value: 'FALSE', timeout: 1000 });
client.config({ key: 'control:manual_trim', value: 'TRUE', timeout: 1000 });
//client.config({ key: 'video:video_codec', value: 'H264_720P_CODEC'});
//client.config({ key: 'detect:groundstripe_colors ', value: 'FALSE'});


io.on('connection', function(socket){
	
	
	
  /**
   * Log de connexion et de déconnexion des utilisateurs
   */
	console.log('utilisateur connecte');
	socket.on('disconnect', function () {
		console.log('utilisateur deconnecte');
	});
	
	client.config('control:altitude_max', 1500);
  
  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
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
		client.front(0.2);
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
		client.clockwise(0.1);
		client.after(250, function() {
			client.stop();
		});
			
	
	});
	
	socket.on('tournergauche', function () {
		console.log('OK gauche');
		client.counterClockwise(0.1);
		client.after(250, function() {
			client.stop();
		});
	});
	
	setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },500);
  

  
	/*setInterval(function(){
		client.on('navdata', console.log);
	},3000);*/


});


module.exports = function(client, opts) {
	var png = null;

	opts = opts || {};

	var server = http.createServer(function(req, res) {

	if (!png){
	png = client.getPngStream();
	png.on('error', function (err) {
	console.error('png stream ERROR: ' + err);
	});
	}
	//res.setHeader("Access-Control-Allow-Origin","http://localhost:3001");
	res.writeHead(200, {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin' : '*',
	'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
	});

	//console.log(buffer.length);
	res.write('--daboundary\nContent-Type: image/png\nContent-length: ' + buffer.length + '\n\n');
	res.write(buffer);

	});

	server.listen(opts.port || 3001);
};


