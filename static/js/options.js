/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates the OPTIONS component
 *
 * Author: Janek Milota
 * Date: 28.02.2015
 */
(function($, ns) {

	// String constants
	var optionsId = '#options';
	var optionsValueCls = '.optionsValue';
	var optionsLeftCls = '.optionsLeft';
	var optionsRightCls = '.optionsRight';
	var showCls = 'show';

	/**
	 * Languages 'enum'
	 * @enum {{id: string, getText: function, source: string, target: string}}
	 */
	var languages = {
		CS_EN: {
			id: 'CS_EN',
			getText: APP.I18N.keys.OPTIONS_LANGUAGE_CS_EN.getText,
			source: APP.I18N.locale.cs,
			target: APP.I18N.locale.en
		},
		EN_CS: {
			id: 'EN_CS',
			getText: APP.I18N.keys.OPTIONS_LANGUAGE_EN_CS.getText,
			source: APP.I18N.locale.en,
			target: APP.I18N.locale.cs
		}
	};

	/**
	 * Lives 'enum'
	 * @enum {{id: int|string, getText: function, val: number}}
	 */
	var lives = {
		1: {
			id: 1,
			getText: APP.I18N.keys.OPTIONS_LIVES_1.getText,
			val: 1
		},
		3: {
			id: 3,
			getText: APP.I18N.keys.OPTIONS_LIVES_3.getText,
			val: 3
		},
		5: {
			id: 5,
			getText: APP.I18N.keys.OPTIONS_LIVES_5.getText,
			val: 5
		},
		10: {
			id: 10,
			getText: APP.I18N.keys.OPTIONS_LIVES_10.getText,
			val: 10
		},
		OFF: {
			id: 'OFF',
			getText: APP.I18N.keys.OPTIONS_OFF.getText,
			val: null
		}
	};

	/**
	 * Suggestions 'enum'
	 * @enum {{id: int|string, getText: function, val: number}}
	 */
	var suggestions = {
		2: {
			id: 2,
			getText: APP.I18N.keys.OPTIONS_SUGGESTIONS_2.getText,
			val: 2
		},
		3: {
			id: 3,
			getText: APP.I18N.keys.OPTIONS_SUGGESTIONS_3.getText,
			val: 3
		},
		4: {
			id: 4,
			getText: APP.I18N.keys.OPTIONS_SUGGESTIONS_4.getText,
			val: 4
		},
		5: {
			id: 5,
			getText: APP.I18N.keys.OPTIONS_SUGGESTIONS_5.getText,
			val: 5
		},
		6: {
			id: 6,
			getText: APP.I18N.keys.OPTIONS_SUGGESTIONS_6.getText,
			val: 6
		},
		OFF: {
			id: 'OFF',
			getText: APP.I18N.keys.OPTIONS_OFF.getText,
			val: null
		}
	};

	/**
	 * Round time 'enum'
	 * @enum {{id: int|string, getText: function, val: number}}
	 */
	var roundTime = {
		10: {
			id: 10,
			getText: APP.I18N.keys.OPTIONS_ROUND_TIME_10.getText,
			val: 10
		},
		15: {
			id: 15,
			getText: APP.I18N.keys.OPTIONS_ROUND_TIME_15.getText,
			val: 15
		},
		30: {
			id: 30,
			getText: APP.I18N.keys.OPTIONS_ROUND_TIME_30.getText,
			val: 30
		},
		60: {
			id: 60,
			getText: APP.I18N.keys.OPTIONS_ROUND_TIME_60.getText,
			val: 60
		},
		OFF: {
			id: 'OFF',
			getText: APP.I18N.keys.OPTIONS_OFF.getText,
			val: null
		}
	};

	/**
	 * Game time 'enum'
	 * @enum {{id: int|string, getText: function, val: number}}
	 */
	var gameTime = {
		30: {
			id: 30,
			getText: APP.I18N.keys.OPTIONS_GAME_TIME_30.getText,
			val: 30
		},
		60: {
			id: 60,
			getText: APP.I18N.keys.OPTIONS_GAME_TIME_60.getText,
			val: 60
		},
		120: {
			id: 120,
			getText: APP.I18N.keys.OPTIONS_GAME_TIME_120.getText,
			val: 120
		},
		300: {
			id: 300,
			getText: APP.I18N.keys.OPTIONS_GAME_TIME_300.getText,
			val: 300
		},
		600: {
			id: 600,
			getText: APP.I18N.keys.OPTIONS_GAME_TIME_600.getText,
			val: 600
		},
		OFF: {
			id: 'OFF',
			getText: APP.I18N.keys.OPTIONS_OFF.getText,
			val: null
		}
	};

	/**
	 * Creates an options sprite item
	 * @param {string} label a label of the sprite
	 * @param {object} values enum values to be added as consequent choices
	 * @param {int} startIndex the index of default item
	 * @returns {object} create jQuery sprite
	 */
	var createItem = function(label, values, startIndex) {

		// Cache the option values int o an outer scope
		var ord = [];
		var len = 0;
		for(var val in values) {
			if(values.hasOwnProperty(val)) {
				ord[len++] = values[val];
			}
		}

		var index = startIndex || 0;

		// Create the sprite itself, bind its default value
		var $item = APP.SPRITE_FACTORY.createOptionsItemSprite(label, true);
		var $ov = $item.find(optionsValueCls).text(ord[index].getText());

		// Left arrow click handling
		$item.find(optionsLeftCls).on('click', function() {
			if(--index < 0) {
				// If out of bounds, return back
				index = len - 1;
			}
			// Update the text
			$ov.fadeOut(100, function() {
				$ov.text(ord[index].getText());
				$ov.fadeIn(100);
			})
		});

		// Right arrow click handling
		$item.find(optionsRightCls).on('click', function() {
			if(++index >= len) {
				// If out of bounds, return back
				index = 0;
			}
			// Update the text
			$ov.fadeOut(100, function() {
				$ov.text(ord[index].getText());
				$ov.fadeIn(100);
			})
		});

		// Create a convenience method for fetching the current option
		$item.getCurrent = function() {
			return ord[index];
		};

		return $item;
	};

	/**
	 * Creates all the options items
	 */
	var createOptionItems = function() {

		var $options = $(optionsId);

		// Language selection
		var $language = createItem(APP.I18N.t.OPTIONS_LANGUAGE, languages, null);
		options.getCurrentLanguage = $language.getCurrent;
		$options.append($language);

		// Lives setup
		var $lives = createItem(APP.I18N.t.OPTIONS_LIVES, lives, 1);
		options.getCurrentLives = $lives.getCurrent;
		$options.append($lives);

		// Suggestions setup
		var $suggestions = createItem(APP.I18N.t.OPTIONS_SUGGESTIONS, suggestions, 3);
		options.getCurrentSuggestions = $suggestions.getCurrent;
		$options.append($suggestions);

		// Round time setup
		var $roundTime = createItem(APP.I18N.t.OPTIONS_ROUND_TIME, roundTime, 4);
		options.getCurrentRoundTime = $roundTime.getCurrent;
		$options.append($roundTime);

		// Game time setup
		var $gameTime = createItem(APP.I18N.t.OPTIONS_GAME_TIME, gameTime, 4);
		options.getCurrentGameTime = $gameTime.getCurrent;
		$options.append($gameTime);
	};

	/**
	 * Initializes the component
	 */
	var initComponent = function() {
		createOptionItems();
	};

	/**
	 * Resets the component
	 */
	var reset = function() {
		hide();
		// Clear the display and re-do the statics
		$(optionsId).empty();
		initComponent();
	};

	/**
	 * Shows the options
	 */
	var show = function() {
		$(optionsId).addClass(showCls);
	};

	/**
	 * Hides the options
	 */
	var hide = function() {
		$(optionsId).removeClass(showCls);
	};

	// Assemble the component
	var options = {
		initComponent: initComponent,
		reset: reset,
		show: show,
		hide: hide,
		languages: languages,
		getCurrentLanguage: function() {
		},
		lives: lives,
		getCurrentLives: function() {
		},
		suggestions: suggestions,
		getCurrentSuggestions: function() {
		},
		roundTime: roundTime,
		getCurrentRoundTime: function() {
		},
		gameTime: gameTime,
		getCurrentGameTime: function() {
		}
	};

	/**
	 * The OPTIONS component
	 * @namespace
	 * @alias APP.OPTIONS
	 */
	ns.OPTIONS = ns.registerComponent(options);

})(jQuery, APP);
