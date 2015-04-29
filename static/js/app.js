/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * The main trogASR app object
 *
 * Author: Janek Milota
 * Date: 9.01.2015
 * @namespace
 */
APP = APP || {};

(function($, document, window, app) {

	// We want to auto-generate template elements' ids. This is the generated prefix...
	var idPrefix = 'x-id-';
	// ... and this is the self-incrementing suffix
	var idOrd = 0;

	/**
	 * Generates next id
	 * @returns {string} generated id
	 */
	var getNextId = function() {
		return idPrefix + idOrd++;
	};

	/**
	 * The application loader container. Used for obstructing the view as app preparations go on in the background
	 * @type {{show: Function, hide: Function, delayedHide: Function}}
	 */
	var loader = {
		/**
		 * Shows the loader
		 */
		show: function() {
			$('#loader').show();
			$('#logoLoader').removeClass('hidden');
		},
		/**
		 * Hides the loader
		 */
		hide: function() {
			$('#loader').fadeOut(500);
			$('#logoLoader').addClass('hidden');
		},
		/**
		 * Delays the loader's hiding by said time
		 * @param time time to delay the hiding by
		 */
		delayedHide: function(time) {
			$('#loader').delay(time).fadeOut(500);
			setTimeout(function() {
				$('#logoLoader').addClass('hidden');
			}, time);
		}
	};

	/**
	 * Gets the loader
	 * @returns {{show: Function, hide: Function, delayedHide: Function}}
	 */
	var getLoader = function() {
		return loader;
	};

	/**
	 * Creates a browser cookie
	 * @param name cookie name
	 * @param value cookie value
	 * @param days days the cookie will be valid
	 */
	var createCookie = function(name, value, days) {
		var expires;
		if(days) {
			// Prepare the validity timespan
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		else {
			expires = "";
		}
		// Register the cookie
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	};

	/**
	 * Reads a previously stored browser cookie
	 * @param name name of the cookie to read
	 * @returns {string} value of the cookie
	 */
	var readCookie = function(name) {
		var cookieValue = null;
		//noinspection JSValidateTypes
		if(document.cookie && document.cookie != '') {
			// Some cookie is set, find the right one
			var cookies = document.cookie.split(';');
			for(var i = 0, len = cookies.length; i < len; i++) {
				var cookie = $.trim(cookies[i]);
				var offset = name.length + 1;
				if(cookie.substring(0, offset) == (name + '=')) {
					// We found the cookie -> process the raw value and return it
					cookieValue = decodeURIComponent(cookie.substring(offset));
					break;
				}
			}
		}
		return cookieValue;
	};

	/**
	 * Erases the cookie of the given name
	 * @param name name of the cookie to erase
	 */
	var eraseCookie = function(name) {
		createCookie(name, "", -1);
	};

	// Application component register
	var components = [];

	/**
	 * Registers a component. Duck typing is used to make sure that the component the user tries to register is a trogASR app compliant.
	 * Every component has to have an init() and a reset() function.
	 * @param cmp a plain object component to be registered
	 * @returns {object} the registered and processed component
	 */
	var registerComponent = function(cmp) {

		// Duck type the component - an init() and reset() functions have to be there
		if(!$.isPlainObject(cmp) || !$.isFunction(cmp.initComponent) || !$.isFunction(cmp.reset)) {
			throw 'The component cannot be registered to the app\'s init chain!';
		}

		// Ad-hoc flag that might be useful to the components themselves while they set themselves up
		cmp.isInitialized = false;
		components.push(cmp);

		return cmp;
	};

	/**
	 * Resets the application. Called whenever a need for re-doing localized content or statically sized content arises
	 */
	var reset = function() {
		loader.show();
		for(var i = 0, len = components.length; i < len; i++) {
			var cmp = components[i];
			cmp.reset();
		}
		loader.delayedHide(1000);
	};

	/**
	 * Initializes the application. Goes through the component register and calls an initialize() method on each of them
	 */
	var initialize = function() {
		for(var i = 0, len = components.length; i < len; i++) {
			var cmp = components[i];
			cmp.initComponent();
			// So the component might react to have been initialized
			cmp.isInitialized = true;
		}
		loader.delayedHide(1000);
	};

	// Register the initialize method as onload
	$(window).load(initialize);

	var resizeHandle;
	$(window).resize(function() {
		loader.show();
		// We want to wait until the user is done with resizing
		clearTimeout(resizeHandle);
		resizeHandle = setTimeout(function() {
			reset();
		}, 200);
	});

	/**
	 * Formats the given string c# style.
	 * "{0}-{1}".format("a","b") -> "a-b"
	 * Accepts any number of formatting replacements
	 * @returns {String} formatted string
	 */
	String.prototype.format = function() {
		var s = this;
		var i = arguments.length;
		while(i--) {
			s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
		}
		return s;
	};

	// Component assembling

	app.getNextId = getNextId;
	app.getLoader = getLoader;
	app.createCookie = createCookie;
	app.readCookie = readCookie;
	app.eraseCookie = eraseCookie;
	app.registerComponent = registerComponent;
	app.reset = reset;

})(jQuery, document, window, APP);