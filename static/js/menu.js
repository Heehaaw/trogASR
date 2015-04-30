/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates the MENU component
 *
 * Author: Janek Milota
 * Date: 9.01.2015
 */
(function($, ns) {

	// String constants
	var menuId = '#menu';
	var menuItemTemplateId = 'tpl_menuItem';
	var localeSelectorItemTemplateId = 'tpl_localeSelectorItem';
	var localeSelectorId = '#localeSelector';
	var blurCls = 'blur';
	var activeCls = 'active';
	var hideCls = 'hide';

	/**
	 * Creates a menu item
	 * @param {string} label label of the item
	 * @param {function} onClick a callback called as onclick handler
	 * @returns {object} created jQuery element
	 */
	var createItem = function(label, onClick) {

		var $sprite = APP.TEMPLATES.process(menuItemTemplateId, {
			value: APP.SPRITE_FACTORY.createWordSprite(label, 1, false)
		}, true);

		if($.isFunction(onClick)) {
			$sprite.on('click', onClick);
		}

		return $sprite;
	};

	/**
	 * Creates static menu items
	 */
	var createMenuItems = function() {

		var $menu = $(menuId);

		// The play sprite
		$menu.append(createItem(APP.I18N.t.MENU_PLAY, function() {
			APP.getLoader().show();
			APP.OPTIONS.hide();
			APP.LEADERBOARDS.hide();
			hide();
			// Clear the blurs
			$menuItems.removeClass(activeCls).removeClass(blurCls);
			$clicked = null;
			// Start the game with current options
			var lang = APP.OPTIONS.getCurrentLanguage();
			APP.GAME.start(
				lang.source,
				lang.target,
				APP.OPTIONS.getCurrentSuggestions().val,
				APP.OPTIONS.getCurrentLives().val,
				APP.OPTIONS.getCurrentRoundTime().val,
				APP.OPTIONS.getCurrentGameTime().val
			);
		}));

		// The options sprite
		$menu.append(createItem(APP.I18N.t.MENU_OPTIONS, function() {
			APP.LEADERBOARDS.hide();
			APP.OPTIONS.show();
			show();
		}));

		// The leaderboards sprite
		$menu.append(createItem(APP.I18N.t.MENU_LEADER_BOARDS, function() {
			APP.OPTIONS.hide();
			APP.LEADERBOARDS.show();
			show();
		}));

		// We have to add the items first so they acquire context
		var $menuItems = $menu.find('.menuItem');
		var timeoutHandle;
		var $clicked;

		// Enable the blur functionality on mouse enter
		$menuItems.on('mouseenter', function() {
			var $me = $(this);
			// Reset the blur on repeated entries
			clearTimeout(timeoutHandle);
			timeoutHandle = setTimeout(function() {
				if($me.hasClass(activeCls)) {
					// If the current sprite is already active, do nothing
					return false;
				}
				// Label all the other sprites with appropriate blur clases
				$menuItems.not($me).removeClass(activeCls).addClass(blurCls);
				$me.removeClass(blurCls).addClass(activeCls);
			}, 75);
		});

		// Remove the blurs and add active class on click
		$menuItems.on('click', function() {
			var $me = $(this);
			$menuItems.not($me).removeClass(activeCls).addClass(blurCls);
			$clicked = $me;
		});

		// Clear the blurs on mouse leave
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

	/**
	 * Creates the locale selector
	 */
	var createLocaleSelector = function() {

		var $localeSelector = $(localeSelectorId);
		var locale = APP.I18N.locale;

		for(var loc in locale) {
			// Every supported locale will have its own select-sprite
			if(locale.hasOwnProperty(loc)) {
				APP.TEMPLATES.process(localeSelectorItemTemplateId, {
					data: loc,
					selectorCls: loc
				}, true)
					.on('click', function() {
						// Bind the click functionality to resetting the app with a new locale
						APP.I18N.setCurrentLocale($(this).data('locale'));
						APP.reset();
					})
					.appendTo($localeSelector);
			}
		}
	};

	/**
	 * Hides the menu
	 */
	var hide = function() {
		$(menuId).addClass(hideCls);
	};

	/**
	 * Shows the menu
	 */
	var show = function() {
		$(menuId).removeClass(hideCls);
	};

	/**
	 * Initializes the component
	 */
	var initComponent = function() {
		createMenuItems();
		createLocaleSelector();
	};

	/**
	 * Resets the component
	 */
	var reset = function() {
		// Clear the display and re-do the statics
		$(menuId).empty();
		createMenuItems();
		show();
	};

	// Assemble the component
	var menu = {
		initComponent: initComponent,
		reset: reset,
		hide: hide,
		show: show
	};

	/**
	 * The MENU component
	 * @namespace
	 * @alias APP.MENU
	 */
	ns.MENU = ns.registerComponent(menu);

})(jQuery, APP);

