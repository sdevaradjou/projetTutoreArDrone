var arDrone = require('ar-drone');
var http    = require('http');

console.log('Connecting png stream ...');

var video = arDrone.createClient().getVideoStream();

var Streaming;
var autre;

video.on('data',function(Streaming){
autre=Streaming;
});
video.on('error',console.log);

var server = http.createServer(function(req, res) {
  /*if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }
*/
  res.writeHead(200, {'Content-Type': 'video/mp4'});
  res.end(autre);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});





/////////////////// A TESTER /////////////////////////// :

var arDrone = require('ar-drone');
var client = arDrone.createClient();
var fs = require('fs');

var pngStream = client.getPngStream();
var frameCounter = 0;
var period = 5000; // Save a frame every 5000 ms.
var lastFrameTime = 0;

pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    var now = (new Date()).getTime();
    if (now - lastFrameTime > period) {
      frameCounter++;
      lastFrameTime = now;
      console.log('Saving frame');
      fs.writeFile('frame' + frameCounter + '.png', pngBuffer, function(err) {
        if (err) {
          console.log('Error saving PNG: ' + err);
        }
      });
    }
  });