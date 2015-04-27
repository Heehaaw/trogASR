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