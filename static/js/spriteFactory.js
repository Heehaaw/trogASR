/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers the SPRITE FACTORY component
 *
 * Author: Janek Milota
 * Date: 12.01.2015
 */
(function($, ns) {

	// String constants
	var letterTemplateId = 'tpl_letter';
	var wordTemplateId = 'tpl_word';
	var letterClassPrefix = 'letter-';
	var letterMetricsId = '#letter-metrics';
	var letterSize;

	// Options constants
	var optionsItemTemplateId = 'tpl_optionsItem';
	var optionsLetterSizeMultiplier = 0.6;
	var optionsArrowHeight;
	var optionsArrowWidth;

	// Game constants
	var gameButtonTemplateId = 'tpl_gameButton';
	var gameButtonLetterSizeMultiplier = 0.5;

	/**
	 * Letter 'enum'. Maps a letter to its processable counterpart
	 * @enum {string}
	 */
	var letterMap = {
		A: 'A',
		Á: 'A',
		B: 'B',
		C: 'C',
		Č: 'C',
		D: 'D',
		Ď: 'D',
		E: 'E',
		É: 'E',
		Ě: 'E',
		F: 'F',
		G: 'G',
		H: 'H',
		I: 'I',
		Í: 'I',
		J: 'J',
		K: 'K',
		L: 'L',
		M: 'M',
		N: 'N',
		Ň: 'N',
		O: 'O',
		Ó: 'O',
		P: 'P',
		Q: 'Q',
		R: 'R',
		Ř: 'R',
		S: 'S',
		Š: 'S',
		T: 'T',
		Ť: 'T',
		U: 'U',
		Ú: 'U',
		Ů: 'U',
		V: 'V',
		W: 'W',
		X: 'X',
		Y: 'Y',
		Ý: 'Y',
		Z: 'Z',
		Ž: 'Z',
		' ': 'SPACE'
	};

	/**
	 * Creates a letter sprite
	 * @param {string} letter a letter to be transformed into a sprite
	 * @param {number} sizeMultiplier a multiplier that is applied to the created sprite's size
	 * @param {boolean} as$ if true, returns the sprite as an jQuery object; if not, returns the sprite as html string
	 * @returns {object|string} the created sprite
	 */
	var createLetterSprite = function(letter, sizeMultiplier, as$) {
		if(!letter) {
			// Nothing to do...
			return '';
		}
		// Compute the size and determine the appropriate class
		var size = sizeMultiplier ? letterSize * sizeMultiplier : letterSize;
		var letterCls = letterMap[letter.toUpperCase()];
		if(letterCls === 'SPACE') {
			// If the letter is a space, cut the size in half
			size /= 2;
		}
		// Fastest way to truncate a number to be an int
		size >>= 0;
		// Process the template and return the sprite
		return APP.TEMPLATES.process(letterTemplateId, {
			letterCls: letterClassPrefix + letterCls,
			size: size
		}, as$);
	};

	/**
	 * Creates a word sprite. It basically just concatenates a bunch of letter sprites.
	 * @param {string} word the word to be made into a sprite
	 * @param {number} sizeMultiplier a multiplier that is applied to every letter
	 * @param {boolean} as$ if true, returns the sprite as an jQuery object; if not, returns the sprite as html string
	 * @returns {object|string} the created sprite
	 */
	var createWordSprite = function(word, sizeMultiplier, as$) {
		// We buffer the html to speed up the jQuery object creation
		var htmlBuffer = '';
		var len = word.length;
		var spaceCount = 0;
		for(var i = 0; i < len; i++) {
			// Create a html-string letter sprite for every letter in the word
			var letter = word[i];
			if(letter === ' ') {
				// If the letter is a space, cut the size in half
				spaceCount++;
			}
			htmlBuffer += createLetterSprite(letter, sizeMultiplier, false);
		}
		// Compute the final size
		var size = (sizeMultiplier ? letterSize * sizeMultiplier : letterSize) >> 0;
		// Process the template and return
		return APP.TEMPLATES.process(wordTemplateId, {
			width: size * (len - spaceCount / 2),
			height: size,
			content: htmlBuffer
		}, as$);
	};

	/**
	 * Creates an option item sprite
	 * @param {string} label option item label
	 * @param {boolean} as$ if true, returns the sprite as an jQuery object; if not, returns the sprite as html string
	 * @returns {object|string} the created sprite
	 */
	var createOptionsItemSprite = function(label, as$) {
		return APP.TEMPLATES.process(optionsItemTemplateId, {
			label: createWordSprite(label, optionsLetterSizeMultiplier, false),
			arrowHeight: optionsArrowHeight,
			arrowWidth: optionsArrowWidth
		}, as$);
	};

	/**
	 * Creates a game button sprite
	 * @param {string} btnClass a class of the game button to-be
	 * @param {string} label button label
	 * @param {boolean} as$ if true, returns the sprite as an jQuery object; if not, returns the sprite as html string
	 * @returns {object|string} the created sprite
	 */
	var createGameButtonSprite = function(btnClass, label, as$) {
		return APP.TEMPLATES.process(gameButtonTemplateId, {
			buttonClass: btnClass,
			label: createWordSprite(label, gameButtonLetterSizeMultiplier, false)
		}, as$);
	};

	/**
	 * Initializes the component
	 */
	var initComponent = function() {
		letterSize = $(letterMetricsId).width();
		optionsArrowHeight = (letterSize * optionsLetterSizeMultiplier) >> 0;
		optionsArrowWidth = (optionsArrowHeight * 1.5) >> 0;
	};

	// Assemble the component
	var spriteFactory = {
		initComponent: initComponent,
		reset: initComponent,
		createLetterSprite: createLetterSprite,
		createWordSprite: createWordSprite,
		createOptionsItemSprite: createOptionsItemSprite,
		createGameButtonSprite: createGameButtonSprite,
		getLetterMetrics: function() {
			return letterSize;
		}
	};

	/**
	 * The SPRITE FACTORY component
	 * @namespace
	 * @alias APP.SPRITE_FACTORY
	 */
	ns.SPRITE_FACTORY = ns.registerComponent(spriteFactory);

})(jQuery, APP);