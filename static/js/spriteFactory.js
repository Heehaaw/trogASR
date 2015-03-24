/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
$.app.spriteFactory = function($) {

	var letterTemplateId = 'tpl_letter';
	var letterClassPrefix = 'letter-';
	var letterMetricsId = '#letter-metrics';

	var letterSize = 0;

	var initComponent = function() {
		letterSize = $(letterMetricsId).width();
	};

	var letterMap = {
		A: 'A', Á: 'A', B: 'B', C: 'C', Č: 'C', D: 'D', Ď: 'D', E: 'E', É: 'E', Ě: 'E', F: 'F', G: 'G', H: 'H', I: 'I',
		Í: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', Ň: 'N', O: 'O', Ó: 'O', P: 'P', Q: 'Q', R: 'R', Ř: 'R', S: 'S',
		Š: 'S', T: 'T', Ť: 'T', U: 'U', Ú: 'U', Ů: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Ý: 'Y', Z: 'Z', Ž: 'Z'
	};

	var createLetterSprite = function(letter, sizeMultiplier) {
		if(!letter) {
			return '';
		}
		return $.app.templates.process(letterTemplateId, {
			letterCls: letterClassPrefix + letterMap[letter.toUpperCase()],
			size: (letterSize * (sizeMultiplier || 1)) >> 0
		});
	};

	var createWordSprite = function(word, sizeMultiplier) {
		var htmlBuffer = '';
		for(var i = 0, len = word.length; i < len; i++) {
			htmlBuffer += $.app.spriteFactory.createLetterSprite(word[i], sizeMultiplier);
		}
		return htmlBuffer;
	};

	var me = {
		initComponent: initComponent,
		reset: function() {
			initComponent();
		},
		createLetterSprite: createLetterSprite,
		createWordSprite: createWordSprite,
		getLetterMetrics: function() {
			return letterSize;
		}
	};

	return $.app.registerComponent(me);
}(jQuery);