var ListField = function(_super, api) {
	var _this = this,
		data,
		listElement;

	/* settings */
	_this.settings = function() {
		return {
			inlineTools: true,
			enableLineBreaks: true
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
	};

	/* render ui */
	_this.render = function(field) {
		field.setAttributes({
			'spellcheck': 'true'
		});

		// list element
		//listElement = api.Classes.UI.createEditableElement({className: 'list'});
		listElement = api.Classes.UI.createElement('ul', {contentEditable: true, className: 'list'});
		field.appendChild(listElement);

		var items = data || [];
		if (items.length) {
			items.forEach(function(item) {
				listElement.appendChild(createItemElement(item));
			});
		} else {
			listElement.appendChild(createItemElement());
		}

		/*field.addEventListener('input', function(event) {
			event.preventDefault();
			listElement.querySelectorAll('.list-item').forEach(function(item) {
				console.log('DD', item.innerHTML);
				if (item.innerHTML === '<br>') { // item.innerHTML.replace('<br>', '').trim() === ''
					console.log(item);
					item.innerHTML = '';
				}
			});
			if (listElement.innerHTML === '') {
				listElement.appendChild(createItemElement());
			}
			_super.save();
		});*/

		field.addEventListener('keydown', function(event) {
			var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field, includeContent: true});
			if (event.key === 'Backspace' && caretIsAtStart && listElement.childNodes.length === 1 && !field.textContent.trim()) {
				event.preventDefault();
			}
		});
	};

	_this.getElement = function() {
		return listElement;
	}

	var createItemElement = function(text) {
		return api.Classes.UI.createElement('li', {className: 'list-item', innerHTML: (text || '')});
	};

	/* render toolbar ui */
	_this.renderToolbar = function(_Field) {
		return {
			unordered: function(_super, api) {
				var _this = this,
					toolbar,
					style = 'unordered';

				/* settings */
				_this.settings = function() {
					return {
						name: 'unsortierte Liste',
						icon: '<i class="fa fa-list-ul"></i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						listElement.setAttribute('list-style', style);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('style', style);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('ordered');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('style', style) === style ? true : false;
				};
			},
			ordered: function(_super, api) {
				var _this = this,
					toolbar,
					style = 'ordered';

				/* settings */
				_this.settings = function() {
					return {
						name: 'Aufzählungsliste',
						icon: '<i class="fa fa-list-ol"></i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						listElement.setAttribute('list-style', style);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('style', style);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('unordered');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('style') === style ? true : false;
				};
			}
		};
	};

	_this.onAutoFocus = function() {
		if (listElement.childNodes.length) {
			Utilities.Caret.setPositionToStart({element: listElement.childNodes[0]});
		}
	};

	_this.getData = function() {
		var data = [];
		listElement.querySelectorAll('.list-item').forEach(function(item) {
			data.push(item.innerHTML);
		});
		return data;
	};

	/* css styles */
	_this.css = function() {
		return {
			'.list': {
				'width': '100%',
				'max-width': '100%',
				'display': 'inline-block'
			},
			'.list[list-style="unordered"]': {
				'list-style-type': 'disc'
			},
			'.list[list-style="ordered"]': {
				'list-style-type': 'decimal'
			},
			'.list > .list-item + .list-item': {
				'margin-top': '10px'
			}
		};
	};
};