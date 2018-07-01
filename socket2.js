new (function() {
	var ext = this;
	var ext.socket = null;
  
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
			[' ', ext.name != null ? ext.name : ext.ip + ': connect', 'connect'],
			[' ', ext.name != null ? ext.name : ext.ip + ': disconnect', 'disconnect'],
			['b', ext.name != null ? ext.name : ext.ip + ': isConnected', 'isConnected'],
			[' ', ext.name != null ? ext.name : ext.ip + ': digital pin %m.pin setting %m.dsetting', 'setDigital', '1', 'off'],
			[' ', ext.name != null ? ext.name : ext.ip + ': pwm pin %m.ppin setting %n', 'setPwm', '1', '100'],
			[' ', ext.name != null ? ext.name : ext.ip + ': digital pin %m.pin get', 'getDigital', '1'],
			[' ', ext.name != null ? ext.name : ext.ip + ': pwm pin %m.ppin get', 'getPwm', '1']
		],
		'menus': {
		'pin': ['1', '2', '3'],
		'dsetting': ['on', 'off'],
		'ppin': ['1', '2']
		},
		url: 'http://www.warwick.ac.uk/tilesfortales'
	};
	
	ext.connect = function() {
		if(ext.socket == null) {
			ext.socket = new WebSocket("ws://" + ext.ip, 'firmata');
			ext.socket.binaryType = "arraybuffer";
			ext.socket.onopen = function(evt) {ext.onOpen(evt)};
			ext.socket.onmessage = function(evt) {ext.onMessage(evt)};
			ext.socket.onclose = function(evt) {ext.onClose(evt)};
		}
		else if(ext.socket.readyState == ext.socket.CLOSING || ext.socket.readyState == ext.socket.CLOSED) {
			ext.socket = null;
			ext.connect();
		}
		// if socket is in open or connecting state we're not going to do anything
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
  
  if(ext.name != undefined) {
		ScratchExtensions.register(ext.name, descriptor, ext);
	}
	else {
		ScratchExtensions.register(ext.ip, descriptor, ext);
	}
  
})();
