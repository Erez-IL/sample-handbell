/*
 * Copyright (c) 2012, Intel Corporation
 * File revision: 12 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */
 
var accelID=null;
var frequency = 100;  // frequency to update acceleration

var bellleftring = null;
var bellrightring = null;
var bellleft = null;
var bellright = null;
var bellcenter = null;

var bellsound = null;
var bellend = null;

var side = 1; //default side is right

//handles the body onLoad event
function onLoad(){
	// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);
	//initialization
	bellrightring = document.getElementById("bellrightring");
	bellleftring = document.getElementById("bellleftring");
	bellleft = document.getElementById("bellleft");
	bellright = document.getElementById("bellright");
	bellcenter = document.getElementById("bellcenter");
}
// Cordova is ready
function onDeviceReady() {
	var path = getPhoneGapPath();
	//media initialization
	bellsound = new Media(path + "resource/bell.mp3",
			onRingSuccess(bellsound), onRingError);
	bellend = new Media(path + "resource/bell-end.mp3",
			onRingSuccess(bellend), onRingError);
    var options = { frequency: frequency };

    accelID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

}
//determines the path to the media files on the device
function getPhoneGapPath() {

    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return path;

};
//determines moving sign
function sign(val, delta) {
    if (typeof delta == undefined) delta=0
    if (val>0 && Math.abs(val)-delta > 0) return 1;
    else if (val<0 && Math.abs(val)-delta > 0) return -1;
    else return 0;
}

var previous = null;
var accelerated = false;

//get the snapshot of the current acceleration and move/stop bell
function onSuccess(acceleration) {
    var x = acceleration.x;
    var y = acceleration.y;
    var z = acceleration.z;
    var t = false;
    if (previous){
	    if (isShaking(previous, acceleration, 10)){    	
	    	moveBell(sign(x));	
	    	bellsound.play();
	    	accelerated = true;
	    }
	    else {
	    	stopBell(acceleration);
	    	if (accelerated == true){
	    		bellend.play();
	    	}
	    	accelerated = false;
	    }
	}
       	   
    previous = acceleration;
}
//determines if the shake event has been occured
function isShaking(last, current, threshold) {
	 var deltaX = Math.abs(last.x - current.x),
	     deltaY = Math.abs(last.y - current.y),
	     deltaZ = Math.abs(last.z - current.z);
         return ((deltaX > threshold && deltaY > threshold) ||
	                    (deltaX > threshold && deltaZ > threshold) ||
	                    (deltaY > threshold && deltaZ > threshold) || deltaX > threshold);    
	}
//hide element
function hide(obj) {
	obj.style.display = 'none';
}
//show element
function show(obj) {
	obj.style.display = 'block';
}
//move bell and show ring
function moveBell(dir) {
	switch (side) {
	case 0:
		hide(bellcenter);
		break;
	case 1:
		hide(bellright);
		hide(bellrightring);
		break;
	case -1:
		hide(bellleft);
		hide(bellleftring);
		break;
	}
	if (side)
		side *= -1;
	else
		side = dir;
	switch (side) {
	case 0:
		show(bellcenter);
		break;
	case 1:
		show(bellright);
		show(bellrightring);
		break;
	case -1:
		show(bellleft);
		show(bellleftring);
		break;
	}
}
//stop bell
function stopBell(curAccelerometer) {

	switch (side) {
	case 0:
		break;
	case 1:
		hide(bellrightring);
		break;
	case -1:
		hide(bellleftring);
		break;
	}
	if (curAccelerometer){		
		if (typeof curAccelerometer != undefined) {
			var x = sign(curAccelerometer.x, 3);
			hide(bellcenter);
			hide(bellright);
			hide(bellleft);
	
			switch (x) {
			case 0:
				show(bellcenter);
				break;
			case 1:
				show(bellright);
				break;
			case -1:
				show(bellleft);
				break;
			}
		}
	}
}
//onRingSuccess Callback
function onRingSuccess(media) {
	if (media){
	media.release();
	}
	console.log("Media API Success");
}
// onRingError Callback 
function onRingError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}
// onError Callback
function onError() {
    alert('Device error happened!');
}