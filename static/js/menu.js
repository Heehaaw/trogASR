/**
 * Author: Janek Milota
 * Date: 9.01.2015
 */
$.app.menu = function() {

	var menuId = '#menu';
	var menuItemTemplateId = 'tpl_menuItem';
	var localeSelectorItemTemplateId = 'tpl_localeSelectorItem';
	var localeSelectorId = '#localeSelector';
	var blurCls = 'blur';
	var activeCls = 'active';
	var clickedCls = 'clicked';
	var hideCls = 'hide';

	var createMenuItems = function() {

		var $menu = $(menuId);

		$menu.on('click', function() {
			if(hidden) {
				$menu.removeClass(hideCls);
			}
		});

		$menu.on('mouseleave', function() {
			if(hidden) {
				$menu.addClass(hideCls);
			}
		});

		var $menuItem = $($.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_PLAY)
		}));
		$menuItem.on('click', function() {
			$.app.options.hide();
			hide();
		});

		$menu.append($menuItem);

		$menuItem = $($.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_OPTIONS)
		}));
		$menuItem.on('click', function() {
			$.app.options.show();
			show();
		});
		$menu.append($menuItem);

		$menuItem = $($.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite($.app.i18n.t.MENU_LEADER_BOARDS)
		}));
		$menu.append($menuItem);

		// We have to add the items first so they acquire context
		var $menuItems = $menu.find('.menuItem');
		var timeoutHandle;
		var $clicked;

		$menuItems.on('mouseenter', function() {
			var $me = $(this);
			clearTimeout(timeoutHandle);
			timeoutHandle = setTimeout(function() {
				if($me.hasClass(activeCls)) {
					return false;
				}
				$menuItems.not($me).removeClass(activeCls).addClass(blurCls);
				$me.removeClass(blurCls).addClass(activeCls);
			}, 75);
		});

		$menuItems.on('click', function() {
			var $me = $(this);
			$menuItems.not($me).removeClass(clickedCls).addClass(blurCls);
			$me.addClass(clickedCls);
			$clicked = $me;
		});

		$menuItems.on('mouseleave', function() {
			clearTimeout(timeoutHandle);
			var $me = $(this);
			$menuItems.removeClass(activeCls);
			if(!$clicked) {
				$menuItems.removeClass(blurCls);
			}
			else if($clicked != $me) {
				$me.addClass(blurCls);
			}
		});
	};

	var createLocaleSelector = function() {

		var $localeSelector = $(localeSelectorId);

		for(var loc in $.app.i18n.locale) {

			var sel = $.app.templates.process(localeSelectorItemTemplateId, {
				data: loc,
				selectorCls: loc
			});

			var $sel = $(sel).on('click', function() {
				$.app.i18n.setCurrentLocale($(this).data('locale'));
				$.app.reset();
			});

			$localeSelector.append($sel);
		}
	};

	var hidden = false;

	var hide = function() {
		$(menuId).addClass(hideCls);
		hidden = true;
	};

	var show = function() {
		$(menuId).removeClass(hideCls);
		hidden = false;
	};

	var initComponent = function() {
		createMenuItems();
		createLocaleSelector();
	};

	var reset = function() {
		$(menuId).empty();
		createMenuItems();
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		hide: hide,
		show: show
	};

	return $.app.registerComponent(me);
}();

