/**
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($, document) {

	var templateCache = {};

	var process = function(str, data, as$) {

		var processFn = !/\W/.test(str)
			? templateCache[str] = templateCache[str] || process(document.getElementById(str).innerHTML)
			: new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};"
			+ "with(obj){p.push('"
			+ str.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\n")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\n").join("\\'")
			+ "');}return p.join('');");

		if(data) {
			data.id = data.id || $.app.getNextId();
			var result = processFn(data);
			return as$ ? $(result) : result;
		}
		else {
			return processFn;
		}
	};

	var me = {
		initComponent: function() {
		},
		reset: function() {
		},
		process: process
	};

	$.app.templates = $.app.registerComponent(me);

})(jQuery, document);