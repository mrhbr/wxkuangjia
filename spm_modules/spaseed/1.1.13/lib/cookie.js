
define(function(require, exports, module) {

	var cookie = {
		get:function(name){
			var cookieStr = document.cookie;
			var reg = new RegExp(name + '=(.*?)(;|$)');
			var val = reg.exec(cookieStr);

			return val && val[1];
		},

		set:function(name, value, params){
			var sCookie = name + '=' + encodeURIComponent(value), 
				p = params,
				etime;

			if (p && p.expires && p.expires !== "session") {
				etime = new Date();
				if (p.expires instanceof Date) { etime = p.expires;}
				else if (!isNaN(p.expires)) { etime.setTime(etime.getTime() + p.expires);}
				else if (p.expires === "hour") { etime.setHours(etime.getHours() + 1);}
				else if (p.expires === "day") { etime.setDate(etime.getDate() + 1);}
				else if (p.expires === "week") { etime.setDate(etime.getDate() + 7);}
				else if (p.expires === "year") { etime.setFullYear(etime.getFullYear() + 1);}
				else if (p.expires === "forever") { etime.setFullYear(etime.getFullYear() + 120);}
				else { etime = p.expires;}
				sCookie += "; expires=" + etime.toUTCString();
			}
			
			sCookie += (p && p.path) ? "; path=" + p.path : "; path=/";
			if(p && p.domain) sCookie += "; domain=" + p.domain;
			(p && p.secure) ? sCookie += "; secure=" + p.secure : null;
			
			document.cookie = sCookie;
		},

		'delete':function(name){
			if(!name) return;
			this.set(name, '', {"expires":new Date(0)});
		}
	};

	module.exports = cookie;
});
