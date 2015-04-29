/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers the LEADERBOARDS component
 *
 * Author: Janek Milota
 * Date: 28.04.2015
 */
(function($, ns) {

	// String constants
	var leaderboardsId = '#leaderboards';
	var leaderboardsRowTemplateId = 'tpl_leaderboardsRow';
	var gearLoaderCls = 'gearLoader';
	var showCls = 'show';
	var leaderboardsContainerCls = 'leaderboardsContainer';

	// Cached progress gear component
	var $gear;

	/**
	 * initializes the component
	 */
	var initComponent = function() {
		// Create the progress gear and cache it
		$gear = $('<div>')
			.addClass(gearLoaderCls)
			.hide()
			.appendTo(leaderboardsId);
	};

	/**
	 * Resets the component
	 */
	var reset = function() {
		hide();
		$(leaderboardsId).empty();
		initComponent();
	};

	/**
	 * Show the leaderboards
	 */
	var show = function() {

		// Show the progress gear, clean the leaderboards display
		$gear.show();
		var $leaderboards = $(leaderboardsId);
		//noinspection JSValidateTypes
		$leaderboards.children().not($gear).remove();
		$leaderboards.addClass(showCls);

		var lang = APP.OPTIONS.getCurrentLanguage();

		// Fetch the leaderboards for the current option setup
		$.getJSON('getLeaderboards.json', {
			sourceLanguage: lang.source,
			targetLanguage: lang.target,
			suggestions: APP.OPTIONS.getCurrentSuggestions().val,
			lives: APP.OPTIONS.getCurrentLives().val,
			roundTime: APP.OPTIONS.getCurrentRoundTime().val,
			gameTime: APP.OPTIONS.getCurrentGameTime().val
		}, function(data) {

			// Create the display container
			var $container = $('<div>')
				.addClass(leaderboardsContainerCls)
				.hide()
				.appendTo($leaderboards);

			// Add the leaderboards entries
			for(var i = 0, len = data.length; i < len; i++) {
				$container.append(APP.TEMPLATES.process(leaderboardsRowTemplateId, {
					// Every second entry faces the other way
					leftPoints: i % 2 == 0,
					points: data[i].points,
					name: data[i].userName
				}));
			}

			// Calculate the further used properties
			var lH = $leaderboards.outerHeight();
			var cH = $container.height();
			var offScrollHandle;
			// Listen to the mousewheel event on the display container
			$leaderboards.on('mousewheel', function(e) {
				// If the off-scrolling is in progress, discard the event
				if(offScrollHandle) {
					return;
				}
				var delta = e.originalEvent.wheelDelta;
				$container.animate({
						// Scroll the view by moving the display container up and down
						top: '+=' + delta
					}, 100, function() {
						var t = $container.offset().top;
						if(t > 0) {
							// If the user wants to scroll too high, scroll back to the top
							clearTimeout(offScrollHandle);
							offScrollHandle = setTimeout(function() {
								$container.animate({
									top: 0
								});
								offScrollHandle = null;
							}, 50);
						}
						else if(t + cH < lH) {
							// If the user wants to scroll too low, scroll to the bottom
							clearTimeout(offScrollHandle);
							offScrollHandle = setTimeout(function() {
								$container.animate({
									// If the display container is too small, scroll to the top
									top: cH < lH ? 0 : lH - cH
								});
								offScrollHandle = null;
							}, 50);
						}
					}
				);
			});

			// Hide the progress gear and show the leaderboards
			$gear.fadeOut(200, function() {
				$container.fadeIn(200);
			});
		});
	};

	/**
	 * Hides the leaderboards
	 */
	var hide = function() {
		$(leaderboardsId).removeClass(showCls);
	};

	// Assemble the component
	var leaderboards = {
		initComponent: initComponent,
		reset: reset,
		show: show,
		hide: hide
	};

	/**
	 * The LEADERBOARDS component
	 * @namespace
	 * @alias APP.LEADERBOARDS
	 */
	ns.LEADERBOARDS = ns.registerComponent(leaderboards);

})(jQuery, APP);