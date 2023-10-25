var TextField = function(_super, api) {
	var _this = this,
		data = '';

	/* settings */
	_this.settings = function() {
		return {
			inlineTools: true,
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
			'placeholder': 'Text einfügen',
			'contenteditable': 'true',
			'spellcheck': 'true'
		});
		field.innerHTML = data;
		field.addEventListener('input', function(event) {
			_super.save();
		});
	};

	_this.getData = function() {
		return _super.getElement().innerHTML;
	};

	_this.setData = function(data) {
		_super.getElement().innerHTML = api.Functions.isString(data) ? data : '';
	};
};