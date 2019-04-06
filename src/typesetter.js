(function (w) {
    'use strict';

    var KEY_SPACE = 32,
        KEY_ENTER = 13,
        KEY_TAB = 9,
        KEY_BACKSPACE = 8,
        KEY_LINEBREAK = 10,
        KEY_SKIP = -32,
        BREAK_LINE = 'break-line',
        CURSOR_CURRENT = 'cursor-current',
        CURSOR_DONE = 'cursor-done',
        CURSOR_ERROR = 'cursor-error',
        CURSOR_EXCEPTION = 'cursor-exception',
        DIRECTION_FORWARD = 1,
        DIRECTION_BACKWARD = -1,

        App = {
            targetElement: null,
            settings: {},
            expectations: [],
            currentPosition: 0,
            firstErrorPosition: -1,
        };

    w.typesetter = function (element, options) {
        App.targetElement = element;

        // TODO: check options, set default
        App.settings = options;

        init();
    };

    function init() {
        App.targetElement.innerHTML = parseToHtml(App.settings.data);

        markCursor(CURSOR_CURRENT);

        attachEventListeners();
    }

    function parseToHtml(text) {
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
                if (App.settings.cursorAutoShift) {
                    html += "<span class='skip'>    </span>";
                    App.expectations.push(KEY_SKIP);
                } else {
                    var span = "<span> </span>";
                    html += span + span + span + span;
                    App.expectations.push(KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE);
                }
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
        w.addEventListener('keydown', keyDownHandler);
        w.addEventListener('keypress', keyPressHandler);
    }

    function keyDownHandler(event) {
        var keyCode = event.keyCode || event.which;

        if (keyCode === KEY_TAB) {
            event.preventDefault();
            // ignored
        }

        if (keyCode === KEY_BACKSPACE) {
            event.preventDefault();
            previousPosition();
        }
    }

    function keyPressHandler(event) {
        event.preventDefault();

        var keyCode = event.keyCode || event.which;

        if (App.expectations[App.currentPosition] === keyCode &&
            App.firstErrorPosition < 0) {
            typedCorrect(keyCode);
        } else {
            typedError(keyCode);
        }
    }

    function typedCorrect(keyCode) {
        markCursor(CURSOR_DONE);

        nextPosition(keyCode);

        markCursor(CURSOR_CURRENT);
    }

    function typedError(keyCode) {
        if (checkMaxErrorsCount()) {
            return;
        }

        markCursor(CURSOR_EXCEPTION);

        // keep position of first error
        if (App.firstErrorPosition < 0) {
            App.firstErrorPosition = App.currentPosition;
        }

        nextPosition(keyCode);

        markCursor(CURSOR_ERROR);
    }

    function previousPosition() {
        if (App.currentPosition == 0) {
            return;
        }
        clearCursor();

        if (App.settings.cursorAutoShift) {
            cursorAutoShift(DIRECTION_BACKWARD);
        }

        App.currentPosition--;

        // TODO: refactor
        if (App.firstErrorPosition < 0) {
            markCursor(CURSOR_CURRENT);
        } else if (App.currentPosition > App.firstErrorPosition) {
            markCursor(CURSOR_ERROR);
        } else {
            markCursor(CURSOR_CURRENT);
            App.firstErrorPosition = -1;
        }
    }

    function nextPosition(keyCode) {
        if (App.settings.cursorAutoShift &&
            (keyCode === KEY_ENTER || App.firstErrorPosition != -1)) {
            cursorAutoShift(DIRECTION_FORWARD);
        }

        App.currentPosition++;
    }

    function clearCursor() {
        markCursor('');
    }

    function markCursor(className) {
        setClassToSymbol(App.currentPosition, className);
    }

    function setClassToSymbol(symbolIndex, className) {
        var symbol = getSymbolByIndex(symbolIndex);
        var oldClass = symbol.className;

        if (oldClass.indexOf(BREAK_LINE) > -1) {
            symbol.className = BREAK_LINE + ' ' + className;
            return;
        }

        symbol.className = className;
    }

    function getSymbolByIndex(index) {
        return App.targetElement.querySelectorAll('span')[index];
    }

    // for features:

    function cursorAutoShift(direction) {
        while (App.expectations[App.currentPosition + direction] === KEY_SKIP) {
            App.currentPosition += direction;
        }
    }

    function checkMaxErrorsCount() {
        // TODO: issue: calculation maxErrorsCount when cursorcursorAutoShift
        return App.firstErrorPosition != -1 &&
            App.settings.maxErrorsCount > 0 &&
            App.settings.maxErrorsCount <= App.currentPosition - App.firstErrorPosition;
    }

}(window));