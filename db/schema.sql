/*
Copyright 2015 Jan Milota
Licensed under the Apache License, Version 2.0 (see the "LICENSE");
*/
CREATE TABLE words (
  word_id  INTEGER NOT NULL CONSTRAINT pk PRIMARY KEY AUTOINCREMENT,
  language TEXT    NOT NULL,
  text     TEXT,
  CONSTRAINT unique_language_word UNIQUE (language, text)
);

CREATE TABLE word_meanings (
  word_meaning_id INTEGER NOT NULL CONSTRAINT pk PRIMARY KEY AUTOINCREMENT,
  word_id         INTEGER NOT NULL,
  meaning_id      INTEGER NOT NULL,
  CONSTRAINT fk_words FOREIGN KEY (word_id) REFERENCES words (word_id),
  CONSTRAINT fk_meanings FOREIGN KEY (meaning_id) REFERENCES words (word_id)
);

CREATE TABLE leaderboards (
  leaderboard_id  INTEGER NOT NULL CONSTRAINT pk PRIMARY KEY AUTOINCREMENT,
  user_name       TEXT    NOT NULL,
  points          INTEGER NOT NULL,
  source_language TEXT    NOT NULL,
  target_language TEXT    NOT NULL,
  lives           INTEGER NOT NULL,
  suggestions     INTEGER NOT NULL,
  round_time      INTEGER NOT NULL,
  game_time       INTEGER NOT NULL
);