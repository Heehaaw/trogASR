(function ($) {

	// registering a jQuery widget
	$.app = {};

	var idPrefix = 'x-id-';
	var idOrd = 0;

	$.app.getNextId = function () {
		return idPrefix + idOrd++;
	};

	$.app.loader = {
		show: function () {
			$('#loader').show();
		},
		hide: function () {
			$('#loader').hide();
		}
	};

	var templateCache = {};

	$.app.templates = {
		process: function (str, data) {
			var me = this;
			var processFn =
				!/\W/.test(str)
					? templateCache[str] = templateCache[str] || me.process(document.getElementById(str).innerHTML)
					: new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +
					"with(obj){p.push('" +
					str
						.replace(/[\r\t\n]/g, " ")
						.split("<%").join("\t")
						.replace(/((^|%>)[^\t]*)'/g, "$1\r")
						.replace(/\t=(.*?)%>/g, "',$1,'")
						.split("\t").join("');")
						.split("%>").join("p.push('")
						.split("\r").join("\\'")
					+ "');}return p.join('');");

			if (data) {
				if (!data.id) {
					data.id = $.app.getNextId();
				}
				return processFn(data);
			} else {
				return processFn;
			}
		}
	};

	var components = [];

	$.app.registerInitEvent = function (cmp) {
		if (!$.isPlainObject(cmp) || !$.isFunction(cmp.initComponent)) {
			throw 'The component cannot be registered to the app init chain!';
		}
		cmp.isInitialized = false;
		components.push(cmp);
		return cmp;
	};


	$(function () {

		for (var i = 0, len = components.length; i < len; i++) {
			var cmp = components[i];
			cmp.initComponent();
			cmp.isInitialized = true;
		}

		$.app.loader.hide();
	});
})(jQuery);