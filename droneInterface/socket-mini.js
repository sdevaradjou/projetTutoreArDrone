var uri="/socket-mini.html"; // the name of your HTML page

var arDrone = require('ar-drone');
var client = arDrone.createClient();

var fs = require('fs'),
    http = require('http'),
    socket = require("socket.io");

var page = fs.readFileSync(__dirname + uri);

function handler(request, response)
{
  response.write(page); 
  response.end(); 
}

var app = http.createServer(function(r, s){ handler(r,s); });
app.listen(1657);

var listener = socket.listen(app, { log: true });

function decolage()
{
	client.takeoff();
	//client
	
	//.after(1000, function() {
		//this.up(0.5);
	//})

	//.after(5000, function() {
		//this.clockwise(0.5);
	//})
	
	//.after(5000, function() {
		//this.stop();
	//})
	
	//.after(5000, function() {
		//this.counterClockwise(0.5);
	//})
	
	//.after(9000, function() {
		//this.front(0.2);
	//})
	
		//.after(5000, function() {
		//this.stop();
	//})
	
	client.after(4000, function() {
		client.land();
	});
}

function start(socket) 
{
  socket.emit('notification', 'Server online via socket!');
    
  socket.on('called', function () {
    console.log("Request received.");
    listener.sockets.emit('notification', 'Yes still here! Want some data?');
  });   

  socket.on('decolage', function(decolage) { start(decolage);} );
}

listener.sockets.on('connection', function (socket) { start(socket);} );

