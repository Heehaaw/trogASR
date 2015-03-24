/**
 * Author: Janek Milota
 * Date: 23.03.2015
 */
$.app.fb = function($) {

	$.ajaxSetup({cache: true});
	$.getScript('//connect.facebook.net/en_US/all.js', function() {
		FB.init({
			appId: '935335873184642',
			xfbml: true,
			cookie: true,
			status: true,
			version: 'v2.2'
		});
		$('#loginbutton,#feedbutton').removeAttr('disabled');
		//FB.getLoginStatus(updateStatusCallback);
	});

	var statusChangeCallback = function(response) {
		console.log('statusChangeCallback');
		console.log(response);
		if(response.status === 'connected') {
			testAPI();
		}
		else if(response.status === 'not_authorized') {
			alert('Please log ' + 'into this app.');
		}
		else {
			alert('Please log ' + 'into Facebook.');
		}
	};

	var initComponent = function() {

	};

	var me = {
		initComponent: initComponent,
		reset: function() {
		}
		//checkLoginState: checkLoginState
	};
	return $.app.registerComponent(me);
}(jQuery);