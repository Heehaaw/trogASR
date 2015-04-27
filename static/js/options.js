/**
 * Author: Janek Milota
 * Date: 28.02.2015
 */
(function($) {

	var optionsId = '#options';
	var optionsValueCls = '.optionsItem';
	var optionsLeftCls = '.optionsLeft';
	var optionsRightCls = '.optionsRight';
	var showCls = 'show';

	var languages = {
		CS_EN: {
			id: 'CS_EN',
			getText: $.app.i18n.keys.OPTIONS_LANGUAGE_CS_EN.getText,
			source: $.app.i18n.locale.cs,
			target: $.app.i18n.locale.en
		},
		EN_CS: {
			id: 'EN_CS',
			getText: $.app.i18n.keys.OPTIONS_LANGUAGE_EN_CS.getText,
			source: $.app.i18n.locale.en,
			target: $.app.i18n.locale.cs
		}
	};

	var lives = {
		1: {
			id: 1,
			getText: $.app.i18n.keys.OPTIONS_LIVES_1.getText
		},
		3: {
			id: 3,
			getText: $.app.i18n.keys.OPTIONS_LIVES_3.getText
		},
		5: {
			id: 5,
			getText: $.app.i18n.keys.OPTIONS_LIVES_5.getText
		},
		10: {
			id: 10,
			getText: $.app.i18n.keys.OPTIONS_LIVES_10.getText
		},
		OFF: {
			id: 'OFF',
			getText: $.app.i18n.keys.OPTIONS_OFF.getText
		}
	};

	var suggestions = {
		2: {
			id: 2,
			getText: $.app.i18n.keys.OPTIONS_SUGGESTIONS_2.getText
		},
		3: {
			id: 3,
			getText: $.app.i18n.keys.OPTIONS_SUGGESTIONS_3.getText
		},
		4: {
			id: 4,
			getText: $.app.i18n.keys.OPTIONS_SUGGESTIONS_4.getText
		},
		5: {
			id: 5,
			getText: $.app.i18n.keys.OPTIONS_SUGGESTIONS_5.getText
		},
		6: {
			id: 6,
			getText: $.app.i18n.keys.OPTIONS_SUGGESTIONS_6.getText
		},
		OFF: {
			id: 'OFF',
			getText: $.app.i18n.keys.OPTIONS_OFF.getText
		}
	};

	var roundTime = {
		10: {
			id: 10,
			getText: $.app.i18n.keys.OPTIONS_ROUND_TIME_10.getText
		},
		15: {
			id: 15,
			getText: $.app.i18n.keys.OPTIONS_ROUND_TIME_15.getText
		},
		30: {
			id: 30,
			getText: $.app.i18n.keys.OPTIONS_ROUND_TIME_30.getText
		},
		60: {
			id: 60,
			getText: $.app.i18n.keys.OPTIONS_ROUND_TIME_60.getText
		},
		OFF: {
			id: 'OFF',
			getText: $.app.i18n.keys.OPTIONS_OFF.getText
		}
	};

	var gameTime = {
		30: {
			id: 30,
			getText: $.app.i18n.keys.OPTIONS_GAME_TIME_30.getText
		},
		60: {
			id: 60,
			getText: $.app.i18n.keys.OPTIONS_GAME_TIME_60.getText
		},
		120: {
			id: 120,
			getText: $.app.i18n.keys.OPTIONS_GAME_TIME_120.getText
		},
		300: {
			id: 300,
			getText: $.app.i18n.keys.OPTIONS_GAME_TIME_300.getText
		},
		600: {
			id: 600,
			getText: $.app.i18n.keys.OPTIONS_GAME_TIME_600.getText
		},
		OFF: {
			id: 'OFF',
			getText: $.app.i18n.keys.OPTIONS_OFF.getText
		}
	};

	var createItem = function(label, values, startIndex) {

		var ord = [];
		var len = 0;
		for(var val in values) {
			if(values.hasOwnProperty(val)) {
				ord[len++] = values[val];
			}
		}

		var index = startIndex || 0;

		var $item = $.app.spriteFactory.createOptionsItemSprite(label, true);

		$item.find(optionsValueCls).text(ord[index].getText());

		$item.find(optionsLeftCls).on('click', function() {
			if(--index < 0) {
				index = len - 1;
			}
			$item.find(optionsValueCls).text(ord[index].getText());
		});

		$item.find(optionsRightCls).on('click', function() {
			if(++index >= len) {
				index = 0;
			}
			$item.find(optionsValueCls).text(ord[index].getText());
		});

		$item.getCurrent = function() {
			return ord[index];
		};

		return $item;
	};

	var createOptionItems = function() {

		var $options = $(optionsId);

		var $language = createItem($.app.i18n.t.OPTIONS_LANGUAGE, languages);
		me.getCurrentLanguage = $language.getCurrent;
		$options.append($language);

		var $lives = createItem($.app.i18n.t.OPTIONS_LIVES, lives, 1);
		me.getCurrentLives = $lives.getCurrent;
		$options.append($lives);

		var $suggestions = createItem($.app.i18n.t.OPTIONS_SUGGESTIONS, suggestions, 3);
		me.getCurrentSuggestions = $suggestions.getCurrent;
		$options.append($suggestions);

		var $roundTime = createItem($.app.i18n.t.OPTIONS_ROUND_TIME, roundTime, 4);
		me.getCurrentRoundTime = $roundTime.getCurrent;
		$options.append($roundTime);

		var $gameTime = createItem($.app.i18n.t.OPTIONS_GAME_TIME, gameTime, 4);
		me.getCurrentGameTime = $gameTime.getCurrent;
		$options.append($gameTime);
	};

	var initComponent = function() {
		createOptionItems();
	};

	var reset = function() {
		hide();
		$(optionsId).empty();
		initComponent();
	};

	var show = function() {
		$(optionsId).addClass(showCls);
	};

	var hide = function() {
		$(optionsId).removeClass(showCls);
	};

	var me = {
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

	$.app.options = $.app.registerComponent(me);

})(jQuery);
