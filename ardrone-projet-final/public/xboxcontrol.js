var XBoxController = require('better-xbox-controller');
var USB = require('usb');
 
var device = USB.findByIds(0x045e,0x028e);
var controller = new XBoxController(device);
 
// setting event handlers 
//handling button events and setting the leds to corresponding pattern
controller.on 'button', (key, val) ->
  console.log "Button #{key} has been " + if val then 'pressed' else 'released'
  alert("Hello! I am an alert box!!");
  if val
    switch key
      when 'a' then controller.setLed 'LED_1'
      when 'b' then controller.setLed 'LED_2'
      when 'y' then controller.setLed 'LED_3'
      when 'x' then controller.setLed 'LED_4'
      when 'xBox' then controller.setLed 'ALTERNATING'
      when 'start' then controller.setLed 'ROTATING'
      when 'back' then controller.setLed 'BLINKING'
      else controller.setLed 'ALL_OFF'
 
 
 
 
//open the controller 
controller.open();



