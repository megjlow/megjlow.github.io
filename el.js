/*
Load a block from github.io.
Accepts a url as a parameter which can include url parameters e.g. https://megjlow.github.io/extension2.js?name=SUN&ip=10.0.0.1
*/

new (function() {
	var ext = this;
	
	var descriptor = {
    	blocks: [
      		[' ', 'Load extension block ip %s', 'loadBlock', 'ip', 'ip'],
			[' ', 'Load extension block name %s', 'loadBlock', 'name', 'name'],
    	],
    	url: 'http://www.warwick.ac.uk/tilesfortales'
  	};
  
  	ext._shutdown = function() {};
  	
  	ext._getStatus = function() {
  		return {status: 2, msg: 'Device connected'}
  	};
  	
  	ext.loadBlock = function(ip) {
  		ScratchExtensions.loadExternalJS("https://megjlow.github.io/socket.js?ip=" + ip);
  	};
	
	ext.loadBlockName = function(name) {
  		ScratchExtensions.loadExternalJS("https://megjlow.github.io/socket.js?name=" + name);
  	};
  	
  	ScratchExtensions.register("extensionloader", descriptor, ext);
	
});