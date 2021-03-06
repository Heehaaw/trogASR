/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers the internationalization component
 *
 * Author: Janek Milota
 * Date: 12.01.2015
 */
(function($, ns) {

	/**
	 * Supported locales
	 * @enum {string}
	 */
	var locale = {
		cs: 'cs',
		en: 'en'
	};

	// Current locale cached value
	var currentLocale = '';

	/**
	 * Localization keys.
	 * Every key has to have string meaning for every supported locale
	 * @enum {{?: string}}
	 */
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
		},
		MENU_USER_INFO: {
			cs: '<div>Vítej v této jedinečné<br/>' +
			'<b>Překladatelské hře, využívající automatického rozpoznávání řeči</b>!<br/><br/>' +
			'Co zde můžeš podniknout:<br/><br/>' +
			'<b>Hrát</b><br/>' +
			'<div>Otestuj své překladatelské schopnosti v ultimátní, hlasem aktivované hře! Každé kolo vyskočí jedno slovo. ' +
			'Tvým cílem je zmáčknout tlačítko "NAHRÁT", říci toto slovo ve zvoleném druhém jazyce, a tlačítko pustit znovu. ' +
			'Pokud je slovo vyřčeno správně, dostaneš bod. Pokud ne, musíš se popasovat s následky!</div><br/>' +
			'<b>Nastavení</b>' +
			'<table><tr>' +
			'<td>Jazyk</td>' +
			'<td>Nastav si jazyk, ze a do kterého budeš překládat.</td>' +
			'</tr><tr>' +
			'<td>Životy</td>' +
			'<td>Vyber si, kolik budeš mít životů!</td>' +
			'</tr><tr>' +
			'<td>Nápovědy</td>' +
			'<td>Protože rozpoznávač hlasu ještě není 100%, můžeš si při hře nechat poskytnout i několik nápověd.</td>' +
			'</tr><tr>' +
			'<td>Čas kola</td>' +
			'<td>Když tento čas vyprší, ztratíš život (pokud máš životy zaplé).</td>' +
			'</tr><tr>' +
			'<td>Čas hry</td>' +
			'<td>Když tento čas vyprší, hra skončí!<br/>' +
			'</tr></table><div><br/>' +
			'<b>Žebříčky</b><br/>' +
			'<div>Jakmile dokončíš hru s nějakým nahraným počtem bodů, můžeš se umístit v žebříčcích! ' +
			'Prosím, využij přihlašovacího tlačítka. Nemůžeš soutěžit, dokud nikdo neví, kdo jsi!</div><br/><br/>' +
			'<div>A samozřejmě, nezapomeň na Like! Enjoy :-)</div>',
			en: '<div>Welcome to the one and only<br/>' +
			'<b>Translating Online Game using Automatic Speech Recognition</b>!<br/><br/>' +
			'What you can do here:<br/><br/>' +
			'<b>Play</b><br/>' +
			'<div>Challenge your translating skills in an ultimate voice-activated experience! Every round a word pops up. ' +
			'Your goal is to press the "RECORD" button, say the word in the other language and release the button. ' +
			'If you are right, you score a point. If not, you face the consequences!</div><br/>' +
			'<b>Options</b>' +
			'<table><tr>' +
			'<td>Language</td>' +
			'<td>Set up the languages you will translate words from and to.</td>' +
			'</tr><tr>' +
			'<td>Lives</td>' +
			'<td>Choose how many lives will you have!</td>' +
			'</tr><tr>' +
			'<td>Suggestions</td>' +
			'<td>Because the recognition engine is not 100% yet, you are allowed to receive up to a number of suggestions during play.</td>' +
			'</tr><tr>' +
			'<td>Round time</td>' +
			'<td>When this time runs out you loose a life (if you chose to enable them).</td>' +
			'</tr><tr>' +
			'<td>Game time</td>' +
			'<td>When this time runs out the game ends!<br/>' +
			'</tr></table><div><br/>' +
			'<b>Leaderboards</b><br/>' +
			'<div>By the time you will have finished the game with a number of scored points, you might be eligible to place in the leaderboards! ' +
			'Please, use the "Log In" button for you can not compete while nobody knows who you are!</div><br/>' +
			'<div>And of course, don\'t forget to like and share! Enjoy :-)</div>'
		}
	};

	// Add a dynamic getText() method to every key
	for(var keyName in keys) {
		var key = keys[keyName];
		key.getText = $.proxy(function(loc) {
			return this[loc || currentLocale];
		}, key);
	}

	/**
	 * Initializes the component
	 */
	var initComponent = function() {
		setLocale(APP.readCookie('locale') || locale.en);
	};

	/**
	 * Gets localized text for the given key in the given locale
	 * @param {string} key localization key
	 * @param {string} locale locale
	 * @returns {string} localized text
	 */
	var getText = function(key, locale) {
		return key ? (keys[key] || {})[locale || currentLocale] : undefined;
	};

	/**
	 * Gets the current locale
	 * @returns {string} current locale
	 */
	var getLocale = function() {
		return currentLocale;
	};

	// A cache object used for storing static localization mappings
	var localeCache = {};

	/**
	 * Sets a locale
	 * @param {string} loc locale to be set
	 */
	var setLocale = function(loc) {

		if(!loc || typeof(loc) != 'string' || !locale[loc]) {
			// The provided locale is not valid or among the supported ones
			throw 'A valid locale has to be provided!';
		}

		// Store the locale to a cookie and cache it
		APP.createCookie('locale', loc, 7);
		currentLocale = loc;

		// Create a static localized text access object
		var localeVal = localeCache[loc];
		if(!localeVal) {
			localeVal = {};
			for(var keyName in keys) {
				localeVal[keyName] = keys[keyName].getText(loc);
			}
			localeCache[loc] = localeVal;
		}

		i18n.t = localeVal
	};

	// Assemble the component
	var i18n = {
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

	/**
	 * The internationalization component
	 * @namespace
	 * @alias APP.I18N
	 */
	ns.I18N = ns.registerComponent(i18n);

})(jQuery, APP);