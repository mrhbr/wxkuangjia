define(function(require, exports, module) {
	var evt = require('event');
	var router = require('router');
	var pageManager = require('pagemanager');
	var spaseedConfig = require('config');

    var init = function () {
    	pageManager.init();
    	//初始化路由
		router.init({
			'html5Mode': true,
			'pageManager': pageManager,
			'routes': {
				'/': 'loadRoot',
				'/*controller(/*action)(/*p1)(/*p2)(/*p3)(/*p4)': 'loadCommon'
			},
			'extendRoutes': spaseedConfig.extendRoutes
		});
    	//全局点击
		evt.addCommonEvent('click', { 
			'router': function () {
				var url = this.getAttribute("data-href");
				pageManager.redirect(url);
			},
			'back':function(){
				pageManager.back(this.getAttribute("data-href"));
			},
			'reload':function(){
				pageManager.reload();
			}
		});

	    //记录所有请求完毕
	    var win = window;
	    win.onload=function () {
	   		win.isOnload = true;
	    };

	    window.addEventListener('touchmove', function(event) {
		   if(!pageManager.container[0].contains(event.target)) {
			event.preventDefault(); }
		}, false);

		pageManager.container.on('touchstart',function(event){
			var startY,
				startTopScroll,
			 	deltaY,
				startY = event.touches[0].pageY,
				startTopScroll = this.scrollTop;

			if(startTopScroll <= 0)
				this.scrollTop = 1;

			if(startTopScroll + this.offsetHeight >= this.scrollHeight)
				this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
		})
    };

    module.exports = {init:init};
});
