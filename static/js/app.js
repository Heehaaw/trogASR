/**
 * Author: Janek Milota
 * Date: 9.01.2015
 */
(function($, document, window) {

	var idPrefix = 'x-id-';
	var idOrd = 0;

	var getNextId = function() {
		return idPrefix + idOrd++;
	};

	var loader = {
		show: function() {
			$('#loader').show();
		},
		hide: function() {
			$('#loader').fadeOut(500);
		},
		delayedHide: function(time) {
			$('#loader').delay(time).fadeOut(500);
		}
	};

	var components = [];

	var registerComponent = function(cmp) {

		if(!$.isPlainObject(cmp) || !$.isFunction(cmp.initComponent) || !$.isFunction(cmp.reset)) {
			throw 'The component cannot be registered to the app\'s init chain!';
		}

		cmp.isInitialized = false;
		components.push(cmp);

		return cmp;
	};

	var reset = function() {

		loader.show();

		for(var i = 0, len = components.length; i < len; i++) {
			var cmp = components[i];
			cmp.reset();
		}

		loader.delayedHide(1000);
	};

	var initialize = function() {

		for(var i = 0, len = components.length; i < len; i++) {
			var cmp = components[i];
			cmp.initComponent();
			cmp.isInitialized = true;
		}

		loader.delayedHide(1000);
	};

	$(window).load(initialize);

	var resizeHandle;

	$(window).resize(function() {
		loader.show();
		clearTimeout(resizeHandle);
		resizeHandle = setTimeout(function() {
			reset();
		}, 200);
	});

	$.app = $.extend($.app, {
		getNextId: getNextId,
		loader: loader,
		registerComponent: registerComponent,
		reset: reset
	});

})
(jQuery, document, window);