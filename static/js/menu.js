$.app.menu = function () {

	var menuId = 'menu';
	var menuItemTemplateId = 'tpl_menuItem';

	var initComponent = function () {

		var mi = $.app.templates.process(menuItemTemplateId, {text: 'MENU ITEM 1'});
		$('#' + menuId).append(mi);
	};

	var me = {
		initComponent: initComponent
	};
	return $.app.registerInitEvent(me);
}();

