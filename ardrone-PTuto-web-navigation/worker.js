var arDrone = require('ar-drone');
var client = arDrone.createClient();


var yaw;
var recupYaw;
var pitch;
var roll;


onmessage=function(event){
        
	if(event.name=="yaw"){
		yaw=event.data;
	}
	
	if(event.name=="roll"){
		roll=event.data;
	}
	
	if(event.name=="pitch"){
		pitch=event.data;
	}	
	
	if(event.name=="cmd"){
		terminate();
	}
};

	/*client.on('navdata', function(data) {
		if (!data.demo) return;
		pitch = data.demo.rotation.pitch;
		roll  = data.demo.rotation.roll;
		yaw   = data.demo.rotation.yaw;
	});*/


recupYaw=yaw;
	

while(true){
		//client.front(0.5);
			
			while(yaw > recupYaw + 2.0){
				console.log(activeStabi);
				client.counterClockwise(0.02);
				console.log("STABI YAW TOURNER G");
			}
			while(yaw < recupYaw - 2.0){
				console.log(activeStabi);
				client.clockwise(0.02);
				console.log("STABI YAW TOURNER D");
			}
			
			while(pitch < -2.0){
				console.log(activeStabi);
				client.back(0.02);
				console.log("STABI PITCH RECULER");
			}
			while(pitch > 2.0){
				console.log(activeStabi);
				client.front(0.02);
				console.log("STABI PITCH AVANCER");
			}
			
			while(roll < -3.0){
				console.log(activeStabi);
				client.right(0.02);
				console.log("STABI ROLL INC D");
			}
			while(roll > 1.5){
				console.log(activeStabi);
				client.left(0.02);
				console.log("STABI ROLL INC G");
			}
			
			
}