/**
 * Author: Janek Milota
 * Date: 28.04.2015
 */

(function($) {

	var leaderboardsId = '#leaderboards';
	var leaderboardsRowTemplateId = 'tpl_leaderboardsRow';
	var gearLoaderCls = 'gearLoader';
	var showCls = 'show';
	var leaderboardsContainerCls = 'leaderboardsContainer';
	var leaderboardsRowCls = '.leaderboardsRow';
	var leaderboardsPointsCls = '.leaderboardsPoints';
	var leaderboardsPointsDecoCls = 'leaderboardsPointsDeco';
	var leaderboardsLeftCls = '.leaderboardsLeftDeco';
	var leaderboardsRightCls = '.leaderboardsRightDeco';

	var $gear;

	var initComponent = function() {
		$gear = $('<div>')
			.addClass(gearLoaderCls)
			.hide()
			.appendTo(leaderboardsId);
	};

	var reset = function() {
		hide();
		$(leaderboardsId).empty();
		initComponent();
	};

	var show = function() {
		$gear.show();
		var $leaderboards = $(leaderboardsId);
		$leaderboards.children().not($gear).remove();
		$leaderboards.addClass(showCls);

		var data = [{
			name: 'asdasd dsdda',
			points: 100
		}, {
			name: 'zxczx cxczxc',
			points: 99
		}, {
			name: 'ertert trte',
			points: 98
		}, {
			name: 'tyutyu vcdbgbdbdbdbdb',
			points: 97
		}, {
			name: 'fgjhfg hhhghhghgfg',
			points: 96
		}, {
			name: 'iouyoui oiuououou',
			points: 95
		}, {
			name: 'mbm mnhjmhjm',
			points: 94
		}, {
			name: 'yry ytyr',
			points: 93
		}, {
			name: 'ljljklkjjkl luu',
			points: 92
		}, {
			name: 'fgsdgdgfdg gdfgd',
			points: 90
		}, {
			name: 'asdasd dsdda',
			points: 100
		}, {
			name: 'zxczx cxczxc',
			points: 99
		}, {
			name: 'ertert trte',
			points: 98
		}, {
			name: 'tyutyu vcdbgbdbdbdbdb',
			points: 97
		}, {
			name: 'fgjhfg hhhghhghgfg',
			points: 96
		}, {
			name: 'iouyoui oiuououou',
			points: 95
		}, {
			name: 'mbm mnhjmhjm',
			points: 94
		}, {
			name: 'yry ytyr',
			points: 93
		}, {
			name: 'ljljklkjjkl luu',
			points: 92
		}];

		var $container = $('<div>')
			.addClass(leaderboardsContainerCls)
			.hide()
			.appendTo($leaderboards)

		for(var i = 0, len = data.length; i < len; i++) {
			$container.append($.app.templates.process(leaderboardsRowTemplateId, {
				leftPoints: i % 2 == 0,
				points: data[i].points,
				name: data[i].name
			}));
		}

		var lH = $leaderboards.outerHeight();
		var cH = $container.height();
		var offScrollHandle;
		var scrollHandle;
		$leaderboards.on('mousewheel', function(e) {
			if(offScrollHandle) {
				return;
			}
			var delta = e.originalEvent.wheelDelta;
			$container.animate({
					top: '+=' + delta
				}, 100, function() {
					var t = $container.offset().top;
					if(t > 0) {
						clearTimeout(offScrollHandle);
						offScrollHandle = setTimeout(function() {
							$container.animate({
								top: 0
							});
							offScrollHandle = null;
						}, 50);
					}
					else if(t + cH < lH) {
						clearTimeout(offScrollHandle);
						offScrollHandle = setTimeout(function() {
							$container.animate({
								top: lH - cH
							});
							offScrollHandle = null;
						}, 50);
					}
				}
			);
		});

		$gear.fadeOut(200, function() {
			$container.fadeIn(200);
		});
	};

	var hide = function() {
		$(leaderboardsId).removeClass(showCls);
	};

	var me = {
		initComponent: initComponent,
		reset: reset,
		show: show,
		hide: hide
	};

	$.app.leaderboards = $.app.registerComponent(me);

})
(jQuery);