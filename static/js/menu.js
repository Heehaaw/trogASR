/**
 * Author: Janek Milota
 * Date: 9.01.2015
 */
(function($) {

	var menuId = '#menu';
	var menuItemTemplateId = 'tpl_menuItem';
	var localeSelectorItemTemplateId = 'tpl_localeSelectorItem';
	var localeSelectorId = '#localeSelector';
	var blurCls = 'blur';
	var activeCls = 'active';
	var hideCls = 'hide';

	var createItem = function(label, onClick) {

		var $sprite = $($.app.templates.process(menuItemTemplateId, {
			value: $.app.spriteFactory.createWordSprite(label)
		}));

		if($.isFunction(onClick)) {
			$sprite.on('click', onClick);
		}

		return $sprite;
	};

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

		$menu.append(createItem($.app.i18n.t.MENU_PLAY, function() {
			$.app.options.hide();
			hide();
		}));

		$menu.append(createItem($.app.i18n.t.MENU_OPTIONS, function() {
			$.app.options.show();
			show();
		}));

		$menu.append(createItem($.app.i18n.t.MENU_LEADER_BOARDS));

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
			$menuItems.not($me).removeClass(activeCls).addClass(blurCls);
			$clicked = $me;
		});

		$menuItems.on('mouseleave', function() {
			clearTimeout(timeoutHandle);
			var $me = $(this);
			if($clicked) {
				if($clicked != $me) {
					$me.removeClass(activeCls).addClass(blurCls);
				}
				$clicked.removeClass(blurCls).addClass(activeCls);
			}
			else {
				$menuItems.removeClass(blurCls).removeClass(activeCls);
			}
		});
	};

	var createLocaleSelector = function() {

		var $localeSelector = $(localeSelectorId);

		var locale = $.app.i18n.locale;

		for(var loc in locale) {

			if(locale.hasOwnProperty(loc)) {

				var $sel = $($.app.templates.process(localeSelectorItemTemplateId, {
					data: loc,
					selectorCls: loc
				}));

				$sel.on('click', function() {
					$.app.i18n.setCurrentLocale($(this).data('locale'));
					$.app.reset();
				});

				$localeSelector.append($sel);
			}
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

	$.app.menu = $.app.registerComponent(me);

})(jQuery);

