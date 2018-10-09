define(function(require, exports, module) {
	var $ = require('$');
	var cookie = require('cookie');

	window.console = window.console || {log:function(){}};

	var from = '';

	;(function(){
		var result = /from=(\w+)/i.exec(window.location.search)
		if(result){
			from = result[1];
		}
	})()

	/**
	 * 工具类
	 * @class util
	 * @static
	 */
	var util = {

		getAtk:function(name){
			var _skey = cookie.get(name);
			if(_skey){
				var hash = 5381;

				for (var i = 0, len = _skey.length; i < len; ++i) {
					hash += (hash << 5) + _skey.charCodeAt(i);
				}
				return hash & 0x7fffffff;
			}		
		},

		/**
		 * 是否移动手机
		 * @method isMobile
		 * @return {boolean} true|false
		 */
		isMobile: function () {
			return this.isAndroid() || this.isIOS();
		},

		/**
		 * 是否android
		 * @method isAndroid
		 * @return {boolean} true|false
		 */
		isAndroid: function () {
			return /android/i.test(window.navigator.userAgent);

		},

		/**
		 * 是否ios
		 * @method isIOS
		 * @return {boolean} true|false
		 */
		isIOS: function () {
			return /iPod|iPad|iPhone/i.test(window.navigator.userAgent);
		},

		/**
		 * 获取a标签href相对地址
		 * @method getHref
		 * @param  {Object} item dom节点
		 * @return {String} href
		 */
		getHref: function (item) {
			var href = item.getAttribute('href', 2);
			href = href.replace('http://' + location.host, '');
			return href;
		},

		/**
		 * 深度拷贝对象
		 * @method cloneObject
		 * @param  {Object} obj 任意对象
		 * @return {Object} 返回新的拷贝对象
		 */
		cloneObject: function (obj) {
			var o = obj.constructor === Array ? [] : {};
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					o[i] = typeof obj[i] === "object" ? this.cloneObject(obj[i]) : obj[i];
				}
			}
			return o;
		},

		/**
		 * 模拟滚动
		 * @method emulateScroll
		 * @param  {Object} scrollElem 任意对象
		 */
		emulateScroll:function(scrollElem){
			var startMove = false,
                initY = 0,
                containerInitY = 0,
                containerMoveY = 0;

            scrollElem.on('touchstart',function(evt){
                startMove = true;
                initY = evt.touches[0].clientY;
            });
            scrollElem.on('touchmove',function(evt){
                if(startMove){
                    var disY = evt.touches[0].clientY - initY;
                    containerMoveY = containerInitY + disY;
                    var max = scrollElem.prop('clientHeight')-scrollElem.prop('scrollHeight');
                    var val = 0;
                    if(containerMoveY < 0 && containerMoveY > max){
                    	val = containerMoveY;
                    }
                    else if(containerMoveY>0){
                    	val = 0;
                        containerMoveY = 0;
                    }
                    else if(containerMoveY<max){
                    	val = max;
                        containerMoveY = max;
                    }
                    else{
                    	val = containerMoveY;
                        containerMoveY = containerInitY;
                    }
                    scrollElem.children(':first-child').css('-webkit-transform','translate3d(0,'+val+'px,0)');

                    //$('.title').text(val + ' | ' + max + ' | ' + );

                    //把移动的值，写入属性中
                    scrollElem.attr('data-scrolltop',-val);
                    //scrollElem.scrollTop(-val);
                    var evt = $.Event('scroll');
					scrollElem.trigger(evt);
                }
            });
            scrollElem.on('touchend',function(){
                startMove = false;
                containerInitY = containerMoveY;
                containerMoveY = 0;
            });
		},

		/**
		 * 插入内部样式
		 * @method insertStyle
		 * @param  {string | Array} rules 样式
		 * @param  {string} id 样式节点Id
		 */
		insertStyle: function (rules, id) {
			var _insertStyle = function () {
				var doc = document,
					node = doc.createElement("style");
				node.type = 'text/css';
				id && (node.id = id);
				document.getElementsByTagName("head")[0].appendChild(node);
				if (rules) {
					if (typeof(rules) === 'object') {
						rules = rules.join('');
					}
					if (node.styleSheet) {
						node.styleSheet.cssText = rules;
					} else {
						node.appendChild(document.createTextNode(rules));
					}
				}
			};
			if (id) {
				!document.getElementById(id) && _insertStyle();
			} else {
				_insertStyle();
			}
		},
		/**
		 *统计分享时，生成随机UID	
		 * @method getRandom
		 * @param  {string} pre 前缀
		*/ 
		getRandom:function(pre){
			var pre=pre||'';
			return pre+(Math.round((Math.random()||0.5) * 2147483647) * (+new Date())) % 10000000000;
		}
	};

	
	;(function(){
	
		var ua = navigator.userAgent;
		var isApp = /TTING/.test(ua);

		if(isApp){
			if(util.isIOS()){
				from = "iosapp"
			}
			else if(util.isAndroid()){
				from = "androidapp"
			}
		}
	})();
	

	module.exports = util;
});
