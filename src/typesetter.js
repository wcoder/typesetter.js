(function ($, w) {
	'use strict';
	
	var KEY_SPACE = 32,
		KEY_ENTER = 13,
		KEY_TAB = 9,
		KEY_BACKSPACE = 8,
		KEY_LINEBREAK = 10,

		App = {
			targetElement: null,
			settings: {
				data: ''
			},
			expectations: [],
			currentPosition: 0,

			init: function () {},
			pharseToHtml: function () {},
			loadFile: function () {},
			attachEventListeners: function () {},
			getSymbolByIndex: function () {}
		};

	$.fn.typesetter = function (options) {
		App.targetElement = $(this);
		App.settings = $.extend(App.settings, options);

		App.init();
	};

	App.init = function () {
		// load file
		App.targetElement.html(App.pharseToHtml(App.settings.data));
		// set cursor
		App.getSymbolByIndex(App.currentPosition).addClass('cursor');

		App.attachEventListeners();
	};

	
	App.pharseToHtml = function (text) {
		var i = 0,
			html = '',
			symbol = '';

		for (i = 0; i < text.length; i++) {
			symbol = text[i].charCodeAt(0);
			switch (symbol) {
			case KEY_LINEBREAK:
				html += '<span class="break-line"><br></span>';
				App.expectations.push(KEY_ENTER);
				break;
			case KEY_TAB:
				html += "<span> </span><span> </span><span> </span><span> </span>";
				App.expectations.push(KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE);
				break;
			default:
				html += "<span>" + text[i] + "</span>";
				App.expectations.push(symbol);
				break;
			}
		}

		return html;
	};

	App.attachEventListeners = function () {
		
		/*var errorCounter = 0;
		var errorPosition = 0;*/

		$(window).keydown(function (event) {
			var keyCode = event.keyCode || event.which;
			if (keyCode === KEY_TAB || keyCode === KEY_BACKSPACE) {
				event.preventDefault();
				//console.log('Tab! ');
			}
			/*if (keyCode === KEY_BACKSPACE) {
				App.getSymbolByIndex(App.currentPosition)
					.removeClass('cursor')
					.addClass('');
				if (App.currentPosition > 0) App.currentPosition--;
				App.getSymbolByIndex(App.currentPosition)
					.removeClass('cursor-exeption')
					.addClass('cursor');
				
				if (errorCounter > 0 && errorCounter < 4) errorCounter--;
			}*/
		});
	
		$(window).keypress(function (event) {
			event.preventDefault();

			var keyCode = event.keyCode || event.which;

			if (App.expectations[App.currentPosition] === keyCode /*&& errorCounter === 0*/) {
				App.getSymbolByIndex(App.currentPosition)
					.removeClass('cursor')
					.removeClass('cursor-exeption')
					.addClass('done-symbol');

				if (keyCode === KEY_ENTER) {
					while (App.expectations[App.currentPosition + 1] === KEY_SPACE) {
						App.currentPosition++;
					}
				}
				App.currentPosition++;
				App.getSymbolByIndex(App.currentPosition).addClass('cursor');
			} else {
				/*if (errorPosition == 0) errorPosition = App.currentPosition;
				if (errorCounter < 4) {
					errorCounter++;*/
					App.getSymbolByIndex(App.currentPosition)
						.removeClass('cursor')
						.addClass('cursor-exeption');
					/*App.currentPosition++;
				}*/
			}
	

		});

	};


	/**
	 @param int index
	 @return jQuery object
	*/
	App.getSymbolByIndex = function (index) {
		return $(App.targetElement.find('span')[index]);
	};

}(window.jQuery, window));