/**
 * Author: Janek Milota
 * Date: 28.02.2015
 */
(function($) {

	var optionsId = '#options';
	var optionsValueCls = '.optionsItem';
	var optionsLeftCls = '.optionsLeft';
	var optionsRightCls = '.optionsRight';
	var showCls = 'show';

	var modes = {
		TIMED: {
			id: 'TIMED',
			getText: $.app.i18n.keys.OPTIONS_MODE_TIMED.getText
		},
		STATIC: {
			id: 'STATIC',
			getText: $.app.i18n.keys.OPTIONS_MODE_STATIC.getText
		}
	};

	var languages = {
		CS_EN: {
			id: 'CS_EN',
			getText: $.app.i18n.keys.OPTIONS_LANGUAGE_CS_EN.getText
		},
		EN_CS: {
			id: 'EN_CS',
			getText: $.app.i18n.keys.OPTIONS_LANGUAGE_EN_CS.getText
		}
	};

	var createItem = function(label, values) {

		var ord = [];
		var len = 0;
		for(var val in values) {
			if(values.hasOwnProperty(val)) {
				ord[len++] = values[val];
			}
		}

		var index = 0;

		var $item = $.app.spriteFactory.createOptionsItemSprite(label, true);

		$item.find(optionsValueCls).text(ord[index].getText());

		$item.find(optionsLeftCls).on('click', function() {
			if(--index < 0) {
				index = len - 1;
			}
			$item.find(optionsValueCls).text(ord[index].getText());
		});

		$item.find(optionsRightCls).on('click', function() {
			if(++index >= len) {
				index = 0;
			}
			$item.find(optionsValueCls).text(ord[index].getText());
		});

		$item.getCurrent = function() {
			return ord[index];
		};

		return $item;
	};

	var createOptionItems = function() {

		var $options = $(optionsId);

		var $mode = createItem($.app.i18n.t.OPTIONS_MODE, modes);
		me.getCurrentMode = $mode.getCurrent;
		$options.append($mode);

		var $language = createItem($.app.i18n.t.OPTIONS_GAME_LANGUAGE, languages);
		me.getCurrentLanguage = $language.getCurrent;
		$options.append($language);
	};

	var initComponent = function() {
		createOptionItems();
	};

	var reset = function() {
		hide();
		$(optionsId).empty();
		initComponent();
	};

	var show = function() {
		$(optionsId).addClass(showCls);
	};

	var hide = function() {
		$(optionsId).removeClass(showCls);
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		show: show,
		hide: hide,
		modes: modes,
		getCurrentMode: function() {
		},
		languages: languages,
		getCurrentLanguage: function() {
		}
	};

	$.app.options = $.app.registerComponent(me);

})(jQuery);
