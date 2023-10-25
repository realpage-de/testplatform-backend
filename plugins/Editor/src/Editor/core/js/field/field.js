var Field = function(_settings, jsonData, Block) {
	var _this = this,
		options,
		instance,
		fieldList,
		container,
		element,
		toolbar,
		_initialized = false,
		settings = Functions.isObject(_settings) ? _settings : {},
		data;

	/* constructor */
	_this._constructor = function(_options) {
		options = _options;

		// create instance
		createInstance();

		// parse and set field settings
		options.settings = Functions.parseObject(
			(function(defaultSettings) {
				return (Functions.isObject(options.settings) ? Object.assign(defaultSettings, options.settings) : defaultSettings);
			})(Functions.trigger(instance.settings)),
			[
				{
					name: 'inlineTools',
					validate: function(value) {
						if (Functions.isBoolean(value) && value === true) {
							return false;
						}
						if (Functions.isBoolean(value) && value === false) {
							return true;
						}
						return true;
					},
					parse: function(value) {
						if (Functions.isArray(value)) {
							return Functions.arrayIntersection(InlineTools.getAllKeys(), value);
						}
						return [];
					},
					defaultValue: InlineTools.getAllKeys()
				},
				{
					name: 'enableLineBreaks',
					validate: Functions.isBoolean,
					defaultValue: false
				},
				{
					name: 'name',
					validate: Functions.isString,
					defaultValue: false
				}
			]
		);

		// create toolbar
		toolbar = Functions.createClass(FieldToolbar, [], [_this]);
	};

	/* create instance */
	var createInstance = function() {
		var field = Fields.getByKey(options.type);
		if (!field) {
			throw new Error('RPEditor: Field.createInstance(): field «' + options.type + '» not found.');
		}
		instance = Functions.createClass(field, [], [_this, api]);
	};

	/* initialize */
	_this.initialize = function(_fieldList) {
		fieldList = _fieldList;

		// create field element
		element = createFieldElement();

		// call instance method
		Functions.trigger(instance.initialize, false, [jsonData]);

		// render ui
		render();

		// call toolbar instance method
		Functions.trigger(toolbar.initialize);

		// bind events
		bindEvents();

		// get data
		if (Functions.isFunction(instance.getData)) {
			data = Functions.trigger(instance.getData);
		}

		_initialized = true;
	};

	/* render ui */
	var render = function() {
		// load css
		loadCss();

		container = UI.createElement(COMPONENT_TAG_NAME + '-field-wrapper');
		container.setAttribute('name', options.name);
		container.setAttribute('spellcheck', 'false');
		container.setAttribute('type', Functions.escapeText(options.type));

		// call instance method
		Functions.trigger(instance.render, false, [element]);

		if (options.label) {
			container.appendChild(UI.createElement('label', {innerHTML: options.label}));
		}

		// add field element
		container.appendChild(element);
	};

	/* load css */
	var loadCss = function() {
		// call instance method
		var css = Functions.trigger(instance.css);
		if (Functions.isObject(css)) {
			UI.Styles.add('field/' + options.type, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-field-wrapper[type="' + Functions.escapeText(options.type) + '"] > ' + COMPONENT_TAG_NAME + '-field');
		}
	};

	_this.renderToolbar = function() {
		// call instance method
		return Functions.trigger(instance.renderToolbar, false, [_this]);
	};

	/* bind events */
	var bindEvents = function() {
		// editor disabled
		Core.Config.webcomponent.addEventListener('disabled', function(event) {
			// if editor is disabled
			if (event.detail) {
				// unfocus
				_this.unfocus();
			}
		});
		// mouse enter
		container.addEventListener('mouseenter', function(event) {
			this.classList.add('is-hovered');
		});
		// mouse leave
		container.addEventListener('mouseleave', function(event) {
			this.classList.remove('is-hovered');
		});
		// click
		container.addEventListener('click', function(event) {
			// focus field
			if (!selectedField || selectedField !== _this) {
				_this.focus();
			}
		});
		/* keydown */
		element.addEventListener('keydown', function(event) {
			var caretIsAtStart = Utilities.Caret.isAtStart({includeContent: true}),
				caretIsAtEnd = Utilities.Caret.isAtEnd({includeContent: true});

			// enter pressed and line breaks are disabled
			if (event.key === 'Enter' && !_this.getFieldSetting('enableLineBreaks')) {
				event.preventDefault();
			}
			// tab pressed
			if (event.key === 'Tab' && event.shiftKey === true) {
				event.stopPropagation();
				event.preventDefault();
				eventArrowLeftAndUpOrTab();
			}
			// shift and tab pressed
			if (event.key === 'Tab' && event.shiftKey === false) {
				event.stopPropagation();
				event.preventDefault();
				eventArrowRightAndDownOrShiftAndTab();
			}
			// arrow up or left pressed
			if ((event.key === 'ArrowUp' || event.key === 'ArrowLeft') && event.shiftKey === false && caretIsAtStart) {
				event.stopPropagation();
				event.preventDefault();
				eventArrowLeftAndUpOrTab();
			}
			// arrow down or right pressed
			if ((event.key === 'ArrowDown' || event.key === 'ArrowRight') && event.shiftKey === false && caretIsAtEnd) {
				event.stopPropagation();
				event.preventDefault();
				eventArrowRightAndDownOrShiftAndTab();
			}
		});
	};

	_this.save = function(triggerEvent) {
		if (Functions.isFunction(instance.getData)) {
			var newData = Functions.trigger(instance.getData);
			if (data === newData) {
				return;
			}

			var oldData = data;
			data = newData;

			if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
				if (_initialized === true) {
					_this.triggerEvent({type: 'CONTENT', oldValue: oldData, newValue: newData});
				}
			}
		}
	};

	_this.getData = function() {
		return data;
	};

	_this.setData = function(data) {
		// call instance method
		Functions.trigger(instance.setData, true, [data]);
	};

	_this.autofocus = function() {
		_this.focus();
		// call instance method
		Functions.trigger(instance.onAutoFocus, false);
	};

	_this.focus = function() {
		// if editor is disabled, abort
		if (Core.isDisabled()) {
			return;
		}
		// unfocus old field
		if (selectedField && selectedField !== _this) {
			selectedField.unfocus();
		}
		// focus
		selectedField = _this;
		container.classList.add('is-focused');
		// set focus
		element.focus();
		// call instance method
		Functions.trigger(instance.onFocus, false);
		// show toolbar
		toolbar.show();
	};

	_this.unfocus = function() {
		selectedField = null;
		container.classList.remove('is-focused');
		// hide toolbar
		toolbar.hide();
	};

	_this.onPaste = function(data) {
		// insert text
		document.execCommand(/*'insertText'*/'insertHTML', false, data);
		// call instance method
		Functions.trigger(instance.onPaste, false, [data]);
	};

	_this.getList = function() {
		return fieldList;
	};

	_this.getPosition = function() {
		return fieldList.getAll().indexOf(_this);
	};

	_this.getSetting = function(key, defaultValue) {
		return key in settings ? settings[key] : defaultValue ? defaultValue : null;
	};

	_this.getSettings = function() {
		return settings;
	};

	_this.setSetting = function(key, value, triggerEvent) {
		if (key in settings && (settings[key] === value || Functions.objectEquals(settings[key], value))) {
			return;
		}

		var oldValue = settings[key];
		settings[key] = value;

		if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
			_this.triggerEvent({type: 'SETTINGS', key: key, oldValue: oldValue, newValue: settings[key]});
		}
	};

	_this.removeSetting = function(key, triggerEvent) {
		var status = false;
		if (key in settings) {
			var oldValue = settings[key];
			delete settings[key];
			status = true;
			if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
				_this.triggerEvent({type: 'SETTINGS', key: key, oldValue: oldValue, newValue: null});
			}
		}
		return status;
	};

	_this.getFieldSetting = function(key, defaultValue) {
		return key in options.settings ? options.settings[key] : defaultValue ? defaultValue : null;
	};

	_this.getFieldSettings = function(key) {
		return options.settings;
	};

	_this.getElement = function() {
		return element;
	};

	_this.getContainer = function() {
		return container;
	};

	_this.getKey = function() {
		return options.type;
	};

	_this.getBlock = function() {
		return Block;
	};

	_this.getToolbar = function() {
		return toolbar;
	};

	_this.getInstance = function() {
		return instance;
	};

	var createFieldElement = function() {
		var element = UI.createElement(COMPONENT_TAG_NAME + '-field');
		element.setAttribute('name', options.name);
		return element;
	};

	_this.triggerEvent = function(obj) {
		if (_initialized === true) {
			// custom event "change"
			Core.dispatchEvent('change', {
				detail: Object.assign({blockData: null}, obj, {blockData: fieldList.getBlock().getJson()}),
				bubbles: true,
				cancelable: true
			});
			// trigger update
			fieldList.getBlock().getList().triggerEvent('update');
		}
	};

	_this.getJson = function() {
		var json = {
				type: options.type,
				name: options.name
			};

		(function(settings) {
			if (Object.keys(settings).length) {
				json['settings'] = settings;
			}
		})(_this.getSettings());

		// QUICK FIX
		if (_this.getKey() === 'container' && Functions.isFunction(instance.getData)) {
			data = Functions.trigger(instance.getData);
		}

		json['data'] = data;
		return json;
	};


	var eventArrowLeftAndUpOrTab = function() {
		var getFieldByFieldElement = function(element) {
			var recBlockList = function(blockList) {
				var blocks = blockList.getAll();
				for (var i = 0; i < blocks.length; i++) {
					var fields = blocks[i].getFieldList().getAll();
					for (var key in fields) {
						if (fields[key].getKey() === 'container') {
							var _return = recBlockList(fields[key].getInstance().getBlockList());
							if (_return) {
								return _return;
							}
						} else {
							if (fields[key].getElement() === element) {
								return fields[key];
							}
						}
					}
				};
			};
			return recBlockList(Core.getBlocks());
		};

		var inputs = Array.from(UI.getAllContentEditableElements()).reverse();
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i] === Utilities.Selection.getContentEditableElement()) {
				var input = inputs[i + 1];
				if (input) {
					var prevFieldElement;
					if (input.nodeName.toLowerCase() === COMPONENT_TAG_NAME + '-field') {
						prevFieldElement = input;
					} else {
						var t = input.closest(COMPONENT_TAG_NAME + '-field');
						if (t) {
							prevFieldElement = t;
						}
					}

					var field = getFieldByFieldElement(prevFieldElement);
					if (field) {
						field.getBlock().focus();
						field.focus();
						Utilities.Caret.setPositionToEnd({element: input});
					}
				}
				break;
			}
		};
	};

	var eventArrowRightAndDownOrShiftAndTab = function() {
		var getFieldByFieldElement = function(element) {
			var recBlockList = function(blockList) {
				var blocks = blockList.getAll();
				for (var i = 0; i < blocks.length; i++) {
					var fields = blocks[i].getFieldList().getAll();
					for (var key in fields) {
						if (fields[key].getKey() === 'container') {
							var _return = recBlockList(fields[key].getInstance().getBlockList());
							if (_return) {
								return _return;
							}
						} else {
							if (fields[key].getElement() === element) {
								return fields[key];
							}
						}
					}
				};
			};
			return recBlockList(Core.getBlocks());
		};

		var inputs = Array.from(UI.getAllContentEditableElements()).reverse();
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i] === Utilities.Selection.getContentEditableElement()) {
				var input = inputs[i - 1];
				if (input) {
					var prevFieldElement;
					if (input.nodeName.toLowerCase() === COMPONENT_TAG_NAME + '-field') {
						prevFieldElement = input;
					} else {
						var t = input.closest(COMPONENT_TAG_NAME + '-field');
						if (t) {
							prevFieldElement = t;
						}
					}

					var field = getFieldByFieldElement(prevFieldElement);
					if (field) {
						field.getBlock().focus();
						field.focus();
						Utilities.Caret.setPositionToStart({element: input});
					}
				}
				break;
			}
		};
	};

	_this.getPrevious = function() {
		return _this.getList().getPreviousByField(_this);
	};

	_this.getNext = function() {
		return _this.getList().getNextByField(_this);
	};

	var getAllContentEditableElements = function() {
		return Array.from(_this.getContainer().querySelectorAll('[contenteditable]'));
	};

	_this.getFirstContentEditableElement = function() {
		var list = getAllContentEditableElements();
		return list.length ? list[0] : null;
	};

	_this.getLastContentEditableElement = function() {
		var list = getAllContentEditableElements();
		return list.length ? list[list.length - 1] : null;
	};
};