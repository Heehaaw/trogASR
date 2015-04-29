/*
 * Copyright 2015 Jan Milota
 * Licensed under the Apache License, Version 2.0 (see the "LICENSE");
 */
/**
 * Creates and registers a game component.
 *
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($, ns) {

	// String constants
	var gameId = '#game';
	var gameButtonWrapperCls = '.gameButton-wrapper';
	var bannerId = '#banner';
	var bubbleDebrisClass = 'bubbleDebris';
	var recordBtnClass = 'recordBtn';
	var exitBtnClass = 'exitBtn';
	var recordingClass = 'recording';
	var gameWordClass = 'gameWord';
	var gameInfoClass = 'gameInfo';
	var gameResultInfoClass = 'gameResultInfo';
	var gameWordOptionClass = 'gameWordOption';
	var gameOptionHolderClass = 'gameOptionHolder';
	var gameWordStackClass = 'gameWordStack';
	var gameStatsClass = 'gameStats';
	var livesClass = 'lives';
	var gameTimeClass = 'gameTime';
	var roundTimeClass = 'roundTime';
	var gearLoaderClass = 'gearLoader';

	// Cache the SpeechRecognition object
	var speechRecognition;
	// Cache the last round number so we know when to process results
	var lastRoundNr;

	/**
	 * Maps app locale to a speech recognition model
	 * @enum {string}
	 */
	var recognitionModelMap = {
		cs: 'cs',
		en: 'en-voxforge'
	};

	/**
	 * Initializes the SpeechRecognition object and binds its handles
	 */
	var initSpeechRecognition = function() {

		// Create the object bound to api url
		speechRecognition = new SpeechRecognition('http://api.cloudasr.com:80');
		//speechRecognition = {
		//	start: function() {
		//	},
		//	stop: function() {
		//	}
		//};

		// Result handler
		speechRecognition.onresult = function(result) {

			//noinspection JSUnresolvedVariable
			if(lastRoundNr !== roundNr && result.final) {
				// The result is not interim and we have not processed this round's data yet
				lastRoundNr = roundNr;
				//noinspection JSUnresolvedVariable
				var hypotheses = result.result.hypotheses;
				var results = [];
				// Go through the hypotheses and register their transcripts, if there are any
				for(var i = 0, len = hypotheses.length; i < len; i++) {
					//noinspection JSUnresolvedVariable
					var t = hypotheses[i].transcript;
					if(t) {
						results.push(t);
					}
				}
				// Process the possible result data
				processResult(results);
			}
		};

		// Start handler
		speechRecognition.onstart = function() {
			// Switch the record button's image
			$('.' + recordBtnClass).addClass(recordingClass);
		};

		// End handler
		speechRecognition.onend = function() {
			// Switch the record button's image back
			$('.' + recordBtnClass).removeClass(recordingClass);
			// If this round's results have not been processed yet and we are not in an error state, show the progress gear
			if(lastRoundNr !== roundNr && !err) {
				$gear.fadeIn(100);
			}
			err = false;
			//if(lastRoundNr !== roundNr && !err) {
			//	$gear.fadeIn(100);
			//	lastRoundNr = roundNr;
			//	processResult(['xxx aaaaa bb', 'yyyy yyy zzz', 'yyyy', 'fffffff ff', 'aa aaaaaa']);
			//}
		};

		// Create an error display element
		var $err = $('<div>').css({position: 'absolute', left: '30%', bottom: '3.5%'}).appendTo($(gameId));
		var err = false;

		// Error handle
		speechRecognition.onerror = function(e) {
			$err.html(e);
			err = true;
		};
	};

	// Cached process gear element
	var $gear;

	/**
	 * Creates the game's buttons and static elements
	 */
	var createButtons = function() {

		var $game = $(gameId);

		// Create the record button and bind its click event
		APP.SPRITE_FACTORY.createGameButtonSprite(recordBtnClass, APP.I18N.t.GAME_BUTTON_RECORD, true)
			.on('click', function() {
				if(!speechRecognition.isRecording) {
					// We are not recording -> select the proper model and start to do so
					speechRecognition.start(recognitionModelMap[targetLanguage]);
				}
				else {
					speechRecognition.stop();
					//rec = false;
					//if(lastRoundNr !== roundNr && !err) {
					//	$gear.fadeIn(100);
					//	lastRoundNr = roundNr;
					//	processResult(['xxx aaaaa bb', 'yyyy yyy zzz', 'yyyy', 'fffffff ff', 'aa aaaaaa']);
					//}
					//err = false;
				}
			})
			.appendTo($game);

		// Create the exit button and bind its click event
		APP.SPRITE_FACTORY.createGameButtonSprite(exitBtnClass, APP.I18N.t.GAME_BUTTON_EXIT, true)
			.on('click', exit)
			.appendTo($game);

		// Create and cache the progress gear
		$gear = $('<div>')
			.addClass(gearLoaderClass)
			.hide()
			.appendTo($game);
	};

	/**
	 * Creates a game word sprite. This sprite is scaled according to the given parameters.
	 * @param {string} word a word to make into a sprite
	 * @param {number} sizeMult multiplier of the sprite's letter's sizes
	 * @param {number} maxWidth max width of the word sprite
	 * @returns {object} created word sprite
	 */
	var createGameWordSprite = function(word, sizeMult, maxWidth) {
		// Calculate the supposed sprite width
		var sw = APP.SPRITE_FACTORY.getLetterMetrics() * sizeMult * word.length;
		// Create the sprite while adjusting its width
		return APP.SPRITE_FACTORY.createWordSprite(word, sw > maxWidth ? sizeMult * (maxWidth / sw) : sizeMult, true);
	};

	/**
	 * Exits the game
	 */
	var exit = function() {

		// Clear the timing intervals, if present
		if(gameTimeHandle) {
			clearInterval(gameTimeHandle);
		}
		if(roundTimeHandle) {
			clearInterval(roundTimeHandle);
		}

		var $game = $(gameId);

		// Create the result info dialog
		var $resultInfo = $('<div>')
			.addClass(gameResultInfoClass)
			// Add the formatted localized message
			.append($('<div>').html(APP.I18N.t.GAME_INFO_END.format(points)))
			// Add the OK button
			.append(APP.SPRITE_FACTORY.createWordSprite('ok', 1, true)
				.addClass(gameWordOptionClass)
				.css({
					// Center the button
					left: '50%',
					transform: 'translate(-50%)'
				})
				// Bind the exit functionality
				.on('click', function() {
					$resultInfo.fadeOut(400, function() {
						// After the dialog's hiding, show the menu and clear the game board
						APP.MENU.show();
						//noinspection JSValidateTypes
						$game.children().not(gameButtonWrapperCls).not('.' + gearLoaderClass).remove();
						$resultInfo.remove();
					});
				}))
			.hide()
			// Append to the game board first so the component acquires a context
			.appendTo('#body');
		$resultInfo
			.css({
				// Center the dialog
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)'
			});

		// Prompt the fb api for the current user name
		var currentUserName = APP.FB.getCurrentUserName();
		if(currentUserName && points > 0) {
			// The user is logged in and has scored some points -> upload this data for the current game setup
			$.ajax({
				url: 'insertLeaderboardsEntry.json',
				data: {
					userName: currentUserName,
					points: points,
					sourceLanguage: sourceLanguage,
					targetLanguage: targetLanguage,
					lives: maxLives,
					suggestions: maxOptionCount + 1,
					roundTime: roundTime,
					gameTime: gameTime
				}
			});
		}

		// Gide the game board and show the result info
		$game.fadeOut(400, function() {
			$resultInfo.fadeIn(300);
		});
	};

	// Cached variables and components for better re-use
	var displayWCenter;
	var displayHTop;
	var spriteWOrigin;
	var spriteHOrigin;
	var stackTop;
	var roundNr;
	var points;
	var $word;
	var $info;
	var $optionHolder;
	var $wordStack;
	var $lives;

	/**
	 * Exits the round successfully
	 */
	var successRound = function() {

		// Score a point!
		points++;

		// Hide the game board components that do not have to be shown
		$info.fadeOut(100);
		$optionHolder.fadeOut(300);

		// Calculate the current word sprite's properties
		var w = $word.width();
		var h = $word.height();
		var stackH = $wordStack.height();
		var sw = $wordStack.width() * 0.9;
		// Compute and apply the scale so the word sprite fits into the stack
		var scale = w > sw ? sw / w : 1;
		h *= scale;

		$word
			// Pop the word sprite out from the top of the viewport
			.animate({
				top: -displayHTop / 2,
				opacity: 0
			}, 300, function() {
				$word
					// Scale and position the word just above the stack
					.css({
						left: '50%',
						top: -h,
						opacity: 1,
						transform: 'scale(' + scale + ') translate(-50%)'
					})
					// Reallocate the word sprite through the DOM - append it to the stack
					.appendTo($wordStack)
					// Let it drop to the stack's top
					.animate({
						top: stackTop -= h
					}, 300, function() {
						if(stackTop < stackH * 0.25) {
							// If the stack is too full, slide it down a little
							var offset = stackTop - (stackTop += stackH * 0.5);
							$wordStack.children().animate({
								top: '-=' + offset
							}, 300, function() {
								var $me = $(this);
								if($me.position().top > stackH) {
									// Remove the out-of-viewport sprites (they will never be visible again)
									$me.remove();
								}
							});
						}
						// Clear the round
						newRound();
					});
			});
	};

	/**
	 * Exits the round unsuccessfully
	 */
	var failRound = function() {

		if(!$word) {
			// The word sprite has already been gotten rid of
			return;
		}

		// Hide the game board components that do not have to be shown
		$info.fadeOut(100);
		$optionHolder.fadeOut(300);

		// Calculate the word sprite's properties and prepare the bubble particles for the final effect
		var w = $word.width();
		var h = $word.height();
		var angle = 0;
		var startX = w / 2;
		var startY = h / 2;
		var particleCount = 13;
		// We want the particles to be spread in 360 degrees
		var angleDelta = Math.PI * 2 / particleCount;
		var particleSize = APP.SPRITE_FACTORY.getLetterMetrics() * 0.5;

		for(var i = 0; i < particleCount; i++) {
			// Create a particle
			$('<div/>')
				.addClass(bubbleDebrisClass)
				.css({
					// Position it to its start point
					left: startX,
					top: startY,
					width: particleSize,
					height: particleSize
				})
				.appendTo($word)
				.animate({
					// Randomize its trajectory
					left: startX + Math.cos(angle) * (w / 3 + Math.random() * w / 4),
					top: startY + Math.sin(angle) * (h + Math.random() * h * 1.5),
					width: particleSize / 10,
					height: particleSize / 10,
					opacity: 0
				}, 500);
			// Update the angle and move to next particle
			angle += angleDelta;
		}

		// Fade the word out while the bubble animation is in progress
		$word.fadeOut(550, function() {
			$word.remove();
			if(lives) {
				// The 'lives' option is on -> subtract one and update the counter
				lives--;
				$lives.text(lives);
				if(lives <= 0) {
					// Game over...
					exit();
					return;
				}
			}
			// Clear the round
			newRound();
		});
	};

	/**
	 * Processes the acquired possible recognition outcomes
	 * @param {Array} possibleResults
	 */
	var processResult = function(possibleResults) {

		if(!$word) {
			// The word sprite has already been gotten rid of
			return;
		}

		// Compose the properties for reuse
		var meanings = $word.meanings;
		var meaningsLen = meanings.length;
		var optsLen = possibleResults.length;

		// Go through the possible results and try to find any of the word's meanings in there
		for(i = 0; i < optsLen; i++) {
			var r = (possibleResults[i] || '').toLowerCase();
			for(var j = 0; j < meaningsLen; j++) {
				if(r.indexOf(meanings[j]) >= 0) {
					// We found a match! Hide the progress gear and clear the round successfully
					$gear.fadeOut(100);
					successRound();
					return;
				}
			}
		}

		if(!maxOptionCount) {
			// The 'suggestions' option is turned off; since we were not able to match any meaning to the recognition outcome, fail the round
			$gear.fadeOut(100);
			failRound();
			return;
		}

		// Compute the count of the shown suggestions and placement index of the correct one
		var numOptions = Math.min(optsLen, maxOptionCount);
		var correctResultPos = (Math.random() * (numOptions + 0.99)) >> 0;

		// Compute the suggestion sprites' attributes
		var spriteHMult = 0.5 * (6 / (numOptions + 1));
		var marginTop = APP.SPRITE_FACTORY.getLetterMetrics() * spriteHMult;
		var optionHolderW = $optionHolder.width();
		marginTop = ($optionHolder.height() * 0.9 / (numOptions + 1) - marginTop) >> 0;

		var opts = [];
		// Adds a suggestion to the display holder
		var addOpt = function(word, callback) {
			var $optionSprite = createGameWordSprite(word, spriteHMult, optionHolderW);
			$optionSprite
				// Register the click callback - either fail or succeed
				.on('click', callback)
				.addClass(gameWordOptionClass)
				.css({
					'margin-top': marginTop,
					'margin-bottom': marginTop,
					// Center the sprite
					left: '50%',
					transform: 'translate(-50%)'
				})
				.appendTo($optionHolder);
			// Add to the buffer
			opts.push($optionSprite);
		};

		// Append the suggestion options
		for(var i = 0; i < numOptions; i++) {
			if(i === correctResultPos) {
				// If the correct result is on this position, append it
				addOpt(meanings[(Math.random() * (meaningsLen - 0.01)) >> 0], successRound);
			}
			addOpt(possibleResults[i], failRound);
		}
		if(numOptions === correctResultPos) {
			// If the correct result is last, append it extra
			addOpt(meanings[(Math.random() * (meaningsLen - 0.01)) >> 0], successRound);
		}

		$gear.fadeOut(100, function() {
			// Show the display holder
			$optionHolder.append(opts).fadeIn(300);
		});
	};

	/**
	 * Initializes a new round
	 */
	var newRound = function() {

		// A new round call for the counter update
		roundNr++;
		if(roundTimeHandle) {
			// If the rounds are timed, stop the previous counter
			clearInterval(roundTimeHandle);
		}

		// Fetch next random word in current language setup
		$.getJSON('getWord.json', {
			source_language: sourceLanguage,
			target_language: targetLanguage
		}, function(data) {

			var $game = $(gameId);
			var word = data.text;
			var meanings = data.meanings;
			// Transform the meanings to a more proper structure
			for(var i = 0, len = meanings.length; i < len; i++) {
				meanings[i] = meanings[i].text;
			}

			// Create the word sprite and store the source text and meanings
			$word = createGameWordSprite(word, 1.2, $game.width() / 2)
				.addClass(gameWordClass)
				.appendTo($game);
			$word.sourceText = word;
			$word.meanings = meanings;

			var w = $word.width();
			var h = $word.height();
			// If the rounds are timed, initiate new timer
			roundTimeHandle = roundTime ? createTimeDisplayHandle($roundTime, roundTime, failRound) : null;

			//noinspection JSUnusedGlobalSymbols
			$word
				.css({
					// Position the word sprite to its origination point
					left: spriteWOrigin,
					top: spriteHOrigin - h,
					opacity: 0.3,
					transform: 'scale(0.3)'
				})
				.animate({
					// Move it to the display destination
					opacity: 1,
					left: displayWCenter - (w / 2),
					top: displayHTop,
					transform: 'scale(1)'
				}, {
					duration: 400,
					complete: function() {
						// Show the info
						$info.fadeIn(300);
					}
				});

			// Clear the suggestions
			$optionHolder.children().not('.' + gameInfoClass).remove();
		});
	};

	// Cached game setup and elements
	var sourceLanguage;
	var targetLanguage;
	var maxOptionCount;
	var maxLives;
	var lives;
	var roundTime;
	var gameTime;
	var gameTimeHandle;
	var roundTimeHandle;
	var $gameStats;
	var $roundTime;

	/**
	 * Creates a display timer handle
	 * @param {object} $el element to create the handle for
	 * @param {int} time time-out time
	 * @param {function} callback called after the timer's expiration
	 * @returns {number} an interval handle
	 */
	var createTimeDisplayHandle = function($el, time, callback) {
		var t = time;
		// Create a recurring time-down display
		var handle = setInterval(function() {
			if(t <= 0) {
				// The timer has run off -> exit and proceed
				clearInterval(handle);
				callback();
			}
			// Compute the timer display values
			var val = (t % 60) >> 0;
			var s = val < 10 ? '0' + val : val;
			val = ((t / 60) % 60) >> 0;
			$el.text((val < 10 ? '0' + val : val) + ':' + s);
			t--;
		}, 1000);
		return handle;
	};

	/**
	 * Starts a new game
	 * @param {string} sourceLang the language the words will have been displayed in
	 * @param {string} targetLang the language the user has to say the words in
	 * @param {int} maxOptCount max number of suggestion allowed to be displayed
	 * @param {int} _lives user lives
	 * @param {int} _roundTime time for a round
	 * @param {int} _gameTime time for the game
	 */
	var start = function(sourceLang, targetLang, maxOptCount, _lives, _roundTime, _gameTime) {

		// Cache the settings
		sourceLanguage = sourceLang || APP.I18N.locale.en;
		targetLanguage = targetLang || APP.I18N.locale.cs;
		maxOptionCount = maxOptCount ? maxOptCount - 1 : null;
		maxLives = lives = _lives;
		roundTime = _roundTime;
		gameTime = _gameTime;

		// Display the game and hide the progress gear
		var $game = $(gameId);
		$gear.hide();
		$game.show();

		// Create the game info display holder
		$info = $('<div>')
			// Add an info text according to current locale and target language
			.text(APP.I18N.t.GAME_INFO + APP.I18N.t['GAME_INFO_IN_' + targetLanguage])
			.addClass(gameInfoClass)
			.hide()
			// Append first so it acquires a context
			.appendTo($game);
		$info.css({
			// Place the info
			top: displayHTop - $info.height() * 1.4,
			left: displayWCenter - $info.width() / 2
		});

		// Create an suggestion holder display
		$optionHolder = $('<div>')
			.addClass(gameOptionHolderClass)
			.append($('<div>')
				// Create and add a title
				.text(APP.I18N.t.GAME_INFO_OPTIONS_TITLE)
				.addClass(gameInfoClass)
				.css({top: 0, left: 0}))
			.hide()
			.appendTo($game);

		// Create the word stack
		$wordStack = $('<div>')
			.addClass(gameWordStackClass)
			.appendTo($game);

		// Cache the stack top
		stackTop = $wordStack.height();

		// Create the game stats display holder
		$gameStats = $('<div>')
			.addClass(gameStatsClass)
			.appendTo($game);

		if(lives) {
			// If the 'lives' option is on, create a lives display holder and add it to the game stats display
			$lives = $('<div>')
				.addClass(livesClass)
				.text(lives)
				.appendTo($gameStats);
		}

		// If the game is timed, create a display timer
		gameTimeHandle = gameTime ? createTimeDisplayHandle($('<div>').addClass(gameTimeClass).appendTo($gameStats), gameTime, exit) : null;

		if(roundTime) {
			// If the rounds are timed, create a round time display holder
			$roundTime = $('<div>').addClass(roundTimeClass).appendTo($gameStats);
		}

		// Reset points
		points = roundNr = lastRoundNr = 0;
		// Hide the loader and begin the game!
		APP.getLoader().delayedHide(1000);
		setTimeout(newRound, 2000);
	};

	/**
	 * Measures the static game board elements and caches their properties
	 */
	var measure = function() {

		var $game = $(gameId);
		// Denotes where the word sprite will be displayed
		displayWCenter = $game.width() / 2;
		displayHTop = $game.height() / 6;

		var $banner = $(bannerId);
		var offset = $banner.offset();
		// Denotes where the word sprite will pop in from
		spriteWOrigin = offset.left + $banner.width() / 2;
		spriteHOrigin = offset.top + $banner.height() * 0.75;
	};

	/**
	 * initializes the component
	 */
	var initComponent = function() {
		initSpeechRecognition();
		createButtons();
		measure();
	};

	/**
	 * Resets the component
	 */
	var reset = function() {
		// Clear the game board and re-do the statics
		$(gameId).hide().empty();
		createButtons();
		measure();
	};

	// Assemble component
	var game = {
		initComponent: initComponent,
		reset: reset,
		start: start
	};

	/**
	 * The GAME component
	 * @namespace
	 * @alias APP.GAME
	 */
	ns.GAME = ns.registerComponent(game);

})(jQuery, APP);