new (function() {
	var ext = this;
	ext.isReady = false;
 
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
		ext.url = "http://" + ext.IP;
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
  
  ext.internalStatus = function() {
  	$.ajax({
	      type: "GET",
	      async: true,
	      url: ext.url + "/ping",
	      success: function() {
	        ext.isReady = true;
	      },
	      error: function() {
	      	ext.isReady = false;
	      },
	      timeout: 500
	});
  }
  
  //ext.internalStatus();
  //setInterval(ext.internalStatus, 25000);
  
  ext._getStatus = function() {
  	/*
  	if(ext.isReady) {
  		return {status: 2, msg: 'Device connected'}
  	}
  	else {
  		return {status: 1, msg: ext.name + " not ready"};
  	}
  	*/
  	return {status: 2, msg: 'Device connected'}
  };

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
		ScratchExtensions.register("tile", descriptor, ext);
	}

})();
