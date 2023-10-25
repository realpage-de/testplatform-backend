var LinkInlineTool = function(_super, api) {
	var _this = this,
		toolbar,
		tagName = 'rp-link';

	/* settings */
	_this.settings = function() {
		return {
			name: 'Link',
			icon: '<i class="fa fa-link"></i>'
		};
	};

	/* sanitize */
	_this.sanitize = function() {
		return {
			a: {
				href: 'src',
				src: true,
				target: true
			}
		};
	};

	var AttributeSelect = function(tagElement, attributeName) {
		var _this = this,
			element,
			labelElement,
			optionElements = {};

		// render
		element = api.Classes.UI.createElement('select', {className: 'input input-select'});
		element.style.width = '250px';

		element.addEventListener('change', function(event) {
			event.stopPropagation();
			var selectedOption = this.value in optionElements ? optionElements[this.value] : null,
				selectedAttr = selectedOption.getAttribute('attribute-value');
			if (selectedAttr) {
				tagElement.setAttribute(attributeName, selectedAttr);
			} else {
				tagElement.removeAttribute(attributeName);
			}
			// save changes
			_super.getToolbar().getField().save();
			/*switch (this.value) {
				case 'yes':
					tagElement.setAttribute(attributeName, 'new');
					break;
				default:
					tagElement.removeAttribute(attributeName);
					break;
			}*/
		});

		/* set options */
		_this.addOption = function(value, label, attributeValue) {
			if (api.Functions.isString(value) && value) {
				var element = api.Classes.UI.createElement('option', {value: value});
				if (!api.Functions.isString(attributeValue)) {
					attributeValue = value;
				}
				element.setAttribute('attribute-value', attributeValue);
				if (!api.Functions.isString(label) || !label) {
					label = value;
				}
				element.innerHTML = label;
				optionElements[value] = element;
			}
			return _this;
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

		_this.getElement = function() {
			return element;
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
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		var range = api.Utilities.Selection.getRange();
		if (range) {
			var wrapper = api.Utilities.Dom.findParentTag(tagName);
			if (wrapper) {
				unwrap(wrapper);
			} else {
				wrap(range);
			}
			// save changes
			_super.getToolbar().getField().save();
		}
	};

	var wrap = function(range) {
		var el = api.Classes.UI.createElement(tagName);
		el.appendChild(range.extractContents());
		range.insertNode(el);
		api.Utilities.Dom.expandToTag(el);
	};

	var unwrap = function(wrapper) {
		api.Utilities.Dom.expandToTag(wrapper);
		var sel = api.Utilities.Selection.get();
		var range = sel.getRangeAt(0);
		var unwrappedContent = range.extractContents();
		// remove empty term-tag
		wrapper.parentNode.removeChild(wrapper);
		// insert extracted content
		range.insertNode(unwrappedContent);
		// restore selection
		sel.removeAllRanges();
		sel.addRange(range);
	};

	/* render settings */
	_this.renderSettings = function(container, isNew) {
		var tagElement = api.Utilities.Dom.findParentTag(tagName);
		var createRow = function() {
			return api.Classes.UI.createElement('div', {className: 'toolbar-popover-row'});
		};
		var row1 = createRow();
		row1.classList.add('no-padding');
		var row2 = createRow();
		// create src input field
		var inputUrl = (function() {
			var element = api.Classes.UI.createElement('input', {type: 'text', className: 'input input-text no-border', placeholder: 'URL einfügen', value: tagElement.getAttribute('src')});
			element.addEventListener('keyup', function(event) {
				event.stopPropagation();
				if (this.value) {
					tagElement.setAttribute('src', this.value);
				} else {
					tagElement.removeAttribute('src');
				}
				// save changes
				_super.getToolbar().getField().save();
			});
			return element;
		})();
		// append src input field
		row1.appendChild(inputUrl);
		// set autofocus to src input field
		if (isNew) {
			setTimeout(function() {
				inputUrl.focus();
			}, 1);
		}

		// target select field
		new AttributeSelect(tagElement, 'target')
			.setLabel('In neuem Tab öffnen?')
			.addOption('no', 'nein', '')
			.addOption('yes', 'ja', 'new')
			.appendTo(row2);

		// append row 1
		container.appendChild(row1);
		// append row 2
		container.appendChild(row2);
	};

	_this.checkState = function() {
		return api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
	};


	/* css styles */
	_this.css = function() {
		return {
			'rp-editor-field rp-link': {
				'color': '#0c8fb9'
			},
			'rp-editor-field rp-link:hover': {
				'color': '#0c8fb9'
			}
		};
	};
};