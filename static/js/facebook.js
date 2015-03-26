/**
 * Author: Janek Milota
 * Date: 23.03.2015
 */
$.app.fb = function($) {

	var fbWidgetTemplateId = 'tpl_fbWidget';
	var userInfoItemTemplateId = 'tpl_userInfoItem';
	var fbHolderId = '#fbHolder';
	var userInfoItemClass = '.userInfoItem-wrapper';

	var appId = '935335873184642';
	var href = 'http://192.168.2.4';

	var widgets = {
		LIKE: {
			id: 'LIKE',
			type: 'fb-like',
			data: {
				href: href,
				layout: 'button_count',
				action: 'like',
				'show-faces': 'false',
				share: true
			}
		},
		LOGIN: {
			id: 'LOGIN',
			type: 'fb-login-button',
			data: {
				'max-rows': 1,
				size: 'medium',
				'show-faces': false,
				'auto-logout-link': true
			}
		}
	};

	var createWidgets = function() {

		var htmlBuffer = $.app.templates.process(fbWidgetTemplateId, {
				widgetType: widgets.LIKE.type,
				data: widgets.LIKE.data
			}
		);

		htmlBuffer += $.app.templates.process(fbWidgetTemplateId, {
				widgetType: widgets.LOGIN.type,
				data: widgets.LOGIN.data
			}
		);

		$(fbHolderId).append(htmlBuffer);
	};

	var initComponent = function() {

		createWidgets();

		var userLocale = navigator.language || navigator.userLanguage || 'en_US';
		userLocale = userLocale.replace('-', '_');

		$.ajaxSetup({
			cache: true
		});

		$.getScript('https://connect.facebook.net/' + userLocale + '/all.js', function() {

			FB.Event.subscribe('auth.statusChange', function(response) {

				var $fbHolder = $(fbHolderId);
				$fbHolder.find(userInfoItemClass).remove();

				if(response.status === 'connected') {
					FB.api('/me?fields=name,picture', function(response) {
						$fbHolder.prepend($.app.templates.process(userInfoItemTemplateId, {
							imageUrl: response.picture.data.url,
							userName: response.name
						}));
					});
				}
			});

			FB.init({
				appId: appId,
				cookie: true,
				status: true,
				xfbml: true,
				version: 'v2.2'
			});
		});
	};

	var reset = function() {
	};

	var me = {
		initComponent: initComponent,
		reset: reset
	};

	return $.app.registerComponent(me);

}(jQuery);