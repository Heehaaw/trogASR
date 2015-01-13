/**
 * Author: Janek Milota
 * Date: 12.01.2015
 */
$.app.spriteFactory = function() {

	var letterTemplateId = 'tpl_letter';
	var letterClassPrefix = 'letter-';

	var initComponent = function() {

	};

	var letterMap = {
		A: 'A', Á: 'A', B: 'B', C: 'C', Č: 'C', D: 'D', Ď: 'D', E: 'E', É: 'E', Ě: 'E', F: 'F', G: 'G', H: 'H', I: 'I',
		Í: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', Ň: 'N', O: 'O', Ó: 'O', P: 'P', Q: 'Q', R: 'R', Ř: 'R', S: 'S',
		Š: 'S', T: 'T', Ť: 'T', U: 'U', Ú: 'U', Ů: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Ý: 'Y', Z: 'Z', Ž: 'Z'
	};

	var createLetterSprite = function(letter) {
		return $.app.templates.process(letterTemplateId, {
			letterClass: 'float-left ' + letterClassPrefix + letterMap[letter.toUpperCase()]
		});
	};

	var createWordSprite = function(word) {
		var htmlBuffer = '<div>';
		for(var i = 0, len = word.length; i < len; i++) {
			htmlBuffer += $.app.spriteFactory.createLetterSprite(word[i]);
		}
		htmlBuffer += '</div>';
		return htmlBuffer;
	};

	var me = {
		initComponent: initComponent,
		reset: function() {
		},
		createLetterSprite: createLetterSprite,
		createWordSprite: createWordSprite
	};

	return $.app.registerComponent(me);
}();