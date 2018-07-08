new (function() {
  var ext = this;
	
	var descriptor = {
		blocks: [
			[' ', 'Load extension %m.name', 'loadExtension', '']
		],
		'menus': {
	'name': ['CASTLE', 'CAT', 'CLOUD', 'DESERT', 'FISH', 'LADYBIRD', 'MOON', 'SUN', 'TREE', 'ALL']
    },
    url: 'http://www.warwick.ac.uk/tilesfortales'
	};
	
	ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    
    ext.loadExtension = function(name) {
    	if(name == 'ALL') {
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=one');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=two');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=three');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=four');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=five');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=six');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=seven');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=eight');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=nine');
		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?name=ten');
    	}
    	else {
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name='+ name);
    	}
    }
    
    ext._shutdown = function() {};
	

ScratchExtensions.register('LOADER', descriptor, ext);})();
