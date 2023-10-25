var InlineTool = function(key, _Toolbar) {
	var _this = this,
		inlineTool,
		instance,
		container,
		settings,
		SettingsUI,
		state = false,
		anchorElement;

	/* constructor */
	_this._constructor = function(_inlineTool) {
		if (Functions.isFunction(_inlineTool)) {
			inlineTool = _inlineTool;
		}
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

		// create settings ui
		SettingsUI = Functions.createClass(SettingsUI, [_this, _Toolbar]);
		Functions.trigger(SettingsUI.initialize);
	};

	/* create instance */
	var createInstance = function() {
		if (!inlineTool) {
			inlineTool = InlineTools.getByKey(key);
		}
		if (!inlineTool) {
			throw new Error('RPEditor: InlineTool.createInstance(): inline tool «' + key + '» not found.');
		}
		instance = Functions.createClass(inlineTool, [], [_this, api]);
	};

	/* initialize */
	_this.initialize = function() {
		// call instance method
		Functions.trigger(instance.initialize, false, [_Toolbar]);

		// render ui
		_this.render();

		// call instance method
		Functions.trigger(instance.render);

		// bind events
		bindEvents();
	};

	_this.getName = function() {
		if (settings.name) {
			return settings.name;
		}
		return 'nicht definiertes Tool';
	};

	_this.getIcon = function() {
		if (settings.icon) {
			return settings.icon;
		}
		return '<i class="fa fa-exclamation-triangle"></i>';
	};

	/* render ui */
	_this.render = function() {
		// load css
		loadCss();

		container = UI.createElement(COMPONENT_TAG_NAME + '-toolbar-button', {innerHTML: _this.getIcon()});
		UI.createTooltip(container, _this.getName());
	};

	/* load css */
	var loadCss = function() {
		// call instance method
		var css = Functions.trigger(instance.css);
		if (Functions.isObject(css)) {
			UI.Styles.add('inline-tool/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-field-wrapper');
		}
	};

	/* sanitize */
	_this.sanitize = function() {
		if (Functions.isFunction(instance.sanitize)) {
			var data = Functions.trigger(instance.sanitize);
			if (Functions.isObject(data)) {
				return data;
			}
		}
		return {};
	};

	/* settings ui */
	SettingsUI = function() {
		var _this = this,
			InlineTool,
			Toolbar,
			container,
			containerInner;

		/* constructor */
		_this._constructor = function(_InlineTool, _Toolbar) {
			InlineTool = _InlineTool;
			Toolbar = _Toolbar;
		};

		/* initialize */
		_this.initialize = function() {
			if (!InlineTool.hasSettings()) {
				return;
			}
			// create ui
			createUI();
		};

		/* create ui */
		var createUI = function() {
			container = UI.createElement('div', {className: 'toolbar-popover-wrapper'});
			containerInner = UI.createElement('div', {className: 'toolbar-popover-wrapper-inner'});
			container.appendChild(containerInner);
		};

		/* remove ui */
		var removeUI = function() {
			container.remove();
			// update container position
			window.removeEventListener('resize', updateContainerPosition);
		};

		var clickCallback = function(event) {
			if (container) {
				// clicked inside
				if (container.contains(event.target)) {
					// nothing
				}
				// clicked outside
				else if (!InlineTool.getState()) {
					// remove click event
					document.removeEventListener('click', clickCallback, true);
					// close
					_this.close();
				}
			}
		};

		/* render ui */
		var render = function(isNew) {
			isNew = Functions.isBoolean(isNew) ? isNew : false;
			// render
			(function() {
				// clear container
				containerInner.innerHTML = '';
				// fill container
				Functions.trigger(instance.renderSettings, true, [containerInner, isNew]);
				// insert container after toolbar
				Toolbar.getElement().parentNode.insertBefore(container, Toolbar.getElement().nextElementSibling);
				// update container position
				window.addEventListener('resize', updateContainerPosition);
				updateContainerPosition();
			})();
			/* click event */
			document.addEventListener('click', clickCallback, true);
		};

		/* update container position */
		var updateContainerPosition = function() {
			var selectionRect = Utilities.Selection.getAnchorElement().getBoundingClientRect(),
				fieldRect = Toolbar.getField().getElement().getBoundingClientRect(),
				posX = selectionRect.left + ((selectionRect.right - selectionRect.left) / 2) - fieldRect.left,
				posY = selectionRect.top + selectionRect.bottom - selectionRect.top - fieldRect.top + 10;
			container.style.left = posX + 'px';
			container.style.top = posY + 'px';
		};

		/* open */
		_this.open = function(isNew) {
			if (!InlineTool.hasSettings()) {
				return;
			}
			isNew = Functions.isBoolean(isNew) ? isNew : false;
			// render
			render(isNew);
		};


		/* close */
		_this.close = function() {
			if (!InlineTool.hasSettings()) {
				return;
			}
			// remove ui
			removeUI();
		};
	};

	/* bind events */
	var bindEvents = function() {
		// mouse enter
		container.addEventListener('mouseenter', function(event) {
			this.classList.add('is-hovered');
		});
		// mouse leave
		container.addEventListener('mouseleave', function(event) {
			this.classList.remove('is-hovered');
		});
		// instance on click
		container.addEventListener('click', function(event) {
			// call instance method
			Functions.trigger(instance.onClick, false, [event]);
			// call toolbar instance method
			Functions.trigger(_this.checkState, true, [true]);
		});
		// instance on opened
		_Toolbar.getElement().addEventListener('toolbar-opened', function(event) {
			// call instance method
			Functions.trigger(instance.onOpen, false, [event]);
		});
		// instance on closed
		_Toolbar.getElement().addEventListener('toolbar-closed', function(event) {
			// call instance method
			Functions.trigger(instance.onClose, false, [event]);
		});
	};

	/* check state */
	_this.checkState = function(isNew) {
		isNew = Functions.isBoolean(isNew) ? isNew : false;
		// call instance method
		var _state = Functions.trigger(instance.checkState),
			_anchorElement = Utilities.Selection.getAnchorElement();
		if (Functions.isBoolean(_state)) {
			// update button
			container.classList.toggle('is-active', _state);
			// open settings
			if (_state && anchorElement !== _anchorElement) {
				SettingsUI.open(isNew);
			}
			// set state
			state = _state;
			// set anchor element
			anchorElement = _anchorElement;
		}
	};

	_this.hasSettings = function() {
		return Functions.isFunction(instance.renderSettings);
	};

	_this.getKey = function() {
		return key;
	};

	_this.getState = function() {
		return state;
	};

	_this.getContainer = function() {
		return container;
	};

	_this.getInstance = function() {
		return instance;
	};

	_this.getToolbar = function() {
		return _Toolbar;
	}
};