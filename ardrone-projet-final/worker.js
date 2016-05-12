var arDrone = require('ar-drone');
var client = arDrone.createClient();


var yaw;
var recupYaw;
var pitch;
var roll;
var altitude;

onmessage=function(event){
        
	if(event.name=="yaw"){
		yaw=event.data;
	}
	
	if(event.name=="altitude"){
		altitude=event.data;
	}
	
	if(event.name=="roll"){
		roll=event.data;
	}
	
	if(event.name=="pitch"){
		pitch=event.data;
	}	
	
	if(event.name=="cmd"){
		close();
	}
};

	/*client.on('navdata', function(data) {
		if (!data.demo) return;
		pitch = data.demo.rotation.pitch;
		roll  = data.demo.rotation.roll;
		yaw   = data.demo.rotation.yaw;
	});*/


recupYaw=yaw;
recupAltitude=altitude;

	while(true){
		
			while(yaw > recupYaw + 2.0){
				client.counterClockwise(0.1);
			}
			
			while(yaw < recupYaw - 2.0){
				client.clockwise(0.1);
			}
			
			while(roll < -2.0){
				client.right(0.1);
			}
			
			while(roll > 2.0){
				client.left(0.1);
			}
			
			while(pitch < -2.0){
				client.back(0.05);
			}
			
			while(pitch > 2.0){
				client.front(0.05);
			}
			
			// while(altitude > recupAltitude + 0.05){
				// client.down(0.06);
			// }
			
			// while(altitude < recupAltitude - 0.05){
				// client.up(0.06);
			// }			
	}