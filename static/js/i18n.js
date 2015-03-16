/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
$.app.i18n = function() {

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
		}
	};


	var initComponent = function() {

		for(var keyName in keys) {
			keys[keyName].getText = function(loc) {
				return this[loc || currentLocale];
			}
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

	return $.app.registerComponent(me);
}();