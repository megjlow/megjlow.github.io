new (function() {
	var ext = this;
	
	var descriptor = {
    	blocks: [
      		[' ', 'Load extension block %s', 'loadBlock', 'block', 'url'],
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