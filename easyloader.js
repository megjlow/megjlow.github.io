new (function() {
  var ext = this;
	
	var descriptor = {
		blocks: [
			[' ', 'Load extension %m.name', 'loadExtension', '']
		],
		'menus': {
      'name': ['SUN', 'CLOUD', 'MOON', 'CASTLE', 'TREE', 'DESERT', 'FISH', 'CAT', 'LADYBIRD', 'ALL']
    },
    url: 'http://www.warwick.ac.uk/tilesfortales'
	};
	
	ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    
    ext.loadExtension = function(name) {
    	if(name == 'ALL') {
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=SUN');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=CLOUD');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=MOON');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=CASTLE');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=TREE');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=DESERT');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=FISH');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=CAT');
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name=LADYBIRD');
    	}
    	else {
    		ScratchExtensions.loadExternalJS('http://megjlow.github.io/extension2.js?name='+ name);
    	}
    }
    
    ext._shutdown = function() {};
	

ScratchExtensions.register('LOADER', descriptor, ext);})();
