var arDrone = require('ar-drone');
var client = arDrone.createClient();
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
      console.log('Saving frame');
      fs.writeFile('D:\\ARDRONE2\\progs\\projetTutoreArDrone\\ar-drone-png-stream-master\\public'+'\\frame' + '.png', pngBuffer, function(err) {
        if (err) {
          console.log('Error saving PNG: ' + err);
        }
      });
    }
  });