from flask import Flask

import configuration


app = Flask(__name__)
app.config.from_object(configuration)


@app.route('/')
def hello_world():
	return 'Hello World!' + 'asdasdasd'


if __name__ == '__main__':
	app.run()
