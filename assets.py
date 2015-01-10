__author__ = 'Janek'

from flask.ext.assets import Bundle

bundles = {
	'all-js': Bundle(
		'js/lib/jquery-2.1.3.js',
		output='js/gen/all.js',
		filters='jsmin'
	)
}