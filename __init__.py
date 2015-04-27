__author__ = 'Janek Milota'

from flask import Flask
from flask.ext.assets import Environment

from assets import bundles
from controller import mod
from configuration import app_config, view_config
import dao


app = Flask(__name__)

app.config.from_object(app_config)
app.register_blueprint(mod)

Environment(app).register(bundles)

dao.init_db()

if __name__ == '__main__':
	app.run(host=view_config.host, port=view_config.port)
