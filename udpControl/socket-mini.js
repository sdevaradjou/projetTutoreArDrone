var arDrone = require('ar-drone');
var client = arDrone.createClient();
 http = require('http'),
 socket = require("socket.io");

 
 var app = http.createServer(function(r, s){
	handler(r,s); 
	
	
	});
app.listen(8880);


var listener = socket.listen(app, { log: true });
 
console.log('Recovering from emergency mode if there was one ...');

function decollage() {
  console.log('Takeoff ...');
	client.takeoff();

};



function atterrissage() {
  console.log('Landing ...');
	client.land();

};


function start(socket) 
{
  console.log("start(socket)");
 socket.on('decollage', function() {
	   socket.emit('decollage realise!');
	  decollage();
	  } );
	
  socket.on('atterrissage', function () {
    console.log("atterrissage.");
		  atterrissage();

  });   

	
}


listener.sockets.on('connection', function (socket) { 
 console.log("connexion");
start(socket);
} );