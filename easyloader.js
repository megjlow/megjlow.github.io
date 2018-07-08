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
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.201');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.202');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.203');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.204');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.205');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.206');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.207');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.208');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.209');
		ScratchExtensions.loadExternalJS('http://megjlow.github.io/socket2.js?ip=192.168.10.210');
    	}
    	else {
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name='+ name);
    	}
    }
    
    ext._shutdown = function() {};
	

ScratchExtensions.register('LOADER', descriptor, ext);})();
