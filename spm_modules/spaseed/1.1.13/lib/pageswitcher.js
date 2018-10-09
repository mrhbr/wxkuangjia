define(function(require, exports, module) {
	var spaseedConfig = require('config');
	
	var pageswitcher = {
		switchMode:spaseedConfig.switchMode || 'none',
		method : {
			slideLeft:{
				elemIn:{
					cssBefore:{
	        			'position':'absolute',
	        			'z-index':'15',
	        			'top':'0',
	        			'left':'0',
	        			'transform':'translateX(100%) translateZ(0)',
	        			'transition':'transform .4s ease',
	        			'width':'100%',
	        			'height':'100%'
	        		},
	        		cssAfter:{
	        			'transform':''
	        		},
	        		duration:600
	        	},
	        	elemOut:{
	        		cssBefore:{
	        			'transition':'transform 1.6s ease',
	        			'transform':'translateX(0) translateZ(0)'
	        		},
	        		cssAfter:{
	        			'transform':'translateX(-100%) translateZ(0)'
	        		},
	        		duration:1600
	        	}
			},
			slideRight:{
				elemIn:{
					cssBefore:{
	        			'position':'absolute',
	        			'z-index':'15',
	        			'top':'0',
	        			'left':'0',
	        			'transform':'translateX(-100%) translateZ(0)',
	        			'transition':'transform .4s ease',
	        			'width':'100%',
	        			'height':'100%'
	        		},
	        		cssAfter:{
	        			'transform':''
	        		},
	        		duration:600
	        	},
	        	elemOut:{
	        		cssBefore:{
	        			'transition':'transform 1.6s ease',
	        			'transform':'translateX(0) translateZ(0)'
	        		},
	        		cssAfter:{
	        			'transform':'translateX(100%) translateZ(0)'
	        		},
	        		duration:1600
	        	}
			},
			fadeIn:{
				elemIn:{
					cssBefore:{
	        			'position':'absolute',
	        			'z-index':'15',
	        			'top':'0',
	        			'left':'0',
	        			'transition':'opacity .4s ease',
	        			'opacity':'0',
	        			'width':'100%',
	        			'height':'100%'
	        		},
	        		cssAfter:{
	        			'opacity':'1'
	        		},
	        		duration:600
	        	},
	        	elemOut:{
	        		cssBefore:{
	        			'transition':'opacity 1.6s ease',
	        			'opacity':'1',
	        		},
	        		cssAfter:{
	        			'opacity':'0'
	        		},
	        		duration:1600
	        	}
			}
		}
	};

	module.exports = pageswitcher;
});