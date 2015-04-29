# Copyright 2015 Jan Milota
# Licensed under the Apache License, Version 2.0 (see the "LICENSE");

__author__ = 'Janek Milota'

import os
import sqlite3

from configuration import db_config


class ConnectionManager:
	"""
	Manages DB connection reuse
	"""

	def __init__(self, connection=None):
		"""
		Initializes the connection manager
		:param connection: the connection to wrap
		"""
		self.connection = connection

	def __enter__(self):
		"""
		Decides whether to create a new connection and close it on exit or not
		:return: wrapped connection
		"""
		if self.connection is not None:
			self.close_on_exit = False
		else:
			self.close_on_exit = True
			self.connection = sqlite3.connect(db_config.db_location)
		return self.connection

	# noinspection PyUnusedLocal
	def __exit__(self, exc_type, exc_val, exc_tb):
		"""
		If the connection has not been created by this wrapper, do not close it on exit
		:param exc_type: not used
		:param exc_val: not used
		:param exc_tb: not used
		"""
		if self.close_on_exit:
			self.connection.close()


def init_db():
	"""
	Initializes the database
	"""
	do_init = not os.path.exists(db_config.db_location)
	with ConnectionManager() as conn:
		if do_init:
			if not os.path.exists(db_config.schema_location):
				print('Schema not found!')
			else:
				print('Creating DB...')
				# Create the DB from the provided schema
				with open(db_config.schema_location, 'rt') as f:
					conn.executescript(f.read())
				# Insert dummy data
				insert_word('hi', ['ahoj', 'cau', 'nazdar'], 'en', 'cs')
				insert_word('hello', ['ahoj', 'cau', 'nazdar'], 'en', 'cs')
				insert_word('ahoj', ['hello', 'hi'], 'cs', 'en')
				insert_word('cau', ['hello', 'hi'], 'cs', 'en')
				conn.commit()
		else:
			print('DB already in place')

		# Register the proper row factory
		conn.row_factory = sqlite3.Row

	# print(get_random_word_with_meanings('en', 'cs'))


def query_db(query, args=(), single=False, connection=None):
	"""
	Executes a DB query on the given connection (or creates its own)
	:param query: the query to execute
	:param args: query arguments
	:param single: return only single result?
	:param connection: the connection to work with
	:return: dictionary containing the query results
	"""
	with ConnectionManager(connection) as conn:
		c = conn.execute(query, args)
		rv = [dict((c.description[idx][0], value) for idx, value in enumerate(row)) for row in c.fetchall()]
		return (rv[0] if rv else None) if single else rv


def insert_word(word, meanings, source_lang, target_lang):
	"""
	Inserts a word
	:param word: word text
	:param meanings: meanings text array
	:param source_lang: source language
	:param target_lang: target language
	"""

	# Helper fetch function
	def get_word_id(w, language):
		r = conn.execute('SELECT * FROM words WHERE text = ? AND language = ?', [w, language]).fetchall()
		if len(r) > 0:
			# We already have the word in this language, use it
			return r[0][0]
		else:
			# Otherwise we insert a new entry
			return conn.execute('INSERT INTO words(text, language) VALUES (?, ?)', [w, language]).lastrowid

	with ConnectionManager() as conn:
		word_id = get_word_id(word, source_lang)
		for meaning in meanings:
			meaning_id = get_word_id(meaning, target_lang)
			conn.execute('INSERT INTO word_meanings(word_id, meaning_id) VALUES (?, ?)', [word_id, meaning_id])
		conn.commit()


def get_random_word_with_meanings(source_language, target_language):
	"""
	Gets a random word with its text and meanings (nothing else)
	:param source_language: source language
	:param target_language: target language
	:return: random word
	"""
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


def insert_leaderboards_entry(user_name, points, source_language, target_language, lives, suggestions, round_time, game_time):
	"""
	Inserts a leaderboards entry for the given params
	:param user_name: user name
	:param points: points
	:param source_language: source language
	:param target_language: target language
	:param lives: lives
	:param suggestions: suggestions
	:param round_time: round time
	:param game_time: game time
	"""
	with ConnectionManager() as conn:
		conn.execute(
			'INSERT INTO leaderboards (user_name, points, source_language, target_language, lives, suggestions, round_time, game_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[user_name, points, source_language, target_language, lives, suggestions, round_time, game_time])
		conn.commit()


def get_leaderboards(source_language, target_language, lives, suggestions, round_time, game_time):
	"""
	Returns the leaderboards entry list for the given params
	:param source_language: source language
	:param target_language: target language
	:param lives: lives
	:param suggestions: suggestions
	:param round_time: round time
	:param game_time: game time
	:return:leaderboard entry list
	"""
	return query_db(
		'''
		SELECT user_name userName, points
		FROM leaderboards
		WHERE source_language = ? AND target_language = ? AND lives = ? AND suggestions = ? AND round_time = ? AND game_time  = ?
		ORDER BY points DESC
		''',
		[source_language, target_language, lives, suggestions, round_time, game_time])