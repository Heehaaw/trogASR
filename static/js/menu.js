/**
 * Author: Janek Milota
 * Date: 9.01.2015
 */
$.app.menu = function() {

	var menuId = '#menu';
	var menuItemTemplateId = 'tpl_menuItem';
	var localeSelectorId = '#localeSelector';
	var localeSelectorItemTemplateId = 'tpl_localeSelectorItem';

	var createMenuItems = function() {

		var htmlBuffer = '';
		htmlBuffer += $.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_PLAY)
		});
		htmlBuffer += $.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_OPTIONS)
		});
		htmlBuffer += $.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_LEADER_BOARDS)
		});
		$(menuId).append(htmlBuffer);
	};

	var initComponent = function() {

		createMenuItems();

		var $localeSelector = $(localeSelectorId);

		for(var loc in $.app.i18n.locale) {

			var sel = $.app.templates.process(localeSelectorItemTemplateId, {
				data: loc,
				selectorCls: loc
			});

			var $sel = $(sel).on('click', function() {
				$.app.i18n.setCurrentLocale($(this).attr('data'));
				$.app.reset();
			});

			$localeSelector.append($sel);
		}
	};

	var reset = function() {
		$(menuId).empty();
		createMenuItems();
	};

	var me = {
		initComponent: initComponent,
		reset: reset
	};

	return $.app.registerComponent(me);
}();

