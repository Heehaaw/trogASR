/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
(function($) {

	var letterTemplateId = 'tpl_letter';
	var wordTemplateId = 'tpl_word';
	var letterClassPrefix = 'letter-';
	var letterMetricsId = '#letter-metrics';
	var letterSize;

	var optionsItemTemplateId = 'tpl_optionsItem';
	var optionsLetterSizeMultiplier = 0.7;
	var optionsArrowHeight;
	var optionsArrowWidth;

	var gameButtonTemplateId = 'tpl_gameButton';
	var gameButtonLetterSizeMultiplier = 0.5;

	var letterMap = {
		A: 'A', Á: 'A', B: 'B', C: 'C', Č: 'C', D: 'D', Ď: 'D', E: 'E', É: 'E', Ě: 'E', F: 'F', G: 'G', H: 'H', I: 'I',
		Í: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', Ň: 'N', O: 'O', Ó: 'O', P: 'P', Q: 'Q', R: 'R', Ř: 'R', S: 'S',
		Š: 'S', T: 'T', Ť: 'T', U: 'U', Ú: 'U', Ů: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Ý: 'Y', Z: 'Z', Ž: 'Z', ' ': 'SPACE'
	};

	var createLetterSprite = function(letter, sizeMultiplier, as$) {
		if(!letter) {
			return '';
		}
		var size = sizeMultiplier ? letterSize * sizeMultiplier : letterSize;
		var letterCls = letterMap[letter.toUpperCase()];
		if(letterCls === 'SPACE'){
			size /= 2;
		}
		size >>= 0;
		return $.app.templates.process(letterTemplateId, {
			letterCls: letterClassPrefix + letterCls,
			size: size
		}, as$);
	};

	var createWordSprite = function(word, sizeMultiplier, as$) {
		var htmlBuffer = '';
		var len = word.length;
		for(var i = 0; i < len; i++) {
			htmlBuffer += createLetterSprite(word[i], sizeMultiplier);
		}
		var size = (sizeMultiplier ? letterSize * sizeMultiplier : letterSize) >> 0;
		return $.app.templates.process(wordTemplateId, {
			width: len * size + 1,
			height: size,
			content: htmlBuffer
		}, as$);
	};

	var createOptionsItemSprite = function(label, as$) {
		return $.app.templates.process(optionsItemTemplateId, {
			label: createWordSprite(label, optionsLetterSizeMultiplier),
			arrowHeight: optionsArrowHeight,
			arrowWidth: optionsArrowWidth
		}, as$);
	};

	var createGameButtonSprite = function(btnClass, label, as$) {
		return $.app.templates.process(gameButtonTemplateId, {
			buttonClass: btnClass,
			label: createWordSprite(label, gameButtonLetterSizeMultiplier)
		}, as$);
	};

	var initComponent = function() {
		letterSize = $(letterMetricsId).width();
		optionsArrowHeight = (letterSize * optionsLetterSizeMultiplier) >> 0;
		optionsArrowWidth = (optionsArrowHeight * 1.5) >> 0;
	};

	var me = {
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

	$.app.spriteFactory = $.app.registerComponent(me);

})(jQuery);