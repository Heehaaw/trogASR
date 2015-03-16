/**
 * Author: Janek Milota
 * Date: 28.02.2015
 */
$.app.options = function() {

	var optionsId = '#options';
	var optionsItemTemplateId = 'tpl_optionsItem';
	var letterSizeMultiplier = 0.7;

	var createOptionItems = function() {

		var $options = $(optionsId);

		var arrowHeight = ($.app.spriteFactory.getLetterMetrics() * letterSizeMultiplier) >> 0;
		var arrowWidth = (arrowHeight * 1.5) >> 0;

		var $item = $($.app.templates.process(optionsItemTemplateId, {
			label: $.app.spriteFactory.createWordSprite($.app.i18n.t.OPTIONS_MODE, letterSizeMultiplier),
			value: 'adsadasdasd',
			arrowHeight: arrowHeight,
			arrowWidth: arrowWidth
		}));
		$options.append($item);

		$item = $($.app.templates.process(optionsItemTemplateId, {
			label: $.app.spriteFactory.createWordSprite($.app.i18n.t.OPTIONS_GAME_LANGUAGE, letterSizeMultiplier),
			value: 'adsadasdasd',
			arrowHeight: arrowHeight,
			arrowWidth: arrowWidth
		}));
		$options.append($item);
	};

	var initComponent = function() {

		var $options = $('<div/>').attr('id', 'options');
		$('section').append($options);

		createOptionItems();
	};

	var reset = function() {
		hide();
		$(optionsId).empty();
		createOptionItems();
	};

	var show = function() {
		$(optionsId).addClass('show');
	};
	var hide = function() {
		$(optionsId).removeClass('show');
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		show: show,
		hide: hide
	};

	return $.app.registerComponent(me);
}();
