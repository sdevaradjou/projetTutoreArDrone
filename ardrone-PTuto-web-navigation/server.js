// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Worker = require("tiny-worker");
var worker;
console.log("worker lance: " + worker)


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
	
	var activeStabi = 0;
	var bloqueStabi = 0;
  
  
  
	//////////////////////////////////////////////////////////
	client.on('navdata', function(data) {
		if (!data.demo) return;
		altitude=data.demo.altitude;	
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
		
		//console.log(MagnometerNeedsCalibration)
		
		socket.emit('event', { name: 'altitude',value: altitude});
		socket.emit('event', { name: 'pitch',value: pitch});
		socket.emit('event', { name: 'roll',value: roll});
		socket.emit('event', { name: 'yaw',value: yaw});
		socket.emit('event', { name: 'vx',value: vx});
		socket.emit('event', { name: 'vy',value: vy});
		socket.emit('event', { name: 'vz',value: vz});
		socket.emit('event', { name: 'flyState',value: FlyState});
		
		socket.emit('event', { name: 'motorProblem',value: motorProblem});
		socket.emit('event', { name: 'communicationLost',value: communicationLost});
		socket.emit('event', { name: 'softwareFault',value: softwareFault});
		socket.emit('event', { name: 'lowBattery',value: lowBattery});
		socket.emit('event', { name: 'MagnometerNeedsCalibration',value: MagnometerNeedsCalibration});
		socket.emit('event', { name: 'tooMuchWind',value: tooMuchWind});
		socket.emit('event', { name: 'ultrasonicSensorDeaf',value: ultrasonicSensorDeaf});

	});
	//////////////////////////////////////////////////////////
  
  
  
  
	//////////////////////////////////////////////////////////

	/*MESSAGES MANUEL*/

	//////////////////////////////////////////////////////////
	socket.on('decoller', function () {
		console.log('OK Je vais decoller');
		client.takeoff();
		client.after(6000, function() {
			client.stop();
			socket.emit('event', { name: "decollagefini",value: 0});
		});
	});
	
	socket.on('atterrir', function () {
		activeStabi = 0;
		
		console.log('OK Je vais atterir ' + activeStabi);
		client.land();
		socket.emit('event', { name: "decollagefini",value: 1});
	});
  
	socket.on('stabiliser', function () {
		client.stop();
		worker=new Worker("D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ardrone-PTuto-web-navigation\\worker.js");
		console.log("worker lance: " + worker)
		worker.postMessage({ name: 'yaw',value: yaw});
		worker.postMessage({ name: 'roll',value: roll});
		worker.postMessage({ name: 'pitch',value: pitch});
		worker.postMessage({ name: 'altitude',value: altitude});
		console.log('OK Stabilise avec thread');
	});
	
	socket.on('avancer', function () {
		activeStabi = 0;
		console.log('OK avance' + activeStabi);
		client.front(0.2);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('reculer', function () {
		activeStabi = 0;
		console.log('OK recule' + activeStabi);
		client.back(0.3);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('monter', function () {
		activeStabi = 0;
		console.log('OK monter' + activeStabi);
		client.up(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
		
	socket.on('descendre', function () {
		activeStabi = 0;
		console.log('OK descendre' + activeStabi);
		client.down(0.5);
		client.after(1000, function() {
			client.stop();
		});
	});
	
	socket.on('tournerD', function () {
		activeStabi = 0;
		console.log('OK droite' + activeStabi);
		client.clockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('tournerG', function () {
		activeStabi = 0;
		console.log('OK gauche' + activeStabi);
		client.counterClockwise(0.3);
		client.after(250, function() {
			client.stop();
		});
	});
	
	socket.on('calibrer', function () {
		activeStabi = 0;
		console.log('OK Calibration');
		client.calibrate(0);
	});
	
	socket.on('inclinerD', function () {
		activeStabi = 0;
		console.log('OK incline droite' + activeStabi);
		client.right(0.2);
		client.after(30, function() {
			client.stop();
		});
	});
	
	socket.on('inclinerG', function () {
		activeStabi = 0;
		console.log('OK incline gauche' + activeStabi);
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
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK avance' + activeStabi);
		client.front(0.1);
	});
	
	socket.on('reculerManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK recule' + activeStabi);
		client.back(0.1);
	});
	
	socket.on('monterManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK monter' + activeStabi);
		client.up(0.7);
	});
		
	socket.on('descendreManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK descendre' + activeStabi);
		client.down(0.7);
	});
	
	socket.on('tournerDManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK droite' + activeStabi);
		client.clockwise(0.3);
	});
	
	socket.on('tournerGManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK gauche' + activeStabi);
		client.counterClockwise(0.3);
	});
	
	socket.on('inclinerDManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK incline droite' + activeStabi);
		client.right(0.2);
	});
	
	socket.on('inclinerGManette', function () {
		if(worker!=undefined){
			worker.postMessage({ name: 'cmd',value: 1});
		}
		console.log('OK incline gauche' + activeStabi);
		client.left(0.4);
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


