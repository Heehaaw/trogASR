/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers a facebook api wrapper and provider component.
 *
 * Author: Janek Milota
 * Date: 23.03.2015
 */
(function($, ns) {

	// String constants
	var fbWidgetTemplateId = 'tpl_fbWidget';
	var userInfoItemTemplateId = 'tpl_userInfoItem';
	var fbHolderId = '#fbHolder';

	/**
	 * Widget 'enum', contains used facebook widget setup data
	 * @readonly
	 * @enum {{id: string, type: string, data: object}}
	 */
	var widgets = {
		LIKE: {
			id: 'LIKE',
			type: 'fb-like',
			data: {
				href: 'http://' + APP.host,
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

	/**
	 * Creates all facebook widgets. Uses the widgets 'enum' just for this purpose.
	 */
	var createWidgets = function() {

		var htmlBuffer = APP.TEMPLATES.process(fbWidgetTemplateId, {
				widgetType: widgets.LIKE.type,
				data: widgets.LIKE.data
			}
		);

		htmlBuffer += APP.TEMPLATES.process(fbWidgetTemplateId, {
				widgetType: widgets.LOGIN.type,
				data: widgets.LOGIN.data
			}
		);

		$(fbHolderId).append(htmlBuffer);
	};

	// Cached user name if the user is logged in through the fb api
	var currentUserName = null;

	/**
	 * Gets the current user name or null
	 * @returns {string} current user name
	 */
	var getCurrentUserName = function() {
		return currentUserName;
	};

	/**
	 * Initializes the component.
	 */
	var initComponent = function() {

		// First create the static header widgets
		createWidgets();

		// Infer the locale from the browser setup. If not available, default to en_US
		var userLocale = navigator.language || navigator.userLanguage || 'en_US';
		userLocale = userLocale.replace('-', '_');

		// We'd like to cache the fb api ajax calls
		$.ajaxSetup({
			cache: true
		});

		// Get the fb api script according to the inferred user locale
		$.getScript('https://connect.facebook.net/' + userLocale + '/all.js', function() {

			// We will need to cache the user info element
			var $userInfoItem = null;

			// Subscribe to the statusChange event. This event is risen whenever there is a change in the user - app - facebook relation
			FB.Event.subscribe('auth.statusChange', function(response) {

				if($userInfoItem) {
					// Clear the cached data if there are any
					$userInfoItem.remove();
					$userInfoItem = null;
					currentUserName = null;
				}

				// Check for successful connection
				if(response.status === 'connected') {
					// Query the api for user name and picture url
					FB.api('/me?fields=name,picture', function(response) {
						// Create the user info item and fill it up with received data
						//noinspection JSUnresolvedVariable
						$userInfoItem = APP.TEMPLATES.process(userInfoItemTemplateId, {
							imageUrl: response.picture.data.url,
							userName: currentUserName = response.name
						}, true);
						// Append the item to DOM
						$(fbHolderId).prepend($userInfoItem);
					});
				}
			});

			// Initialize the fb api
			FB.init({
				// Mandatory app id - provided by backend
				appId: APP.appId,
				cookie: true,
				status: true,
				// Use eXtended Facebook Markup Language for processing the widgets in our DOM
				xfbml: true,
				version: 'v2.2'
			});
		});
	};

	/**
	 * Resets the component. No work needs to be done here as of yet.
	 */
	var reset = function() {
	};

	// Component assembling
	var fb = {
		initComponent: initComponent,
		reset: reset,
		getCurrentUserName: getCurrentUserName
	};

	/**
	 * The facebook component
	 * @namespace
	 * @alias APP.FB
	 */
	ns.FB = ns.registerComponent(fb);

})(jQuery, APP);