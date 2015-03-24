/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
$.app.i18n = function($) {

	var locale = {
		cs: 'cs',
		en: 'en'
	};

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
		OPTIONS_MODE: {
			cs: 'Mód',
			en: 'Mode'
		},
		OPTIONS_GAME_LANGUAGE: {
			cs: 'Jazyk',
			en: 'Language'
		},
		OPTIONS_MODE_TIMED: {
			cs: 'Na čas',
			en: 'Timed'
		},
		OPTIONS_MODE_STATIC: {
			cs: 'Statický',
			en: 'Static'
		},
		OPTIONS_LANGUAGE_CS_EN: {
			cs: 'Čeština -> Angličtina',
			en: 'Czech -> English'
		},
		OPTIONS_LANGUAGE_EN_CS: {
			cs: 'Angličtina -> Čeština',
			en: 'English -> Czech'
		}
	};

	var initComponent = function() {

		for(var keyName in keys) {
			var key = keys[keyName];
			key.getText = $.proxy(function(loc) {
				return this[loc || currentLocale];
			}, key);
		}

		setLocale(locale.en);
	};

	var getText = function(key, locale) {
		return key ? (keys[key] || {})[locale || currentLocale] : undefined;
	}

	var currentLocale = '';

	var getLocale = function() {
		return currentLocale;
	};

	var localeCache = {};

	var setLocale = function(loc) {

		if(!loc || typeof(loc) != 'string' || !locale[loc]) {
			throw 'A valid locale has to be provided!';
		}

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
		initComponent: function() {
		},
		reset: function() {
		},
		getCurrentLocale: getLocale,
		setCurrentLocale: setLocale,
		locale: locale,
		keys: keys,
		t: {},
		getText: getText
	};

	initComponent();

	return $.app.registerComponent(me);
}(jQuery);