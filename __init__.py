__author__ = 'Janek Milota'

from flask import Flask, render_template
from flask.ext.assets import Environment

import configuration
import assets


app = Flask(__name__)
app.config.from_object(configuration)

Environment(app).register(assets.bundles)


@app.route('/')
def home():
	return render_template('index.html', host=configuration.host, appId=configuration.appId)


if __name__ == '__main__':
	app.run(host=configuration.host, port=configuration.port)