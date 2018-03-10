new (function() {
	var socket = null;
	var connectionStatus = {status: 1, msg: ext.name + " not ready");
	var ext = this;
 
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
	
	console.log('name ' + ext.name);
	
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

  ext._shutdown = function() {};
  ext._getStatus = function() {
    return connectionStatus;
  };

  ext.getPwm = function(pin) {
  };
  ext.setPwm = function(pin, setting) {
    var p = 4;
    if(pin == 2) {
      p = 5;
    }
    var url = 'http://' + ext.name + '/gpio' + p + '/' + setting;
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
	    var url = 'http://' + ext.name + '/gpio' + p + '/' + s; 
		$.ajax({
			type: 'POST', 
			url: url,
			success: function(response) {
			}
		});
	};
	
	ScratchExtensions.register(ext.name, descriptor, ext);

})();
