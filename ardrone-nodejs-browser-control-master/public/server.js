/**
 * Created with JetBrains WebStorm.
 * User: rohitghatol
 * Date: 6/29/13
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */


 
var express = require('express')
    , app = express()
    , server = require("http").createServer(app)
	
var arDrone = require('ar-drone');
var client = arDrone.createClient();
	
app.use(express.static(__dirname + '/public'));


require("./drone/camera-feed");
require("./drone/controller");

app.listen(3000);

function decollage(){

console.log("je suis la dans la fonction decollage()");
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
	

}





