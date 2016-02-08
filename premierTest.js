var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.takeoff();


client
	
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
	
	.after(4000, function() {
		this.land();
	});
	
	