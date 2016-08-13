/*
Load a block from github.io.
Accepts a url as a parameter which can include url parameters e.g. https://megjlow.github.io/extension2.js?name=SUN&ip=10.0.0.1
*/

new (function() {
	var ext = this;
	
	var descriptor = {
    	blocks: [
      		[' ', 'Load extension block %s', 'loadBlock', 'url', 'url'],
    	],
    	url: 'http://www.warwick.ac.uk/tilesfortales'
  	};
  
  	ext._shutdown = function() {};
  	
  	ext._getStatus = function() {
  		return {status: 2, msg: 'Device connected'}
  	};
  	
  	ext.loadBlock = function(url) {
  		ScratchExtensions.loadExternalJS(url);
  	};
  	
  	ScratchExtensions.register("extensionloader", descriptor, ext);
	
});