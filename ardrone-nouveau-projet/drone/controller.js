/**
 * Created with JetBrains WebStorm.
 * User: rohitghatol
 * Date: 6/29/13
 * Time: 6:32 PM
 * To change this template use File | Settings | File Templates.
 */

 

 
//var io = require('socket.io').listen(3002);
//io.set('log level', 1);



//io.sockets.on('connection', function (socket) {
	   
//socket.emit('connect');
	
    var arDrone = require('ar-drone');
    var client = arDrone.createClient();

  /*  setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);*/

   // socket.on('decol', function () {
       // if(data.name=="takeoff"){
		   
//function decollage() {
   	//document.write("<H1>Et ceci du Javascript</H1>");
    console.log("Browser asked Ar Drone to Take Off");
	
	client.takeoff();
		
	client.after(10000, function() {
		this.land();
	}); 
			
//}	
            
       // }
      /*  if(data.name=="spin"){
            console.log("Browser asked Ar Drone to Start Spinning");
            client.clockwise(1);
        }
        if(data.name=="stop"){
            console.log("Browser asked Ar Drone to Stay and Hover");
            client.stop();
        }
        if(data.name=="land"){
            console.log("Browser asked Ar Drone to Land");
            client.land();
        }*/

    //});
//});

