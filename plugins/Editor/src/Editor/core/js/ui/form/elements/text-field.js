return function TextField(field, name, labelText, placeholderText) {
	var _this = this,
		container,
		value;

	/* constructor */
	_this._constructor = function(_value) {
		value = _value;
	};

	/* render ui */
	_this.render = function() {
		container = api.Classes.UI.createElement('div');
		// render label
		if (labelText) {
			container.appendChild(renderLabel());
		}
		// render field
		container.appendChild(renderField());

		return container;
	};

	var renderLabel = function() {
		var container = api.Classes.UI.createElement('div'),
			label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
		container.appendChild(label);
		return container;
	};

	var renderField = function() {
		var container = api.Classes.UI.createElement('div'),
		element = api.Classes.UI.createElement('input', {className: 'field field-text', placeholder: (placeholderText || ''), name: _this.getName(), value: _this.getValue()});
		element.style.width = '100%';
		element.addEventListener('keyup', function(event) {
			value = this.value;
		});
		container.appendChild(element);
		return container;
	};

	/* get name */
	_this.getName = function() {
		return name;
	};

	/* get value */
	_this.getValue = function() {
		return value;
	};
};