// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Worker = require("tiny-worker");
var worker;

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
      fs.writeFile('D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-projet-final\\public'+'\\frame' + '.png', pngBuffer, function(err) {
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

io.on('connection', function(socket){
	
	
  /**
   * Log de connexion et de déconnexion des utilisateurs
   */
	console.log('utilisateur connecte');
	
	socket.on('disconnect', function () {
		console.log('utilisateur deconnecte');		
	});
	
  
	var altitude;	
	var pitch;
	var roll;
	var yaw;
	var vx;
	var vy;
	var vz;
	var FlyState;
	
	
	var motorProblem;
	var communicationLost;
	var softwareFault;
	var lowBattery;
	var MagnometerNeedsCalibration;
	var tooMuchWind;
	var ultrasonicSensorDeaf;

	//////////////////////////////////////////////////////////
	client.on('navdata', function(data) {
		if (!data.demo) return;
		altitude=data.demo.altitudeMeters;	
		pitch = data.demo.rotation.pitch;
		roll  = data.demo.rotation.roll;
		yaw   = data.demo.rotation.yaw;
		vx    = data.demo.velocity.x;
		vy    = data.demo.velocity.y;
		vz    = data.demo.velocity.z;
		FlyState = data.demo.flyState;
		
		motorProblem = data.droneState.motorProblem;
		communicationLost = data.droneState.communicationLost;
		softwareFault = data.droneState.softwareFault;
		lowBattery = data.droneState.lowBattery;
		MagnometerNeedsCalibration = data.droneState.MagnometerNeedsCalibration;
		tooMuchWind = data.droneState.tooMuchWind;
		ultrasonicSensorDeaf = data.droneState.ultrasonicSensorDeaf;
		

		
		socket.emit('EnvoiNavdata', { name: 'altitude',value: altitude});
		socket.emit('EnvoiNavdata', { name: 'pitch',value: pitch});
		socket.emit('EnvoiNavdata', { name: 'roll',value: roll});
		socket.emit('EnvoiNavdata', { name: 'yaw',value: yaw});
		socket.emit('EnvoiNavdata', { name: 'vx',value: vx});
		socket.emit('EnvoiNavdata', { name: 'vy',value: vy});
		socket.emit('EnvoiNavdata', { name: 'vz',value: vz});
		socket.emit('EnvoiNavdata', { name: 'flyState',value: FlyState});
		
		socket.emit('EnvoiNavdata', { name: 'motorProblem',value: motorProblem});
		socket.emit('EnvoiNavdata', { name: 'communicationLost',value: communicationLost});
		socket.emit('EnvoiNavdata', { name: 'softwareFault',value: softwareFault});
		socket.emit('EnvoiNavdata', { name: 'lowBattery',value: lowBattery});
		socket.emit('EnvoiNavdata', { name: 'MagnometerNeedsCalibration',value: MagnometerNeedsCalibration});
		socket.emit('EnvoiNavdata', { name: 'tooMuchWind',value: tooMuchWind});
		socket.emit('EnvoiNavdata', { name: 'ultrasonicSensorDeaf',value: ultrasonicSensorDeaf});

	});
	//////////////////////////////////////////////////////////
  
  
  
  
	//////////////////////////////////////////////////////////

	/*MESSAGES MANUEL*/

	//////////////////////////////////////////////////////////
	socket.on('decoller', function () {
		console.log('OK Je vais decoller');
		socket.emit('manetteactive', { name: 'decoller'});
		client.takeoff();
		
		client.after(150, function() {
			if(worker!=undefined){
				worker.postMessage({ name: 'cmd',value: 1});
			}
			worker=new Worker("D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-PTuto-web-navigation\\worker.js");
			worker.postMessage({ name: 'yaw',value: yaw});
			worker.postMessage({ name: 'roll',value: roll});
			worker.postMessage({ name: 'pitch',value: pitch});
			worker.postMessage({ name: 'altitude',value: altitude});
			console.log('OK Stabilise avec thread');
		});
		
		client.after(6000, function() {
			socket.emit('event', { name: "decollagefini",value: 0});
		});
		
		
	});
	
	socket.on('atterrir', function () {
		
		socket.emit('manetteactive', { name: 'atterrir'});
		console.log('OK Je vais atterir');
		client.land();
		socket.emit('event', { name: "decollagefini",value: 1});
	});
  
	socket.on('stabiliser', function () {
		socket.emit('manetteactive', { name: 'stabiliser'});
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		worker=new Worker("D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-PTuto-web-navigation\\worker.js");
		worker.postMessage({ name: 'altitude',value: altitude});
		worker.postMessage({ name: 'yaw',value: yaw});
		worker.postMessage({ name: 'roll',value: roll});
		worker.postMessage({ name: 'pitch',value: pitch});
		console.log('OK Stabilise avec thread');
	});
	
	socket.on('avancer', function () {
		client.front(0.2);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('reculer', function () {
		client.back(0.3);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('monter', function () {
		client.up(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
		
	socket.on('descendre', function () {
		client.down(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('tournerD', function () {
		client.clockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('tournerG', function () {
		client.counterClockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('calibrer', function () {
		socket.emit('manetteactive', { name: 'calibrer'});
		console.log('OK Calibration');
		client.calibrate(0);
	});
	
	socket.on('inclinerD', function () {
		client.right(0.2);
		client.after(30, function() {
			client.stop();
		});
	});
	
	socket.on('inclinerG', function () {
		client.left(0.4);
	});
	
	
	
	//////////////////////////////////////////////////////////

	/*MESSAGES AUTO*/

	//////////////////////////////////////////////////////////
	socket.on('avancerAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK Avance AUTO');		
		client.front(0.09);
	});
	
	socket.on('monterAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK Monter AUTO');		
		client.up(0.1);
	});
		
	socket.on('descendreAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK Descendre AUTO');		
		client.down(0.1);	
	});
	
	socket.on('inclinerGAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK InclinerG AUTO');		
		client.left(0.2);	
	});
	
	socket.on('inclinerDAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK InclinerD AUTO');		
		client.right(0.005);	
	});
	
	/*socket.on('tournerGAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK TournerG AUTO');		
		client.counterClockwise(0.02);
	});
	
	socket.on('tournerDAuto', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK TournerD AUTO');		
		client.clockwise(0.2);
		client.after(1000, function() {
			client.counterClockwise(0.2);
		});		
		
	});*/
	
	socket.on('animation', function () {
		socket.emit('manetteactive', { name: 'stabiliser'});
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		worker=new Worker("D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-PTuto-web-navigation\\worker.js");
		worker.postMessage({ name: 'yaw',value: yaw});
		worker.postMessage({ name: 'roll',value: roll});
		worker.postMessage({ name: 'pitch',value: pitch});
		console.log('OK Stabilise avec thread');
	});
	
	//////////////////////////////////////////////////////////

	/*MESSAGES MANETTE*/

	//////////////////////////////////////////////////////////
	socket.on('avancerManette', function () {	
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'avancermanette'});
		client.front(0.1);
	});
	
	socket.on('reculerManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'reculermanette'});
		client.back(0.1);
	});
	
	socket.on('monterManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'montermanette'});
		client.up(0.3);
	});
		
	socket.on('descendreManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'descendremanette'});
		client.down(0.7);
	});
	
	socket.on('tournerDManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'tourndmanette'});
		client.clockwise(0.3);
	});
	
	socket.on('tournerGManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'tourngmanette'});
		client.counterClockwise(0.3);
	});
	
	socket.on('inclinerDManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'incdmanette'});
		client.right(0.2);
	});
	
	socket.on('inclinerGManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		socket.emit('manetteactive', { name: 'incgmanette'});
		client.left(0.4);
	});
	
	socket.on('manettevide', function (data) {
		socket.emit('manettenull', { name: data.name});
	}); 
	
	////////////////////////////////////////////
	setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },200);
  
  
		
	
	

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
	res.writeHead(200, {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin' : '*',
	'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
	});

	res.write('--daboundary\nContent-Type: image/png\nContent-length: ' + buffer.length + '\n\n');
	res.write(buffer);

	});

	server.listen(opts.port || 3001);
};


