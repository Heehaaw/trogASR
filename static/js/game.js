/**
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($) {

	var gameId = '#game';
	var gameButtonWrapperCls = '.gameButton-wrapper';
	var bannerId = '#banner';
	var bubbleDebrisClass = 'bubbleDebris';
	var recordBtnClass = 'recordBtn';
	var exitBtnClass = 'exitBtn';
	var recordingClass = 'recording';
	var gameWordClass = 'gameWord';
	var gameInfoClass = 'gameInfo';
	var gameWordOptionClass = 'gameWordOption';
	var gameOptionHolderClass = 'gameOptionHolder';
	var gameWordStackClass = 'gameWordStack';

	var speechRecognition;
	var lastRoundNr = -1;

	var initSpeechRecognition = function() {

		speechRecognition = new SpeechRecognition('http://demo.cloudasr.com:80/');
		//speechRecognition = {
		//	start: function() {
		//	},
		//	stop: function() {
		//	}
		//};

		speechRecognition.onresult = function(result) {

			//noinspection JSUnresolvedVariable
			if(result.final || result.result.final) {
				//noinspection JSUnresolvedVariable
				var alternative = result.alternative || result.result.alternative;
				var b = '';
				for(var i = 0, len = alternative.length; i < len; i++) {
					//noinspection JSUnresolvedVariable
					b += alternative[i].transcript;
				}
				alert(b);
			}
		};

		speechRecognition.onstart = function() {
			$('.' + recordBtnClass).addClass(recordingClass);
		};

		speechRecognition.onend = function() {
			$('.' + recordBtnClass).removeClass(recordingClass);
			if(lastRoundNr !== roundNr && !err) {
				lastRoundNr = roundNr;
				processResult(['xxx aaaaa bb', 'yyyy yyy zzz', 'yyyy', 'fffffff ff', 'aa aaaaaa']);
			}
			err = false;
		};

		var $game = $(gameId);
		var $err = $('<div>').css({position: 'absolute', left: '30%', bottom: '3.5%'});
		$game.append($err);
		var err = false;

		speechRecognition.onerror = function(e) {
			$err.html(e);
			err = true;
		};
	};

	var createButtons = function() {

		var $game = $(gameId);

		var $recordBtn = $.app.spriteFactory.createGameButtonSprite(recordBtnClass, $.app.i18n.t.GAME_BUTTON_RECORD, true);
		$recordBtn.on('click', function() {
			if(!speechRecognition.isRecording) {
				speechRecognition.start('cs');
			}
			else {
				speechRecognition.stop();
			}
		});

		$game.append($recordBtn);

		var $exitBtn = $.app.spriteFactory.createGameButtonSprite(exitBtnClass, $.app.i18n.t.GAME_BUTTON_EXIT, true);
		$exitBtn.on('click', exit);

		$game.append($exitBtn);
	};

	var createGameWordSprite = function(word, sizeMult, maxWidth) {
		var sw = $.app.spriteFactory.getLetterMetrics() * sizeMult * word.length;
		return $.app.spriteFactory.createWordSprite(word, sw > maxWidth ? sizeMult * (maxWidth / sw) : sizeMult, true);
	};

	var exit = function() {

		var $game = $(gameId);

		var $resultInfo = $('<div>')
			.addClass(gameInfoClass)
			.append($('<div>').css('font-size', '200%').html($.app.i18n.t.GAME_INFO_END.format(points)))
			.append($.app.spriteFactory.createWordSprite('ok', 0.8, true)
				.addClass(gameWordOptionClass)
				.css({
					left: '50%',
					transform: 'translate(-50%)'
				})
				.on('click', function() {
					$resultInfo.fadeOut(500, function() {
						$.app.menu.show();
						$game.hide();
						$game.find(gameButtonWrapperCls).show();
						$game.children().not(gameButtonWrapperCls).remove();
					});
				}))
			.hide()
			.appendTo($game);
		$resultInfo
			.css({
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)'
			});

		$game.children().not($resultInfo).fadeOut(500, function() {
			$resultInfo.fadeIn(400);
		});
	};

	var displayWCenter;
	var displayHTop;
	var spriteWOrigin;
	var spriteHOrigin;
	var stackTop;
	var roundNr;
	var points = 0;
	var lives;
	var $word;
	var $info;
	var $optionHolder;
	var $wordStack;

	var processResult = function(possibleResults) {

		var successCallback = function() {

			$info.fadeOut(100);
			$optionHolder.fadeOut(300);

			var w = $word.width();
			var h = $word.height();
			var stackH = $wordStack.height();
			var sw = $wordStack.width() * 0.9;
			var scale = w > sw ? sw / w : 1;
			h *= scale;

			$word
				.animate({
					top: -displayHTop / 2,
					opacity: 0
				}, 300, function() {
					$word
						.css({
							left: '50%',
							top: -h,
							opacity: 1,
							transform: 'scale(' + scale + ') translate(-50%)'
						})
						.appendTo($wordStack)
						.animate({
							top: stackTop -= h
						}, 300, function() {
							if(stackTop < stackH * 0.25) {
								var offset = stackTop - (stackTop += stackH * 0.5);
								$wordStack.children().animate({
									top: '-=' + offset
								}, 300, function() {
									var $me = $(this);
									if($me.position().top > stackH) {
										$me.remove();
									}
								});
							}
							newRound();
						});
				});
		};

		var failCallback = function() {

			$info.fadeOut(100);
			$optionHolder.fadeOut(300);

			var w = $word.width();
			var h = $word.height();
			var angle = 0;
			var startX = w / 2;
			var startY = h / 2;
			var particleCount = 13;
			var angleDelta = Math.PI * 2 / particleCount;
			var particleSize = $.app.spriteFactory.getLetterMetrics() * 0.5;

			for(i = 0; i < particleCount; i++) {
				$('<div/>')
					.addClass(bubbleDebrisClass)
					.css({
						left: startX,
						top: startY,
						width: particleSize,
						height: particleSize
					})
					.appendTo($word)
					.animate({
						left: startX + Math.cos(angle) * (w / 3 + Math.random() * w / 4),
						top: startY + Math.sin(angle) * (h + Math.random() * h * 1.5),
						width: particleSize / 10,
						height: particleSize / 10,
						opacity: 0
					}, 500);
				angle += angleDelta;
			}

			$word.fadeOut(550, function() {
				$word.remove();
				newRound();
			});
		};

		if(!$word) {
			return;
		}

		var meanings = $word.meanings;
		var meaningsLen = meanings.length;
		var optsLen = possibleResults.length;

		for(i = 0; i < optsLen; i++) {
			var r = (possibleResults[i] || '').toLowerCase();
			for(var j = 0; j < meaningsLen; j++) {
				if(r.indexOf(meanings[j]) >= 0) {
					successCallback();
					return;
				}
			}
		}

		if(maxOptionCount === 0) {
			failCallback();
			return;
		}

		var numOptions = Math.min(optsLen, maxOptionCount);
		var correctResultPos = (Math.random() * (numOptions + 0.99)) >> 0;

		var spriteHMult = 0.5 * (6 / (numOptions + 1));
		var marginTop = $.app.spriteFactory.getLetterMetrics() * spriteHMult;
		var optionHolderW = $optionHolder.width();
		marginTop = ($optionHolder.height() * 0.9 / (numOptions + 1) - marginTop) >> 0;

		var opts = [];
		var addOpt = function(word, callback) {
			var $optionSprite = createGameWordSprite(word, spriteHMult, optionHolderW);
			$optionSprite
				.on('click', callback)
				.addClass(gameWordOptionClass)
				.css({
					'margin-top': marginTop,
					'margin-bottom': marginTop,
					left: '50%',
					transform: 'translate(-50%)'
				})
				.appendTo($optionHolder);
			opts.push($optionSprite);
		};

		for(var i = 0; i < numOptions; i++) {
			if(i === correctResultPos) {
				addOpt(meanings[(Math.random() * (meaningsLen - 0.01)) >> 0], successCallback);
			}
			addOpt(possibleResults[i], failCallback);
		}
		if(numOptions === correctResultPos) {
			addOpt(meanings[(Math.random() * (meaningsLen - 0.01)) >> 0], successCallback);
		}

		$optionHolder.append(opts).fadeIn(300);
	};

	var newRound = function() {

		roundNr++;

		$.getJSON('getWord.json', {
			source_language: sourceLanguage,
			target_language: targetLanguage
		}, function(data) {

			var $game = $(gameId);

			var word = data.text;
			var meanings = data.meanings;
			for(var i = 0, len = meanings.length; i < len; i++) {
				meanings[i] = meanings[i].text;
			}

			$word = createGameWordSprite(word, 1.2, $game.width() / 2)
				.addClass(gameWordClass)
				.appendTo($game);
			$word.sourceText = word;
			$word.meanings = meanings;

			var w = $word.width();
			var h = $word.height();

			//noinspection JSUnusedGlobalSymbols
			$word
				.css({
					left: spriteWOrigin,
					top: spriteHOrigin - h,
					opacity: 0.3,
					transform: 'scale(0.3)'
				})
				.animate({
					opacity: 1,
					left: displayWCenter - (w / 2),
					top: displayHTop,
					transform: 'scale(1)'
				}, {
					duration: 400,
					complete: function() {
						$info.fadeIn(300);
					}
				});

			$optionHolder.children().not('.' + gameInfoClass).remove();
		});
	};

	var sourceLanguage;
	var targetLanguage;
	var maxOptionCount;

	var start = function(sourceLang, targetLang, maxOptCount) {

		sourceLanguage = sourceLang || $.app.i18n.locale.en;
		targetLanguage = targetLang || $.app.i18n.locale.cs;
		maxOptionCount = (maxOptCount || 6) - 1;

		var $game = $(gameId);
		$game.show();

		$info = $('<div>')
			.text($.app.i18n.t.GAME_INFO + $.app.i18n.t['GAME_INFO_IN_' + targetLanguage])
			.addClass(gameInfoClass)
			.hide()
			.appendTo($game);
		$info.css({
			top: displayHTop - $info.height() * 1.4,
			left: displayWCenter - $info.width() / 2
		});

		$optionHolder = $('<div>')
			.addClass(gameOptionHolderClass)
			.append($('<div>')
				.text($.app.i18n.t.GAME_INFO_OPTIONS_TITLE)
				.addClass(gameInfoClass)
				.css({top: 0, left: 0}))
			.hide()
			.appendTo($game);

		$wordStack = $('<div>')
			.addClass(gameWordStackClass)
			.appendTo($game);

		stackTop = $wordStack.height();

		roundNr = lastRoundNr = 0;

		$.app.loader.delayedHide(1000);
		setTimeout(newRound, 2000);
	};

	var measure = function() {

		var $game = $(gameId);
		displayWCenter = $game.width() / 2;
		displayHTop = $game.height() / 6;

		var $banner = $(bannerId);
		var offset = $banner.offset();
		spriteWOrigin = offset.left + $banner.width() / 2;
		spriteHOrigin = offset.top + $banner.height() * 0.75;
	};

	var initComponent = function() {
		initSpeechRecognition();
		createButtons();
		measure();
	};

	var reset = function() {
		$(gameId).hide().empty();
		createButtons();
		measure();
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		start: start
	};

	$.app.game = $.app.registerComponent(me);

})(jQuery);