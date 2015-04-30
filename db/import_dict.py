__author__ = 'Janek Milota'

import csv

from dao import ConnectionManager
from dao import init_db
from dao import insert_word


def import_dict(path, source_lang, target_lang):
	init_db()
	with ConnectionManager() as conn:
		with open(path, 'rt', encoding='utf8') as f:
			reader = csv.reader(f, delimiter=';')
			for row in reader:
				map(str.strip, row)
				insert_word(row[0], row[1:], source_lang, target_lang, conn)