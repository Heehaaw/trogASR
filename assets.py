__author__ = 'Janek'

from flask.ext.assets import Bundle

bundles = {
	'all-css': Bundle(
		'css/style.css',
		output='gen/all.css',
		filters='cssmin'
	),
	'all-js': Bundle(
		'js/lib/jquery-2.1.3.js',
		'js/appInit.js',
		'js/menu.js',
		output='gen/all.js',
		filters='jsmin'
	)
}