__author__ = 'Janek Milota'

import os
import sqlite3

from configuration import db_config


class ConnectionManager:
	def __init__(self, connection=None):
		self.connection = connection

	def __enter__(self):
		if self.connection is not None:
			self.close_on_exit = False
			return self.connection
		else:
			self.close_on_exit = True
			self.connection = sqlite3.connect(db_config.db_location)
			return self.connection

	# noinspection PyUnusedLocal
	def __exit__(self, exc_type, exc_val, exc_tb):
		if self.close_on_exit:
			self.connection.close()


def init_db():
	do_init = not os.path.exists(db_config.db_location)
	with ConnectionManager() as conn:
		if do_init:
			if not os.path.exists(db_config.schema_location):
				print('Schema not found!')
			else:
				print('Creating DB...')
				with open(db_config.schema_location, 'rt') as f:
					conn.executescript(f.read())
				insert_word('hi', ['ahoj', 'cau', 'nazdar'], 'en', 'cs')
				insert_word('hello', ['ahoj', 'cau', 'nazdar'], 'en', 'cs')
				insert_word('ahoj', ['hello', 'hi'], 'cs', 'en')
				insert_word('cau', ['hello', 'hi'], 'cs', 'en')
				conn.commit()
		else:
			print('DB already in place')

		conn.row_factory = sqlite3.Row

	# print(get_random_word_with_meanings('en', 'cs'))


def query_db(query, args=(), single=False, connection=None):
	with ConnectionManager(connection) as conn:
		c = conn.execute(query, args)
		rv = [dict((c.description[idx][0], value) for idx, value in enumerate(row)) for row in c.fetchall()]
		return (rv[0] if rv else None) if single else rv


def insert_word(word, meanings, source_lang, target_lang):
	def get_word_id(w, language):
		r = conn.execute('SELECT * FROM words WHERE text = ? AND language = ?', [w, language]).fetchall()
		if len(r) > 0:
			return r[0][0]
		else:
			return conn.execute('INSERT INTO words(text, language) VALUES (?, ?)', [w, language]).lastrowid

	with ConnectionManager() as conn:
		word_id = get_word_id(word, source_lang)
		for meaning in meanings:
			meaning_id = get_word_id(meaning, target_lang)
			conn.execute('INSERT INTO word_meanings(word_id, meaning_id) VALUES (?, ?)', [word_id, meaning_id])
		conn.commit()


def get_random_word_with_meanings(source_language, target_language):
	with ConnectionManager() as conn:
		w = query_db(
			'SELECT w.word_id, w.text, w.language FROM words w INNER JOIN word_meanings wm ON w.word_id = wm.word_id WHERE language = ? ORDER BY RANDOM() LIMIT 1',
			[source_language], True, conn)
		if w is None:
			return None
		w['meanings'] = query_db(
			'SELECT w.text, w.language FROM word_meanings wm JOIN words w ON w.word_id = wm.meaning_id WHERE wm.word_id = ? AND w.language = ?',
			[w['word_id'], target_language], False, conn)
		del w['word_id']
		return w