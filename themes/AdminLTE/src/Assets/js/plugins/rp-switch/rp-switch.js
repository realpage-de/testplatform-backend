(function(COMPONENT_TAG_NAME, window, document) {
	'use strict';

	var createElement = function(tagName, BaseElement, fn) {
		if (arguments.length === 1) {
			BaseElement = tagName;
			tagName = undefined;
		}
		else if (arguments.length === 2 && !(typeof tagName === 'string')) {
			fn = BaseElement;
			BaseElement = tagName;
			tagName = undefined;
		}
		var Element = function() {
			return Reflect.construct(BaseElement, [], this.constructor);
		};
		Element.prototype = Object.create(BaseElement.prototype);
		Element.prototype.constructor = Element;
		Object.setPrototypeOf(Element, BaseElement);

		if (fn && {}.toString.call(fn) === '[object Function]') {
			fn(Element);
		}

		if (tagName) {
			document.registerElement(tagName, Element);
		}
		return Element;
	};

	window.RPSwitchHTMLElement = createElement(COMPONENT_TAG_NAME, HTMLElement, function(_) {

		var elements = {
			input: undefined,
			slider: undefined
		};

		_.prototype.attachedCallback = function attachedCallback() {
			var _this = this;
			// initialize
			initialize.call(_this);
		};

		var initialize = function() {
			var _this = this;

			elements.input = document.createElement('input');
			elements.input.type = 'checkbox';
			_this.appendChild(elements.input);

			elements.slider = document.createElement('span');
			elements.slider.classList.add('slider');
			_this.appendChild(elements.slider);

			_this.addEventListener('click', function(event) {
				updateChecked.call(_this, !_this.hasAttribute('checked'));
			});

			updateName.call(_this, _this.getAttribute('name'));
			updateValue.call(_this, _this.getAttribute('value'));
			updateChecked.call(_this, _this.hasAttribute('checked'));
		};

		var updateName = function(value) {
			var _this = this;
			if (value) {
				_this.setAttribute('name', value);
				elements.input.setAttribute('name', value);
			} else {
				_this.removeAttribute('name');
				elements.input.removeAttribute('name');
			}
		};

		var updateValue = function(value) {
			var _this = this;
			if (value) {
				_this.setAttribute('value', value);
				elements.input.setAttribute('value', value);
			} else {
				_this.removeAttribute('value');
				elements.input.removeAttribute('value');
			}
		};

		var updateChecked = function(status) {
			var _this = this;
			if (status) {
				_this.setAttribute('checked', 'checked');
				elements.input.setAttribute('checked', 'checked');
			} else {
				_this.removeAttribute('checked');
				elements.input.removeAttribute('checked');
			}
		};

		_.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {
			var _this = this;
			switch (attrName) {
				case 'name': {
					updateName.call(_this, newValue);
					break;
				}
				case 'value': {
					updateValue.call(_this, newValue);
					break;
				}
				case 'checked': {
					updateChecked.call(_this, (newValue === 'checked'));
					break;
				}
				
			}
		};

		(function(attrName) {
			Object.defineProperty(_.prototype, attrName, {
				get: function() {
					return this.getAttribute(attrName);
				},
				set: function(value) {
					updateName.call(this, value);
				}
			});
		})('name');

		(function(attrName) {
			Object.defineProperty(_.prototype, attrName, {
				get: function() {
					return this.getAttribute(attrName);
				},
				set: function(value) {
					updateValue.call(this, value);
				}
			});
		})('value');

		(function(attrName) {
			Object.defineProperty(_.prototype, attrName, {
				get: function() {
					return this.hasAttribute(attrName);
				},
				set: function(value) {
					updateChecked.call(this, (value === true));
				}
			});
		})('checked');
	});

	window.RPSwitchWrapperHTMLElement = createElement('switch-wrapper', RPSwitchHTMLElement);
})('rp-switch', window, document);