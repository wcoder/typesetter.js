(function (w) {
	'use strict';
	
	var KEY_SPACE = 32,
		KEY_ENTER = 13,
		KEY_TAB = 9,
		KEY_BACKSPACE = 8,
		KEY_LINEBREAK = 10,

		App = {
			targetElement: null,
			settings: {},
			expectations: [],
			currentPosition: 0,
		};

	w.typesetter = function (element, options) {
		App.targetElement = element;
		App.settings = options;

		init();
	};

	function init() {
		App.targetElement.innerHTML = pharseToHtml(App.settings.data);

		setClassToSymbol(App.currentPosition, 'cursor');

		attachEventListeners();
	}

	function pharseToHtml(text) {
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
	}

	function attachEventListeners() {

		w.addEventListener('keydown', function (event) {
			var keyCode = event.keyCode || event.which;
			if (keyCode === KEY_TAB || keyCode === KEY_BACKSPACE) {
				event.preventDefault();
			}
		});
	
		w.addEventListener('keypress', function (event) {
			event.preventDefault();

			var keyCode = event.keyCode || event.which;

			if (App.expectations[App.currentPosition] === keyCode) {
				setClassToSymbol(App.currentPosition, 'done-symbol');

				if (keyCode === KEY_ENTER) {
					while (App.expectations[App.currentPosition + 1] === KEY_SPACE) {
						App.currentPosition++;
					}
				}
				App.currentPosition++;

				setClassToSymbol(App.currentPosition, 'cursor');
			} else {
				setClassToSymbol(App.currentPosition, 'cursor-exeption');
			}

		});
	}

	function setClassToSymbol(symbolIndex, className) {
		var symbol = getSymbolByIndex(symbolIndex);
		var oldClass = symbol.className;

		if (oldClass.indexOf('break-line') > -1 && className.indexOf('cursor') > -1) {
			symbol.className = oldClass + ' ' + className;
		} else {
			symbol.className = className;
		}
	}

	function getSymbolByIndex(index) {
		return App.targetElement.querySelectorAll('span')[index];
	}

}(window));