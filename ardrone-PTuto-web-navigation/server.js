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
	var logBak = console.log;
var logMessages = [];

console.loga = function(value) {
	//if(value=='Sauvegarde des frames'){
		logMessages.push(value);
		logBak.call(console, value);
	//}

};

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
// client.config({ key: 'general:navdata_demo', value: 'FALSE'});
// client.config({ key: 'control:altitude_max ', value: '300', timeout: 1000 });
//client.config({ key: 'control:outdoor', value: 'FALSE', timeout: 1000 });
//client.config({ key: 'control:manual_trim', value: 'TRUE', timeout: 1000 });
client.config('control:euler_angle_max', 0.10);
client.config('control:outdoor_euler_angle_max', 0.10);
client.config('control:control_vz_max', 200);

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
  
  
	//////////////////////////////////////////////////////////

	/*MESSAGES MANUEL*/

	//////////////////////////////////////////////////////////
	socket.on('decoller', function () {
		console.log('OK Je vais decoller');
		client.takeoff();
		client.after(3000, function() {
			client.stop();
			socket.emit('event', { name: "decollagefini",value: 0});
		});
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
		client.back(0.3);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('monter', function () {
		console.log('OK monter');
		client.up(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
		
	socket.on('descendre', function () {
		console.log('OK descendre');
		client.down(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('tournerD', function () {
		console.log('OK droite');
		client.clockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('tournerG', function () {
		console.log('OK gauche');
		client.counterClockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('calibrer', function () {
		console.log('OK Calibration');
		client.calibrate(0);
	});
	
	socket.on('inclinerD', function () {
		console.log('OK incline droite');
		client.right(0.2);
		client.after(30, function() {
			client.stop();
		});
	});
	
	socket.on('inclinerG', function () {
		console.log('OK incline gauche');
		client.left(0.4);
		
	});
	
	
	
	//////////////////////////////////////////////////////////

	/*MESSAGES AUTO*/

	//////////////////////////////////////////////////////////
	socket.on('avancerAuto', function () {
		console.log('OK avance AUTO');
		client.front(0.01);
	});
	
	socket.on('monterAuto', function () {
		console.log('OK monter AUTO');
		client.up(0.02);
	});
		
	socket.on('descendreAuto', function () {
		console.log('OK descendre AUTO');
		client.down(0.03);	
	});
	
	socket.on('inclinerGAuto', function () {
		console.log('OK gauche AUTO');
		client.left(0.06);	
	});
	
	socket.on('inclinerDAuto', function () {
		console.log('OK droite AUTO');
		client.right(0.005);	
	});
	
	socket.on('tournerGAuto', function () {
		console.log('OK tournergauche AUTO');
		client.counterClockwise(0.02);
	});
	
	socket.on('tournerDAuto', function () {
		console.log('OK tournerdroite AUTO');
		client.clockwise(0.2);
		client.after(1000, function() {
			client.counterClockwise(0.2);
		});		
		client.after(500, function() {
			client.stop();
		});	
	});
	
	
	
	//////////////////////////////////////////////////////////

	/*MESSAGES MANETTE*/

	//////////////////////////////////////////////////////////
	socket.on('avancerManette', function () {
		console.log('OK avance');
		client.front(0.2);
	});
	
	socket.on('reculerManette', function () {
		console.log('OK recule');
		client.back(0.3);
	});
	
	socket.on('monterManette', function () {
		console.log('OK monter');
		client.up(0.5);
	});
		
	socket.on('descendreManette', function () {
		console.log('OK descendre');
		client.down(0.5);
	});
	
	socket.on('tournerDManette', function () {
		console.log('OK droite');
		client.clockwise(0.3);
	});
	
	socket.on('tournerGManette', function () {
		console.log('OK gauche');
		client.counterClockwise(0.3);
	});
	
	socket.on('inclinerDManette', function () {
		console.log('OK incline droite');
		client.right(0.2);
	});
	
	socket.on('inclinerGManette', function () {
		console.log('OK incline gauche');
		client.left(0.4);
	});
	
	
	
	////////////////////////////////////////////
	setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },200);
  
  
	/*setInterval(function(){

		client.on('navdata', console.loga);

	
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


