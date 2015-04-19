/**
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($) {

	var gameId = '#game';
	var gameButtonWrapperCls = '.gameButton-wrapper';
	var bannerId = '#banner';
	var recordBtnClass = 'recordBtn';
	var exitBtnClass = 'exitBtn';
	var recordingClass = 'recording';
	var gameWordClass = 'gameWord';
	var gameInfoClass = 'gameInfo';

	var speechRecognition;

	var initSpeechRecognition = function() {

		speechRecognition = new SpeechRecognition('http://demo.cloudasr.com:80/');

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

	var exit = function() {
		isExit = true;
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
	var isExit = false;
	var word = '';
	var $info;

	var processResult = function(possibleResults) {

	};

	var newRound = function() {

		var $game = $(gameId);

		word = 'hello';
		var $wordSprite = $.app.spriteFactory.createWordSprite(word, 1.2, true)
			.addClass(gameWordClass)
			.appendTo($game);

		var w = $wordSprite.width();
		var h = $wordSprite.height();

		$wordSprite
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
				duration: 1000,
				complete: function() {
					$info.fadeIn(300);
				}
			});
	};

	var sourceLanguage;
	var targetLanguage;

	var start = function(sourceLang, targetLang) {

		sourceLanguage = sourceLang || $.app.i18n.locale.en;
		targetLanguage = targetLang || $.app.i18n.locale.cs;

		var $game = $(gameId);
		$game.show();

		$info = $('<div>')
			.text($.app.i18n.t.GAME_INFO + $.app.i18n.keys['GAME_INFO_IN_' + targetLanguage].getText())
			.addClass(gameInfoClass)
			.hide()
			.appendTo($game);
		$info.css('top', displayHTop - $info.height() * 1.4);
		$info.css('left', displayWCenter - $info.width() / 2);

		$.app.loader.delayedHide(1000);
		setTimeout(newRound, 2000);
	};

	var measure = function() {

		var $game = $(gameId);
		displayWCenter = ($game.width() / 2) >> 0;
		displayHTop = ($game.height() / 6) >> 0;

		var $banner = $(bannerId);
		var offset = $banner.offset();
		spriteWOrigin = (offset.left + $banner.width() / 4) >> 0;
		spriteHOrigin = (offset.top + 3 * $banner.height() / 4) >> 0;
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