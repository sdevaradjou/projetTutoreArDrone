// Tout d'abbord on initialise notre application avec le framework Expres

var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();

mission.takeoff()
		//console.log("zero")
       .zero()       // Sets the current state as the reference
	   //console.log("hover")
	   .hover(2000)  // Hover in place for 1 second
	   //console.log("go")
	   .go({x:0.5,y:0})
	   //console.log("hover")
       .hover(2000)  // Hover in place for 1 second
	   //console.log("retour")
	   .go({x:0,y:0})
	   //console.log("land")
       .land();

mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("Mission success!");
        process.exit(0);
    }
});