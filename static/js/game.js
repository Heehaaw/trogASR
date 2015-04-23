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
	var lastRoundNr = 0;

	var initSpeechRecognition = function() {

		//speechRecognition = new SpeechRecognition('http://demo.cloudasr.com:80/');
		speechRecognition = {
			start: function() {
			},
			stop: function() {
			}
		};

		speechRecognition.onresult = function(result) {

			if(result.final || result.result.final) {
				var alternative = result.alternative || result.result.alternative;
				var b = '';
				for(var i = 0, len = alternative.length; i < len; i++) {
					b += alternative[i].transcript;
				}
				alert(b);
			}
		};

		speechRecognition.onstart = function(e) {
			$('.' + recordBtnClass).addClass(recordingClass);
		};

		speechRecognition.onend = function() {
			$('.' + recordBtnClass).removeClass(recordingClass);
		};

		var $game = $(gameId);
		var $err = $('<div></div>');
		$game.append($err);

		speechRecognition.onerror = function(e) {
			speechRecognition.stop();
			$err.html(e);
		};
	};

	var createButtons = function() {

		var $game = $(gameId);
		var isR = false;

		var $recordBtn = $.app.spriteFactory.createGameButtonSprite(recordBtnClass, $.app.i18n.t.GAME_BUTTON_RECORD, true);
		$recordBtn.on('click', function() {
			if(!isR/*speechRecognition.isRecording*/) {
				isR = true;
				speechRecognition.start('cs');
			}
			else {
				isR = false;
				speechRecognition.stop();
				if(lastRoundNr !== roundNr) {
					lastRoundNr = roundNr;
					processResult(['xxx', 'zzzzzzzzzzzzzzzzzz', 'yyyy', 'fffffff ff'/*, 'aa aaaaaa'*/]);
				}
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
		$game.fadeOut(500);
		setTimeout(function() {
			$.app.menu.show();
			$game.children().not(gameButtonWrapperCls).remove();
		}, 400);
	};

	var displayWCenter;
	var displayHTop;
	var spriteWOrigin;
	var spriteHOrigin;
	var optionHolderH;
	var optionHolderW;
	var stackW;
	var stackH;
	var stackTop;
	var roundNr;
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
			var sw = stackW * 0.9;
			var scale = w > sw ? sw / w : 1;
			w *= scale;
			h *= scale;

			$word.animate({
				top: -displayHTop / 2,
				opacity: 0
			}, {
				duration: 300,
				complete: function() {
					$word
						.css({
							left: stackW / 2 - w / 2,
							top: -h,
							opacity: 1,
							transform: 'scale(' + scale + ')',
							'z-index': -5
						})
						.appendTo($wordStack)
						.animate({
							top: stackTop -= h
						}, {
							duration: 300,
							complete: function() {
								if(stackTop < stackH * 0.25) {
									var offset = stackTop - (stackTop += stackH * 0.5);
									$wordStack.children().animate({
										top: '-=' + offset
									}, 300)
								}
								newRound();
							}
						});
				}
			})
		};

		var particles = [];
		var particleCount = 13;
		var angleDelta = Math.PI * 2 / particleCount;
		var s = $.app.spriteFactory.getLetterMetrics() * 0.5;
		for(i = 0; i < particleCount; i++) {
			particles.push(
				$('<div/>')
					.addClass(bubbleDebrisClass)
					.css({width: s, height: s}));
		}

		var failCallback = function() {

			$info.fadeOut(100);
			$optionHolder.fadeOut(300);

			var w = $word.width();
			var h = $word.height();
			var dir = [];
			var angle = 0;
			var startX = w / 2;
			var startY = h / 2;

			for(i = 0; i < particleCount; i++) {
				dir.push([
					startX + Math.cos(angle) * (w / 3 + Math.random() * w / 4),
					startY + Math.sin(angle) * (h + Math.random() * h * 1.5)
				]);
				particles[i]
					.css({left: startX, top: startY})
					.appendTo($word);
				angle += angleDelta;
			}

			for(var i = 0; i < particleCount; i++) {
				var $p = particles[i];
				$p.show().animate({
					top: dir[i][1],
					left: dir[i][0],
					width: $p.width() / 10,
					height: $p.height() / 10,
					opacity: 0
				}, 500, function() {
					$p.detach()
				});
			}
			$word.fadeOut(500, newRound);
		};

		var meanings = $word.meanings;
		var meaningsLen = meanings.length;
		var optsLen = possibleResults.length;

		for(var i = 0; i < optsLen; i++) {
			var r = (possibleResults[i] || '').toLowerCase();
			for(var j = 0; j < meaningsLen; j++) {
				if(r.indexOf(meanings[j]) >= 0) {
					successCallback();
					return;
				}
			}
		}

		var numOptions = Math.min(optsLen, maxOptionCount);
		var correctResultPos = (Math.random() * (numOptions + 0.99)) >> 0;

		var centerW = optionHolderW / 2;
		var spriteHMult = 0.5 * (6 / (numOptions + 1));
		var marginTop = $.app.spriteFactory.getLetterMetrics() * spriteHMult;
		marginTop = (optionHolderH / (numOptions + 1) - marginTop) >> 0;

		var opts = [];
		var addOpt = function(word, callback) {
			var $optionSprite = createGameWordSprite(word, spriteHMult, optionHolderW);
			var left = (centerW - ($optionSprite.width() / 2)) >> 0;
			$optionSprite
				.on('click', callback)
				.addClass(gameWordOptionClass)
				.css({
					'margin-top': marginTop,
					'margin-bottom': marginTop,
					left: left
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

		var $game = $(gameId);

		var word = 'hello';
		$word = createGameWordSprite(word, 1.2, $game.width() / 2)
			.addClass(gameWordClass)
			.appendTo($game);
		$word.sourceText = word;
		$word.meanings = ['ahoj', 'cau', 'nazdar'];

		var w = $word.width();
		var h = $word.height();

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
				duration: 600,
				complete: function() {
					$info.fadeIn(300);
				}
			});

		$optionHolder.children().not('.' + gameInfoClass).remove();
	};

	var sourceLanguage;
	var targetLanguage;
	var maxOptionCount;

	var start = function(sourceLang, targetLang, maxOptCount) {

		sourceLanguage = sourceLang || $.app.i18n.locale.en;
		targetLanguage = targetLang || $.app.i18n.locale.cs;
		maxOptionCount = maxOptCount || 6;

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
				.css({
					top: 0,
					left: 0
				}))
			.hide()
			.appendTo($game);

		optionHolderH = $optionHolder.height() * 0.9;
		optionHolderW = $optionHolder.width();

		$wordStack = $('<div>')
			.addClass(gameWordStackClass)
			.appendTo($game);

		stackW = $wordStack.width();
		stackH = $wordStack.height();
		stackTop = stackH;

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
		spriteWOrigin = offset.left + $banner.width() / 4;
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