# Copyright 2015 Jan Milota
# Licensed under the Apache License, Version 2.0 (see the "LICENSE");

__author__ = 'Janek Milota'

import json

from flask import render_template, Blueprint, request

from configuration import view_config
import dao

mod = Blueprint('app', __name__)


@mod.route('/')
def home():
	"""
	Home mapping - gets the index template
	"""
	return render_template('index.html', host=view_config.host, appId=view_config.appId)


@mod.route('/getWord.json', )
def get_word():
	"""
	Gets a random word
	:rtype : json
	"""
	return json.dumps(dao.get_random_word_with_meanings(request.args['source_language'], request.args['target_language']))


@mod.route('/getLeaderboards.json', )
def get_leaderboards():
	"""
	Gets leaderboards for the given request arguments
	:rtype : json
	"""
	return json.dumps(dao.get_leaderboards(
		request.args['sourceLanguage'],
		request.args['targetLanguage'],
		request.args['lives'],
		request.args['suggestions'],
		request.args['roundTime'],
		request.args['gameTime']))


@mod.route('/insertLeaderboardsEntry.json', )
def insert_leaderboards_entry():
	"""
	Inserts a leaderboards entry for the given request arguments
	:rtype : json
	"""
	dao.insert_leaderboards_entry(
		request.args['userName'],
		request.args['points'],
		request.args['sourceLanguage'],
		request.args['targetLanguage'],
		request.args['lives'],
		request.args['suggestions'],
		request.args['roundTime'],
		request.args['gameTime'])
	return json.dumps({'success': True})
