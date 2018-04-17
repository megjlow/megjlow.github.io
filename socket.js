/*
Requires parameters so load https://megjlow.github.io/extensionloader.js and use that block to load this one.
Parameters are:
name - 	If you have a router set up which will assign the same IP address to a tile every time and will do DNS then the tile can be addressed
		by name e.g. http://SUN/XXX will work if SUN resolves to the IP address of a tile e.g. https://megjlow.github.io/extension2.js?name=SUN
ip -	If you don't have a router set up to assign the same IP address to a tile every time or you don't have DNS which will resolve the tile
		name then use the IP parameter e.g. https://megjlow.github.io/extension2.js?ip=10.0.0.1 will load the tile extension which communicates
		with a tile at the IP address 10.0.0.1
		
If both name and ip are supplied then name will be used before ip.
Digital pins 1, 2 and 3 map to the Feather Huzzah pins 12, 13 and 14
Pwm pins 1 and 2 map to the Feather Huzza pins 4 and 5
*/

new (function() {
	var ext = this;
	ext.isReady = false;
	ext.socket = null;
 
 	var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(document.currentScript.src.split("?")[1]),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;
	
	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');
	
	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	};

	ext.name = getUrlParameter('name');
	ext.ip = getUrlParameter('ip');
	
	if(ext.name != undefined) {
		// we'll use the name supplied by preference
		ext.url = "http://" + ext.name;
		console.log('got name');
	}
	else {
		// no name supplied so use the IP address
		ext.url = "http://" + ext.ip;
		console.log("didn't get name");
	}
	
	console.log('name ' + ext.name);
	console.log('ip ' + ext.ip);
	console.log('using url ' + ext.url);
	
	var descriptor = {
    	blocks: [
      		[' ', ext.name + ': digital pin %m.pin setting %m.dsetting', 'setDigital', '1', 'off'],
      		[' ', ext.name + ': pwm pin %m.ppin setting %n', 'setPwm', '1', '100'],
      		[' ', ext.name + ': digital pin %m.pin get', 'getDigital', '1'],
      		[' ', ext.name + ': pwm pin %m.ppin get', 'getPwm', '1']
    	],
    	'menus': {
      		'pin': ['1', '2', '3'],
      		'dsetting': ['on', 'off'],
      		'ppin': ['1', '2']
     	},
    	url: 'http://www.warwick.ac.uk/tilesfortales'
  	};
  	
  	if(ext.name == undefined) {
  		var descriptor = {
	    	blocks: [
				[' ', ext.ip + ': connect', 'connect'],
				[' ', ext.ip + ': disconnect', 'disconnect'],
				['b', ext.ip + ': isConnected', 'isConnected'],
				[' ', ext.ip + ': setPinMode %m.pin %m.io %m.ioMode', 'setPinMode', 0, 'output', 'digital'],
	      		[' ', ext.ip + ': digital pin %m.pin setting %m.dsetting', 'setDigital', '1', 'off'],
	      		[' ', ext.ip + ': pwm pin %m.ppin setting %n', 'setPwm', '1', '100'],
	      		['R', ext.ip + ': digital pin %m.pin get', 'getDigital', '1'],
	      		[' ', ext.ip + ': pwm pin %m.ppin get', 'getPwm', '1']
	    	],
	    	'menus': {
	      		'pin': ['1', '2', '3'],
	      		'dsetting': ['on', 'off'],
	      		'ppin': ['1', '2'],
				'io': ['output', 'input'],
				'ioMode': ['digital', 'pwm']
	     	},
	    	url: 'http://www.warwick.ac.uk/tilesfortales'
	  	};
  	}

  ext._shutdown = function() {};
  
  ext.setPinMode = function(pin, mode) {
    console.log("setPinMode " + pin);
    console.log("setPinMode " + mode);
    var bytearray = new Uint8Array(3);
    /*
    bytearray[0] = 0xF0;
    bytearray[1] = 0x69;
    bytearray[2] = 0xF7;
    ext.socket.send(bytearray.buffer);
    */
    
    bytearray[0] = 0xF4;// PIN_MODE;
    bytearray[1] = pin;
    bytearray[2] = 0x01; // output
    ext.socket.send(bytearray.buffer);
    
    console.log("sent");
    
  }
  
  ext.isConnected = function() {
    var retval = false;
    if(ext.socket != null && ext.socket.readyState == ext.socket.OPEN) {
      retval = true;
    }
    return retval;
  }
  
  ext.disconnect = function() {
    if(ext.socket != null) {
      ext.socket.close();
      ext.socket = null;
    }
  }
  
  ext.onMessage = function(evt)
  {
    var dv = new DataView(evt.data);
    var r = "received message: ";
    for(var i=0; i<dv.byteLength; i++) {
    	r = r + " " + dv.getUint8(i).toString(16);
    }
    // 6e PIN_STATE_RESPONSE
   	console.log(r);
  }
  
  ext.doSend = function(message)
  {
    console.log("SENT: " + message);
    ext.socket.send(message);
  }
  
  ext.onOpen = function(evt)
  {
    console.log("Connected");
    ext.doSend("WebSocket rocks");
  }
  
  ext.onClose = function(evt) {
    ext.socket = null;
  }
  
  ext._getStatus = function() {
    var retval = {status: 1, msg: 'Not Connected'};
    if(ext.socket != null && ext.socket.readyState == ext.socket.OPEN) {
      retval = {status: 2, msg: 'Device connected'};
    }
    return retval;
  };
	
  ext.connect = function() {
    if(ext.socket == null) {
      ext.socket = new WebSocket("ws://" + ext.ip, 'firmata');
      ext.socket.binaryType = "arraybuffer";
      ext.socket.onopen = function(evt) {ext.onOpen(evt)};
      ext.socket.onmessage = function(evt) {ext.onMessage(evt)};
      ext.socket.onclose = function(evt) {ext.onClose(evt)};
    }
    else {
      if(ext.socket.readyState == ext.socket.CLOSING || ext.socket.readyState == ext.socket.CLOSED) {
	ext.socket = null;
        ext.connect();
      }
    }
    // if socket is in open or connecting state we're not going to do anything
  }

  ext.getPwm = function(pin) {
  };
  ext.setPwm = function(pin, setting) {
    var p = 4;
    if(pin == 2) {
      p = 5;
    }
    var url = ext.url + '/gpio' + p + '/' + setting;
    $.ajax({
      type: 'POST',
      url: url,
      success: function(response) {
      }
    });
    setTimeout(function(){ }, 10);
  };
  
  	ext.getDigital = function(pin, callback) {
  		var bytearray = new Uint8Array(4);
  		bytearray[0] = 0xF0; // Start sysex
  		bytearray[1] = 0x6D; // PIN_STATE_QUERY  
  		bytearray[2] = pin;
  		bytearray[3] = 0xF7; // end sysex
  		//ext.socket.send(bytearray);
  		//f1();
		ext.pinCallback1 = callback;
		console.log("ext.getDigitalAsync");
		setTimeout(() => { ext.pinCallback1(10); }, 2000);
		console.log("ext.getDigital complete");
		//setTimeout(() => { callback(10); }, 2000);
	};
	
	ext.setDigital = function(pin, setting) {
	    var s = 1;
	    if(setting == 'off') {
	      s = 0;
	    }
	    var bytearray = new Uint8Array(3);
	    bytearray[0] = 0xF5; // set digital pin value
	    bytearray[1] = pin;
	    bytearray[2] = s;
	    
	    ext.socket.send(bytearray);
	    
	    console.log("setDigital");
	};
	
	if(ext.name != undefined) {
		ScratchExtensions.register(ext.name, descriptor, ext);
	}
	else {
		ScratchExtensions.register(ext.ip, descriptor, ext);
	}

})();
