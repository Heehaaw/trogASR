/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers the TEMPLATES component
 *
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($, document, ns) {

	// A place for caching of the already parsed templates
	var templateCache = {};

	/**
	 * Processes a template of the given id for the given params
	 * @param {string} str either template id or the template body itself
	 * @param {object} data the data to send to the template
	 * @param {boolean} as$ if true, returns the sprite as an jQuery object; if not, returns the sprite as html string
	 * @returns {string|object} the processed template
	 */
	var process = function(str, data, as$) {
		// Enable basic curryfication - assign either a process function or a processed result
		var processFn = !/\W/.test(str)
			// If the string is an id (no non-word characters), try to find a result in the cache or compute it and cache it
			? templateCache[str] = templateCache[str] || process(document.getElementById(str).innerHTML, null, false)
			// Otherwise process the raw html
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
			// The process function is prepared to process the raw html now
			data.id = data.id || APP.getNextId();
			var result = processFn(data);
			return as$ ? $(result) : result;
		}
		else {
			// Otherwise there is already a result in there
			return processFn;
		}
	};

	// Assemble the component
	var templates = {
		/**
		 * Ijnitializes the component
		 */
		initComponent: function() {
		},
		/**
		 * Resets the component
		 */
		reset: function() {
		},
		process: process
	};

	/**
	 * The TEMPLATES component
	 * @namespace
	 * @alias APP.TEMPLATES
	 */
	ns.TEMPLATES = ns.registerComponent(templates);

})(jQuery, document, APP);