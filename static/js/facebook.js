/**
 * Author: Janek Milota
 * Date: 23.03.2015
 */
(function($) {

	var fbWidgetTemplateId = 'tpl_fbWidget';
	var userInfoItemTemplateId = 'tpl_userInfoItem';
	var fbHolderId = '#fbHolder';

	var widgets = {
		LIKE: {
			id: 'LIKE',
			type: 'fb-like',
			data: {
				href: 'http://' + $.app.host,
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

	var currentUserName = null;

	var initComponent = function() {

		createWidgets();

		var userLocale = navigator.language || navigator.userLanguage || 'en_US';
		userLocale = userLocale.replace('-', '_');

		$.ajaxSetup({
			cache: true
		});

		$.getScript('https://connect.facebook.net/' + userLocale + '/all.js', function() {

			var $userInfoItem = null;

			FB.Event.subscribe('auth.statusChange', function(response) {

				if($userInfoItem) {
					$userInfoItem.remove();
					$userInfoItem = null;
					currentUserName = null;
				}

				if(response.status === 'connected') {
					FB.api('/me?fields=name,picture', function(response) {
						$userInfoItem = $.app.templates.process(userInfoItemTemplateId, {
							imageUrl: response.picture.data.url,
							userName: currentUserName = response.name
						}, true);
						$(fbHolderId).prepend($userInfoItem);
					});
				}
			});

			FB.init({
				appId: $.app.appId,
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
		reset: reset,
		getCurrentUserName: function() {
			return currentUserName;
		}
	};

	$.app.fb = $.app.registerComponent(me);

})(jQuery);