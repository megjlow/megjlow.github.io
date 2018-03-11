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
			[' ', ext.ip + ': setPinMode %m.pin', 'setPinMode', 'setPinMode', 0, 'output'],
	      		[' ', ext.ip + ': digital pin %m.pin setting %m.dsetting', 'setDigital', '1', 'off'],
	      		[' ', ext.ip + ': pwm pin %m.ppin setting %n', 'setPwm', '1', '100'],
	      		[' ', ext.ip + ': digital pin %m.pin get', 'getDigital', '1'],
	      		[' ', ext.ip + ': pwm pin %m.ppin get', 'getPwm', '1']
	    	],
	    	'menus': {
	      		'pin': ['1', '2', '3'],
	      		'dsetting': ['on', 'off'],
	      		'ppin': ['1', '2']
	     	},
	    	url: 'http://www.warwick.ac.uk/tilesfortales'
	  	};
  	}

  ext._shutdown = function() {};
  
  ext.setPinMode(pin, mode) {
    console.log("setPinMode " + pin);
    console.log("setPinMode " + mode);
  }
  
  ext.isConnected = function() {
    var retval = false;
    if(ext.socket != null && ext.socket.readyState == ext.socket.OPEN) {
      retval = true;
    }
    return retval;
  }
  
  ext.disconnect = function() {
    ext.socket.close();
    ext.socket = null;
  }
  
  ext.onMessage = function(evt)
  {
    console.log("Received: " + evt.data);
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
	//CONNECTING OPEN CLOSING or CLOSED
	
  ext.connect = function() {
    if(ext.socket == null) {
      ext.socket = new WebSocket("ws://" + ext.ip, 'arduino');
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
  
  	ext.getDigital = function(pin) {
	};
	
	ext.setDigital = function(pin, setting) {
	    var s = 1;
	    if(setting == 'off') {
	      s = 0;
	    }
	    var p = 12;
	    if(pin == 1) {
	      p = 12;
	    }
	    else if(pin == 2) {
	      p = 13;
	    }
	    else if(pin == 3) {
	      p = 14;
	    }
	    var url = ext.url + '/gpio' + p + '/' + s; 
		$.ajax({
			type: 'POST', 
			url: url,
			success: function(response) {
			},
			timout: 1500
		});
	};
	
	if(ext.name != undefined) {
		ScratchExtensions.register(ext.name, descriptor, ext);
	}
	else {
		ScratchExtensions.register(ext.ip, descriptor, ext);
	}

})();
