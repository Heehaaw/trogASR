__author__ = 'Janek Milota'

import json

from flask import render_template, Blueprint, request

from configuration import view_config
import dao

mod = Blueprint('app', __name__)


@mod.route('/')
def home():
	return render_template('index.html', host=view_config.host, appId=view_config.appId)


@mod.route('/getWord.json', )
def getWord():
	return json.dumps(dao.get_random_word_with_meanings(request.args['source_language'], request.args['target_language']))