'use strict'

var express = require('express');
var app = express();
app.use("/", express.static(__dirname + "/public"));

var http = require('http').Server(app);
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
      fs.writeFile('D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ar-drone-png-stream-master\\public'+'\\frame' + '.png', pngBuffer, function(err) {
        if (err) {
          console.log('Erreur sauvegarde PNG: ' + err);
        }
      });
    }
  });
	
	
// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server en ecoute sur le port *:3000');
  console.log('Sauvegarde des frames');
});
	

module.exports = function(client, opts) {
	var png = null;

	opts = opts || {};

	var server = http.createServer(function(req, res) {

	if (!png) {
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


	
