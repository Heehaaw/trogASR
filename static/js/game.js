/**
 * Author: Janek Milota
 * Date: 02.04.2015
 */
(function($) {

	var gameButtonTemplateId = 'tpl_gameButton';
	var gameId = '#game';
	var recordBtnClass = 'recordBtn';
	var exitBtnClass = 'exitBtn';

	var speechRecognition;

	var initSpeechRecognition = function() {

		speechRecognition = new SpeechRecognition('http://demo.cloudasr.com:80/');

		speechRecognition.onresult = function(result) {

			var showBuffer = '';
			var hypotheses = result.result.hypotheses;
			for(var h in hypotheses) {
				showBuffer += h.transcript + ', ';
			}

			alert(showBuffer);
		};

		speechRecognition.onstart = function(e) {
			$('.' + recordBtnClass).addClass('recording');
		};

		speechRecognition.onend = function(e) {
			$('.' + recordBtnClass).removeClass('recording');
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

		var $recordBtn = $.app.templates.process(gameButtonTemplateId, {
			buttonClass: recordBtnClass,
			label: $.app.spriteFactory.createWordSprite($.app.i18n.t.GAME_BUTTON_RECORD, 0.5)
		}, true);

		$recordBtn.on('click', function() {
			if(!speechRecognition.isRecording) {
				speechRecognition.start('cs');
			}
			else {
				speechRecognition.stop();
			}
		});

		$game.append($recordBtn);

		var $exitBtn = $.app.templates.process(gameButtonTemplateId, {
			buttonClass: exitBtnClass,
			label: $.app.spriteFactory.createWordSprite($.app.i18n.t.GAME_BUTTON_EXIT, 0.5)
		}, true);

		$exitBtn.on('click', function() {
			$game.fadeOut(500);
			setTimeout(function() {
				$.app.menu.show();
			}, 400);
		});

		$game.append($exitBtn);
	};

	var start = function() {

		$(gameId).show();
		$.app.loader.delayedHide(300);
	};

	var initComponent = function() {
		initSpeechRecognition();
		createButtons();
	};

	var reset = function() {
		$(gameId).hide().empty();
		createButtons();
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		start: start
	};

	$.app.game = $.app.registerComponent(me);

})(jQuery);