/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
(function($) {

	var locale = {
		cs: 'cs',
		en: 'en'
	};

	var currentLocale = '';

	var keys = {
		MENU_PLAY: {
			cs: 'Hrát',
			en: 'Play'
		},
		MENU_OPTIONS: {
			cs: 'Nastavení',
			en: 'Options'
		},
		MENU_LEADER_BOARDS: {
			cs: 'Žebříčky',
			en: 'Leaderboards'
		},
		OPTIONS_LANGUAGE: {
			cs: 'Jazyk',
			en: 'Language'
		},
		OPTIONS_LANGUAGE_CS_EN: {
			cs: 'Čeština -> Angličtina',
			en: 'Czech -> English'
		},
		OPTIONS_LANGUAGE_EN_CS: {
			cs: 'Angličtina -> Čeština',
			en: 'English -> Czech'
		},
		OPTIONS_LIVES: {
			cs: 'Životy',
			en: 'Lives'
		},
		OPTIONS_LIVES_1: {
			cs: '1',
			en: '1'
		},
		OPTIONS_LIVES_3: {
			cs: '3',
			en: '3'
		},
		OPTIONS_LIVES_5: {
			cs: '5',
			en: '5'
		},
		OPTIONS_LIVES_10: {
			cs: '10',
			en: '10'
		},
		OPTIONS_SUGGESTIONS: {
			cs: 'Nápovědy',
			en: 'Suggestions'
		},
		OPTIONS_SUGGESTIONS_2: {
			cs: 'Maximálně 2',
			en: 'Max 2'
		},
		OPTIONS_SUGGESTIONS_3: {
			cs: 'Maximálně 3',
			en: 'Max 3'
		},
		OPTIONS_SUGGESTIONS_4: {
			cs: 'Maximálně 4',
			en: 'Max 4'
		},
		OPTIONS_SUGGESTIONS_5: {
			cs: 'Maximálně 5',
			en: 'Max 5'
		},
		OPTIONS_SUGGESTIONS_6: {
			cs: 'Maximálně 6',
			en: 'Max 6'
		},
		OPTIONS_ROUND_TIME: {
			cs: 'Čas na kolo',
			en: 'Round time'
		},
		OPTIONS_ROUND_TIME_10: {
			cs: '10 sekund',
			en: '10 seconds'
		},
		OPTIONS_ROUND_TIME_15: {
			cs: '15 sekund',
			en: '15 seconds'
		},
		OPTIONS_ROUND_TIME_30: {
			cs: '30 sekund',
			en: '30 seconds'
		},
		OPTIONS_ROUND_TIME_60: {
			cs: '1 minuta',
			en: '1 minute'
		},
		OPTIONS_GAME_TIME: {
			cs: 'Čas na hru',
			en: 'Game time'
		},
		OPTIONS_GAME_TIME_30: {
			cs: '30 sekund',
			en: '30 seconds'
		},
		OPTIONS_GAME_TIME_60: {
			cs: '1 minuta',
			en: '1 minute'
		},
		OPTIONS_GAME_TIME_120: {
			cs: '2 minuty',
			en: '2 minutes'
		},
		OPTIONS_GAME_TIME_300: {
			cs: '5 minut',
			en: '5 minutes'
		},
		OPTIONS_GAME_TIME_600: {
			cs: '10 minut',
			en: '10 minutes'
		},
		OPTIONS_OFF: {
			cs: 'Vypnuto',
			en: 'Off'
		},
		GAME_BUTTON_RECORD: {
			cs: 'Nahrát',
			en: 'Record'
		},
		GAME_BUTTON_EXIT: {
			cs: 'Konec',
			en: 'Exit'
		},
		GAME_INFO: {
			cs: 'Zmáčkni "NAHRÁT" a řekni slovo ',
			en: 'Press "RECORD" and say the word below '
		},
		GAME_INFO_IN_cs: {
			cs: 'v češtině',
			en: 'in Czech'
		},
		GAME_INFO_IN_en: {
			cs: 'v angličtině',
			en: 'in English'
		},
		GAME_INFO_OPTIONS_TITLE: {
			cs: 'Určitě jsi měl/a na mysli některé z následujících:',
			en: 'You surely meant one of the following:'
		},
		GAME_INFO_END: {
			cs: 'Konec hry! Získal/a jsi <b>{0}</b> bodů!',
			en: 'Game over! You\'ve scored <b>{0}</b> points!'
		}
	};

	for(var keyName in keys) {
		var key = keys[keyName];
		key.getText = $.proxy(function(loc) {
			return this[loc || currentLocale];
		}, key);
	}

	var initComponent = function() {
		setLocale($.app.readCookie('locale') || locale.en);
	};

	var getText = function(key, locale) {
		return key ? (keys[key] || {})[locale || currentLocale] : undefined;
	};

	var getLocale = function() {
		return currentLocale;
	};

	var localeCache = {};

	var setLocale = function(loc) {

		if(!loc || typeof(loc) != 'string' || !locale[loc]) {
			throw 'A valid locale has to be provided!';
		}

		$.app.createCookie('locale', loc, 7);
		currentLocale = loc;

		var localeVal = localeCache[loc];
		if(!localeVal) {
			localeVal = {};
			for(var keyName in keys) {
				localeVal[keyName] = keys[keyName].getText(loc);
			}
			localeCache[loc] = localeVal;
		}

		me.t = localeVal
	};

	var me = {
		initComponent: initComponent,
		reset: function() {
		},
		getCurrentLocale: getLocale,
		setCurrentLocale: setLocale,
		locale: locale,
		keys: keys,
		t: {},
		getText: getText
	};

	$.app.i18n = $.app.registerComponent(me);

})(jQuery);