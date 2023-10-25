var HeadingField = function(_super, api) {
	var _this = this,
		data = '';

	/* settings */
	_this.settings = function() {
		return {
			inlineTools: true,
			enableLineBreaks: false
		};
	};

	var validateLevel = function(level) {
		return level ? (level <= 0 ? 1 : (level > 6) ? 6 : level) : 1;
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = api.Functions.isString(_data) ? _data : data;
		// set properties
		_super.setSetting('level', validateLevel(_super.getSetting('level')));
	};

	/* render ui */
	_this.render = function(field) {
		field.setAttributes({
			'level': _super.getSetting('level'),
			'placeholder': 'Überschrift einfügen',
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

	/* render toolbar ui */
	_this.renderToolbar = function(_Field) {
		return {
			'h1': function(_super, api) {
				var _this = this,
					toolbar,
					level = 1;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 1',
						icon: '<i class="fas fa-heading">1</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h2', 'h3', 'h4', 'h5', 'h6');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="1"]': {
							'font-size': '35px'
						}
					};
				};
			},
			'h2': function(_super, api) {
				var _this = this,
					toolbar,
					level = 2;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 2',
						icon: '<i class="fas fa-heading">2</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h1', 'h3', 'h4', 'h5', 'h6');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="2"]': {
							'font-size': '30px'
						}
					};
				};
			},
			'h3': function(_super, api) {
				var _this = this,
					toolbar,
					level = 3;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 3',
						icon: '<i class="fas fa-heading">3</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h1', 'h2', 'h4', 'h5', 'h6');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="3"]': {
							'font-size': '27px'
						}
					};
				};
			},
			'h4': function(_super, api) {
				var _this = this,
					toolbar,
					level = 4;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 4',
						icon: '<i class="fas fa-heading">4</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h1', 'h2', 'h3', 'h5', 'h6');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="4"]': {
							'font-size': '24px'
						}
					};
				};
			},
			'h5': function(_super, api) {
				var _this = this,
					toolbar,
					level = 5;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 5',
						icon: '<i class="fas fa-heading">5</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h1', 'h2', 'h3', 'h4', 'h6');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="5"]': {
							'font-size': '21px'
						}
					};
				};
			},
			'h6': function(_super, api) {
				var _this = this,
					toolbar,
					level = 6;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Überschrift 6',
						icon: '<i class="fas fa-heading">6</i>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						toolbar.getField().getElement().setAttribute('level', level);
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('level', level);
					// render ui
					_this.render();
					// check related tool states
					toolbar.checkToolState('h1', 'h2', 'h3', 'h4', 'h5');
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('level') === level ? true : false;
				};

				/* css styles */
				_this.css = function() {
					return {
						'rp-editor-field[level="6"]': {
							'font-size': '18px'
						}
					};
				};
			}
		};
	};

	/* css styles */
	_this.css = function() {
		return {
			'': {
				'line-height': '1'
			}
		};
	};
};