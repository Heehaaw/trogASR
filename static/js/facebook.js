/**
 * Author: Janek Milota
 * Date: 23.03.2015
 */
$.app.fb = function($) {

	var fbIframeTemplateId = 'tpl_fbIframe';
	var fbHolderId = '#fbHolder';

	var appId = '935335873184642';
	var domain = 'localhost';
	var href = 'http://' + domain + ':5000';
	var channelOrigin = href + '/f1c6eecfc';
	var channel = 'http://static.ak.facebook.com/connect/xd_arbiter/6Dg4oLkBbYq.js?version=41#cb=f36ec96e28&domain=' + domain + '&origin=' + encodeURIComponent(channelOrigin) + '&relation=parent.parent';

	var widgetTypes = {
		LIKE: {
			id: 'LIKE',
			type: 'like',
			width: {
				cs: '190px',
				en: '160px'
			}
		},
		LOGIN: {
			id: 'LOGIN',
			type: 'login_button',
			width: {
				cs: '95px',
				en: '80px'
			}
		}
	};
	var widgetLocales = {
		en: 'en_US',
		cs: 'cs_CZ'
	};

	var createWidgets = function() {

		var currentLocale = $.app.i18n.getCurrentLocale();
		var widgetLocale = widgetLocales[currentLocale] || '';

		var htmlBuffer = $.app.templates.process(fbIframeTemplateId, {
				widgetType: widgetTypes.LOGIN.type,
				appId: appId,
				locale: widgetLocale,
				urlParams: {
					auto_logout_link: true,
					channel: encodeURIComponent(channel),
					max_rows: 1,
					size: 'medium',
					sdk: 'joey'
				},
				styles: {
					width: widgetTypes.LOGIN.width[currentLocale]
				}
			}
		);

		htmlBuffer += $.app.templates.process(fbIframeTemplateId, {
				widgetType: widgetTypes.LIKE.type,
				appId: appId,
				locale: widgetLocale,
				urlParams: {
					href: encodeURIComponent(href),
					color_scheme: 'dark',
					layout: 'button_count',
					share: true,
					show_faces: false,
					sdk: 'joey'
				},
				styles: {
					width: widgetTypes.LIKE.width[currentLocale],
					position: 'relative',
					top: '1px'
				}
			}
		);

		$(fbHolderId).append(htmlBuffer);
	};

	var initComponent = function() {

		createWidgets();

		$.ajaxSetup({
			cache: true
		});

		$.getScript('https://connect.facebook.net/en_US/all.js', function() {

			FB.init({
				appId: appId,
				cookie: true,
				version: 'v2.2'
			});

		});
	};

	var reset = function() {
		$(fbHolderId).empty();
		createWidgets();
	};

	var me = {
		initComponent: initComponent,
		reset: reset
	};

	return $.app.registerComponent(me);

}(jQuery);