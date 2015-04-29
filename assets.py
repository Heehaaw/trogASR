# Copyright 2015 Jan Milota
# Licensed under the Apache License, Version 2.0 (see the "LICENSE");

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
		'js/app.js',
		'js/i18n.js',
		'js/templates.js',
		'js/facebook.js',
		'js/spriteFactory.js',
		'js/menu.js',
		'js/options.js',
		'js/leaderboards.js',
		'js/game.js',
		output='gen/all.js',
		filters='jsmin'
	)
}