var CodeField = function(_super, api) {
	var _this = this,
		data = '';

	/* settings */
	_this.settings = function() {
		return {
			inlineTools: false,
			enableLineBreaks: true
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = api.Functions.isString(_data) ? _data : data;
	};

	/* render ui */
	_this.render = function(field) {
		field.setAttributes({
			'placeholder': 'Code einfügen',
			'contenteditable': 'true'
		});
		field.innerHTML = api.Functions.encodeText(data, true);
		field.addEventListener('input', function(event) {
			_super.save();
		});
		/* keydown */
		field.addEventListener('keydown', function(event) {
			// tab pressed
			if (event.key === 'Tab') {
				event.stopImmediatePropagation();
				event.preventDefault();
				document.execCommand('insertHTML', false, '&#009');
			}
		});
	};

	_this.getData = function() {
		return _super.getElement().innerHTML;
	};

	/* css styles */
	_this.css = function() {
		return {
			'': {
				'width': '100%',
				'padding': '7px 10px',
				'resize': 'none',
				'border-radius': '1px',
				'background-color': '#1e2128',
				'line-height': '1.5',
				'letter-spacing': '-0.2px',
				'color': '#b0b6c4',
				'overflow': 'hidden',
				'font-family': 'Verdana',
				'font-size': '95%',
				'white-space': 'pre'
			},
			'-[placeholder]:empty:before': {
				'color': '#d1d6e0'
			}
		};
	};
};