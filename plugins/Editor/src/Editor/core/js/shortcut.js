var Shortcut = function() {
	var _this = this,
		supportedCommands = {
			'SHIFT': [
				'SHIFT'
			],
			'CMD': [
				'CMD',
				'CONTROL',
				'COMMAND',
				'WINDOWS',
				'CTRL'
			],
			'ALT': [
				'ALT',
				'OPTION'
			]
		},
		keyCodes = {
			'0' : 48,
			'1' : 49,
			'2' : 50,
			'3' : 51,
			'4' : 52,
			'5' : 53,
			'6' : 54,
			'7' : 55,
			'8' : 56,
			'9' : 57,
			'A' : 65,
			'B' : 66,
			'C' : 67,
			'D' : 68,
			'E' : 69,
			'F' : 70,
			'G' : 71,
			'H' : 72,
			'I' : 73,
			'J' : 74,
			'K' : 75,
			'L' : 76,
			'M' : 77,
			'N' : 78,
			'O' : 79,
			'P' : 80,
			'Q' : 81,
			'R' : 82,
			'S' : 83,
			'T' : 84,
			'U' : 85,
			'V' : 86,
			'W' : 87,
			'X' : 88,
			'Y' : 89,
			'Z' : 90,
			'BACKSPACE' : 8,
			'ENTER'     : 13,
			'ESCAPE'    : 27,
			'LEFT'      : 37,
			'UP'        : 38,
			'RIGHT'     : 39,
			'DOWN'      : 40,
			'INSERT'    : 45,
			'DELETE'    : 46
		},
		commands = {},
		key = {},
		name,
		element,
		callback;

	/* constructor */
	_this._constructor = function(opts) {
		name = opts.name;
		element = opts.on;
		callback = opts.callback;

		parseShortcutName(name);

		element.addEventListener('keydown', execute, false);
	};

	var parseShortcutName = function(shortcut) {
		shortcut = shortcut.split('+');
		for (let key = 0; key < shortcut.length; key++) {
			shortcut[key] = shortcut[key].toUpperCase();
		}
	};

	/* remove shortcut */
	var remove = function(event) {
		element.removeEventListener('keydown', execute);
	};

	/* execute */
	var execute = function() {};
};