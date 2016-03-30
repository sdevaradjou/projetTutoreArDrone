var arDrone = require('ar-drone');
var http    = require('http');

console.log('Connecting png stream ...');


var pngStream;
	




var server = http.createServer(function(req, res) {
	
	 pngStream= arDrone.createClient().getPngStream();
	

  res.writeHead(200, {'Content-Type': 'image/png'});
  pngStream.on('data', function(pngBuffer) {
	  lastPng = pngBuffer;
  
	res.end(lastPng);
  });
  
 
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});





