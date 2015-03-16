__author__ = 'Janek Milota'

from flask.ext.assets import Bundle

bundles = {
	'all-css': Bundle(
		'css/style.css',
		'css/font.css',
		output='gen/all.css',
		filters='cssmin'
	),
	'all-js': Bundle(
		'js/lib/jquery-2.1.3.js',
		'js/appInit.js',
		'js/i18n.js',
		'js/spriteFactory.js',
		'js/menu.js',
		'js/options.js',
		output='gen/all.js',
		filters='jsmin'
	)
}