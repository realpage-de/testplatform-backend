return function SelectField(field, name, labelText, placeholderText) {
	var _this = this,
		element,
		labelElement,
		optionElements = {},
		value;

	/* constructor */
	_this._constructor = function(_value) {
		value = _value;
		// render
		render();
	};

	/* render ui */
	var render = function() {
		element = api.Classes.UI.createElement('select', {className: 'input input-select'});
	};

	/* set options */
	_this.setLabel = function(label) {
		if (api.Functions.isString(label) && label) {
			labelElement = api.Classes.UI.createElement('label', {innerHTML: label});
		} else {
			if (api.Functions.isElement(labelElement)) {
				labelElement.remove();
			}
			labelElement = null;
		}
		return _this;
	};

	_this.appendTo = function(parentElement) {
		if (api.Functions.isElement(parentElement)) {
			if (api.Functions.isElement(labelElement)) {
				parentElement.appendChild(labelElement);
			}
			parentElement.appendChild(element);
			for (var value in optionElements) {
				if (tagElement.getAttribute(attributeName) === optionElements[value].getAttribute('attribute-value')) {
					optionElements[value].selected = true;
				}
				element.appendChild(optionElements[value]);
			};
		}
		return _this;
	};

	_this.getElement = function() {
		return element;
	};
};