var Block = function(key, data, properties) {
	var _this = this,
		instance,
		blockList,
		container,
		SettingsUI,
		fieldList,
		fieldAutoFocus,
		toolbar,
		settings,
		data = Functions.isArray(data) ? data : [],
		properties = Functions.isObject(properties) ? properties : {};

	/* constructor */
	_this._constructor = function() {
		// create instance
		createInstance();

		// parse and set settings
		settings = Functions.parseObject(
			Functions.trigger(instance.settings),
			[
				{
					name: 'name',
					validate: Functions.isString,
					defaultValue: ''
				},
				{
					name: 'icon',
					validate: Functions.isString,
					defaultValue: ''
				}
			]
		);

		// create toolbar
		toolbar = Functions.createClass(BlockToolbar, [], [_this]);

		// create settings ui
		SettingsUI = Functions.createClass(SettingsUI, [_this, toolbar]);
		Functions.trigger(SettingsUI.initialize);
	};

	/* create instance */
	var createInstance = function() {
		var block = Blocks.getByKey(key);
		if (!block) {
			throw new Error('RPEditor: Block.createInstance(): block «' + key + '» not found.');
		}
		instance = Functions.createClass(block, [], [_this, api]);
	};

	/* initialize */
	_this.initialize = function(_blockList) {
		blockList = _blockList || Functions.createClass(BlockList);

		// create field container
		fieldList = Functions.createClass(FieldList, [], [_this]);

		// call instance method
		Functions.trigger(instance.initialize, false, [data]);

		// render ui
		render();

		// call toolbar instance method
		Functions.trigger(toolbar.initialize);

		// create block chooser
		var blockChooser = Functions.createClass(BlockChooser, [], [_this.getList(), _this]);
		Functions.trigger(blockChooser.render, true);

		// bind events
		bindEvents();
	};

	_this.getKey = function() {
		return key;
	};

	_this.getName = function() {
		if (settings.name) {
			return settings.name;
		}
		return 'nicht definierter Block';
	};

	_this.getIcon = function() {
		if (settings.icon) {
			return settings.icon;
		}
		return '<i class="fa fa-exclamation-triangle"></i>';
	};

	/* render ui */
	var render = function() {
		// load css
		loadCss();

		container = UI.createElement(COMPONENT_TAG_NAME + '-block');
		container.setAttribute('type', Functions.escapeText(key));
		container.setAttribute('name', Functions.escapeText(_this.getName()));
		blockList.getContainer().insertBefore(container, blockList.getContainer().children[_this.getPosition()]);

		// render toolbar
		renderToolbar();

		// call instance method
		Functions.trigger(instance.render);
	};

	/* load css */
	var loadCss = function() {
		// call instance method
		var css = Functions.trigger(instance.css);
		if (Functions.isObject(css)) {
			UI.Styles.add('block/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block[type="' + Functions.escapeText(key) + '"]');
		}
	};

	/* settings ui */
	SettingsUI = function() {
		var _this = this,
			Block,
			Toolbar,
			modal;

		/* constructor */
		_this._constructor = function(_Block, _Toolbar) {
			Block = _Block;
			Toolbar = _Toolbar;
		};

		var createModal = function() {
			// create modal
			var modal = UI.createModal();
			// set title
			modal.setTitle('Blockeinstellungen');
			// set body
			modal.clearBody();
			var fields = Functions.trigger(instance.modalSettings, true);
			if (Functions.isArray(fields)) {
				fields.forEach(function(field) {
					Functions.trigger(field.initialize, true, [Block.getFieldList().getByKey(field.getKey())]);
					modal.appendBody(Functions.trigger(field.render));
				});
			}
			// set buttons
			modal.setButtons([
				{
					label: 'Übernehmen',
					onClick: function(event) {
						instance.updateSettings(fields);
						_this.close();
					}
				},
				{
					label: 'Abbrechen',
					onClick: function(event) {
						_this.close();
					}
				}
			]);
			return modal;
		};

		/* open */
		_this.open = function() {
			if (!Block.hasBlockSettings()) {
				return;
			}
			// create modal
			modal = createModal();
			// open modal
			modal.open(function() {
				// unfocus block
				Block.unfocus();
			});
		};

		/* close */
		_this.close = function() {
			if (!modal || !Block.hasBlockSettings()) {
				return;
			}
			// close modal
			modal.close(function() {
				// focus block
				Block.focus();
				// reset modal variable
				modal = undefined;
			});
		};
	};

	/* render toolbar ui */
	var renderToolbar = function() {
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
			event.stopPropagation();
			// focus block
			if (_this.getContainer().contains(event.target) && !toolbar.getElement().contains(event.target)) {
				_this.focus();
			}
		}, false);
	};

	_this.triggerEvent = function(obj) {
		// custom event "change"
		Core.dispatchEvent('change', {
			detail: Object.assign({blockData: null}, obj, {blockData: fieldList.getBlock().getJson()}),
			bubbles: true,
			cancelable: true
		});
		// trigger update
		fieldList.getBlock().getList().triggerEvent('update');
	};

	_this.focus = function() {
		// if editor is disabled, abort
		if (Core.isDisabled()) {
			return;
		}
		// unfocus old block
		if (selectedBlock && selectedBlock !== _this) {
			selectedBlock.unfocus();
		}
		// focus
		selectedBlock = _this;
		container.classList.add('is-focused');
		// show toolbar
		toolbar.show();
	};

	_this.unfocus = function() {
		selectedBlock = null;
		container.classList.remove('is-focused');
		// remove hovered
		container.classList.remove('is-hovered');
		// hide toolbar
		toolbar.hide();
		// unfocus field
		if (selectedField) {
			selectedField.unfocus();
		}
	};

	_this.getList = function() {
		return blockList;
	};

	_this.getFieldList = function() {
		return fieldList;
	};

	_this.getPosition = function() {
		return blockList.getAll().indexOf(_this);
	};

	_this.getSetting = function(key, defaultValue) {
		return key in settings && settings[key] ? settings[key] : defaultValue ? defaultValue : null;
	};

	_this.getSettings = function(key) {
		return settings;
	};

	_this.hasBlockSettings = function() {
		return Functions.isFunction(instance.modalSettings);
	};

	_this.getSettingsUI = function() {
		return SettingsUI;
	};

	_this.getContainer = function() {
		return container;
	};

	_this.getToolbar = function() {
		return toolbar;
	};

	_this.getInstance = function() {
		return instance;
	};

	/*
	{
		type: 'text',
		name: 'title',
		autofocus: true|false,
		label: 'Titel',
		settings: {
			inlineTools: true|false,
			enableLineBreaks: true|false
		}
	}
	*/
	_this.createField = function(opts) {
		var options = {
				type: ('type' in opts && Functions.isString(opts.type) ? opts.type : null),
				name: ('name' in opts && Functions.isString(opts.name) ? opts.name : null),
				autofocus: ('autofocus' in opts && Functions.isBoolean(opts.autofocus) ? opts.autofocus : false),
				label: ('label' in opts && Functions.isString(opts.label) ? opts.label : null),
				settings: ('settings' in opts && Functions.isObject(opts.settings) ? opts.settings : null)
			},
			_settings = {},
			_data = null;

		for (var i in data) {
			if (Functions.isObject(data[i]) && data[i].type === options.type && data[i].name === options.name) {
				_settings = Functions.isObject(data[i].settings) ? data[i].settings : {};
				//_data = Functions.isObject(data[i].data) ? data[i].data : {};
				_data = data[i].data || _data;
				break;
			}
		}

		var field = Functions.createClass(Field, [options], [_settings, _data, _this]);

		if (options.autofocus === true) {
			fieldAutoFocus = field;
		}

		return fieldList.add(options.name, field);
	};

	_this.getAutoFocusField = function() {
		return fieldAutoFocus;
	};

	_this.moveUp = function() {
		var oldPosition = _this.getPosition(),
			newPosition = oldPosition - 1;
		if (newPosition >= 0 && _this.getContainer().previousElementSibling) {
			// move ui
			_this.getContainer().parentNode.insertBefore(_this.getContainer(), _this.getContainer().previousElementSibling);
			// move block in block list
			blockList.setPosition(_this, newPosition);
			// custom event "block-moved"
			Core.dispatchEvent('block-moved', {
				detail: {
					data: _this.getJson(),
					oldPosition: oldPosition,
					newPosition: newPosition
				},
				bubbles: true,
				cancelable: true
			});
			// trigger update
			blockList.triggerEvent('update');
		}
	};

	_this.moveDown = function() {
		var oldPosition = _this.getPosition(),
			newPosition = oldPosition + 1;
		if (newPosition < blockList.length() && _this.getContainer().nextElementSibling) {
			// move ui
			_this.getContainer().parentNode.insertBefore(_this.getContainer().nextElementSibling, _this.getContainer());
			// move block in block list
			blockList.setPosition(_this, newPosition);
			// custom event "block-moved"
			Core.dispatchEvent('block-moved', {
				detail: {
					data: _this.getJson(),
					oldPosition: oldPosition,
					newPosition: newPosition
				},
				bubbles: true,
				cancelable: true
			});
			// trigger update
			blockList.triggerEvent('update');
		}
	};

	_this.delete = function() {
		var position = _this.getPosition();
		// remove ui
		container.remove();
		// delete block from block list
		blockList.delete(_this);
		// custom event "block-deleted"
		Core.dispatchEvent('block-deleted', {
			detail: {
				data: _this.getJson(),
				position: position + 1
			},
			bubbles: true,
			cancelable: true
		});
		// trigger update
		blockList.triggerEvent('update');
	};

	_this.getAllProperties = function() {
		return properties;
	};

	_this.getProperty = function(key, defaultValue) {
		return key in properties ? properties[key] : defaultValue;
	};

	_this.setProperty = function(key, value, triggerEvent) {
		if ((!(key in properties) && value === '') || (key in properties && properties[key] === value)) {
			return;
		}

		var oldValue = key in properties ? properties[key] : null;

		if (value === '') {
			delete properties[key];
		} else {
			properties[key] = value;
		}

		if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
			_this.triggerEvent({type: 'PROPERTY', key: key, oldValue: oldValue, newValue: value});
		}
	};

	_this.getJson = function() {
		var json = {
			type: key,
			fields: fieldList.getJson()
		};

		(function(properties, prefix) {
			for (var key in properties) {
				json[prefix + key] = properties[key];
			}
		})(_this.getAllProperties(), Core.getBlockPropertyPrefix());

		return json;
	};

	_this.clone = function() {
		return Functions.createClass(Block, [], [_this.getKey(), _this.getJson().fields]);
	};

	_this.getPrevious = function() {
		return _this.getList().getPreviousByBlock(_this);
	};

	_this.getNext = function() {
		return _this.getList().getNextByBlock(_this);
	};
};