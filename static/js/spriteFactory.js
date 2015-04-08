/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
(function($) {

	var letterTemplateId = 'tpl_letter';
	var letterClassPrefix = 'letter-';
	var letterMetricsId = '#letter-metrics';
	var letterSize;

	var optionsItemTemplateId = 'tpl_optionsItem';
	var optionsLetterSizeMultiplier = 0.7;
	var optionsArrowHeight;
	var optionsArrowWidth;

	var letterMap = {
		A: 'A', Á: 'A', B: 'B', C: 'C', Č: 'C', D: 'D', Ď: 'D', E: 'E', É: 'E', Ě: 'E', F: 'F', G: 'G', H: 'H', I: 'I',
		Í: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', Ň: 'N', O: 'O', Ó: 'O', P: 'P', Q: 'Q', R: 'R', Ř: 'R', S: 'S',
		Š: 'S', T: 'T', Ť: 'T', U: 'U', Ú: 'U', Ů: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Ý: 'Y', Z: 'Z', Ž: 'Z'
	};

	var createLetterSprite = function(letter, sizeMultiplier, as$) {
		if(!letter) {
			return '';
		}
		return $.app.templates.process(letterTemplateId, {
			letterCls: letterClassPrefix + letterMap[letter.toUpperCase()],
			size: (letterSize * (sizeMultiplier || 1)) >> 0
		}, as$);
	};

	var createWordSprite = function(word, sizeMultiplier, as$) {
		var htmlBuffer = '';
		for(var i = 0, len = word.length; i < len; i++) {
			htmlBuffer += createLetterSprite(word[i], sizeMultiplier);
		}
		return as$ ? $(htmlBuffer) : htmlBuffer;
	};

	var createOptionsItemSprite = function(label, as$) {
		return $.app.templates.process(optionsItemTemplateId, {
			label: createWordSprite(label, optionsLetterSizeMultiplier),
			arrowHeight: optionsArrowHeight,
			arrowWidth: optionsArrowWidth
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
		getLetterMetrics: function() {
			return letterSize;
		}
	};

	$.app.spriteFactory = $.app.registerComponent(me);

})(jQuery);