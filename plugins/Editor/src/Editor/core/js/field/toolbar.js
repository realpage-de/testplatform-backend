var FieldToolbar = function(_Field) {
	var _this = this,
		container,
		tools = {},
		isOpened = false,
		eventListener = [];

	/* initialize */
	_this.initialize = function() {
		// render ui
		render();
	};

	/* render ui */
	var render = function() {
		container = UI.createToolbarElement('field');

		// field settings
		(function(section) {
			if (section) {
				container.appendChild(section);
			}
		})(createSectionFieldSettings());
		
		// tools
		(function(section) {
			if (section) {
				container.appendChild(section);
			}
		})(createSectionTools());
	};

	var createSectionFieldSettings = function() {
		var section = null,
			inlineTools = _Field.renderToolbar();
		if (Functions.isObject(inlineTools) && Object.keys(inlineTools).length) {
			// create element
			section = UI.createToolbarSectionElement();
			// create tool objects
			for (var name in inlineTools) {
				var tool = Functions.createClass(InlineTool, [inlineTools[name]], [name, _this]);
				tools[name] = tool;
				Functions.trigger(tool.initialize);
				section.appendChild(tool.getContainer());
			};
		}
		return section;
	};

	var createSectionTools = function() {
		var section = null,
			inlineTools = _Field.getFieldSetting('inlineTools');
		if (inlineTools.length) {
			// create element
			section = UI.createToolbarSectionElement();
			// create tool objects
			inlineTools.forEach(function(name) {
				var tool = Functions.createClass(InlineTool, [], [name, _this]);
				tools[name] = tool;
				Functions.trigger(tool.initialize);
				section.appendChild(tool.getContainer());
			});
		}
		return section;
	};

	var ToolbarEventListener = function(Toolbar, event, handler) {
		var _this = this;

		_this.activate = function() {
			document.addEventListener(event, handler);
		};

		_this.deactivate = function() {
			document.removeEventListener(event, handler);
		};
	};

	_this.addEventListener = function(event, handler) {
		eventListener.push(new ToolbarEventListener(_this, event, handler));
	};

	var activateAllEventListener = function() {
		for (var listener in eventListener) {
			eventListener[listener].activate();
		}
	};

	var deactivateAllEventListener = function() {
		for (var listener in eventListener) {
			eventListener[listener].deactivate();
		}
	};

	_this.show = function() {
		// if editor is disabled, toolbar opened or no tools exist, abort
		if (Core.isDisabled() || isOpened || !hasTools()) {
			return;
		}
		// set flag
		isOpened = true;
		setTimeout(function() {
			// show
			_Field.getContainer().insertAdjacentElement('afterbegin', container);
			// check tool state
			document.addEventListener('selectionchange', checkAllToolStates);
			checkAllToolStates();
			// activate event listener
			activateAllEventListener();
			// custom event "toolbar-opened"
			Core.dispatchEvent('toolbar-opened', {
				bubbles: true,
				cancelable: true
			}, _this.getElement());
		}, 1);
	};

	_this.hide = function() {
		// if not opened no tools exist, abort
		if (!isOpened || !hasTools()) {
			return;
		}
		// set flag
		isOpened = false;
		setTimeout(function() {
			// hide
			container.remove();
			document.removeEventListener('selectionchange', checkAllToolStates);
			// activate event listener
			deactivateAllEventListener();
			// custom event "toolbar-closed"
			Core.dispatchEvent('toolbar-closed', {
				bubbles: true,
				cancelable: true
			}, _this.getElement());
		}, 1);
	};

	_this.checkToolState = function(name) {
		if (!arguments.length) {
			return;
		}
		Array.from(arguments).forEach(function(argument) {
			if (argument in tools) {
				// call instance method
				Functions.trigger(tools[argument].checkState);
			}
		});
	};

	var checkAllToolStates = function() {
		for (var name in tools) {
			// call instance method
			Functions.trigger(tools[name].checkState);
		};
	};

	_this.getElement = function() {
		return container;
	}

	_this.getField = function() {
		return _Field;
	};

	_this.isOpened = function() {
		return isOpened;
	};

	var hasTools = function() {
		return Object.keys(tools).length ? true : false;
	};

	_this.getTool = function(name) {
		if (name in tools) {
			return tools[name];
		}
		return null;
	};

	_this.getAllTools = function() {
		return tools;
	};
};