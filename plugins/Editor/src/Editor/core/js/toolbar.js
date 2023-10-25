var EditorToolbar = function() {
	var _this = this,
		container,
		tools = {},
		isOpened = false;

	/* initialize */
	_this.initialize = function() {
		// render ui
		render();
		// bind events
		bindEvents();
	};

	/* render ui */
	var render = function() {
		var createSection = function() {
			var section = null,
				editorTools = EditorTools.getAll();
			if (Object.keys(editorTools).length) {
				// create element
				section = UI.createToolbarSectionElement();
				// create tool objects
				for (var name in editorTools) {
					var tool = Functions.createClass(EditorTool, [], [name, _this]);
					tools[name] = tool;
					Functions.trigger(tool.initialize);
					section.appendChild(tool.getContainer());
				};
			}
			return section;
		};

		container = UI.createToolbarElement('editor');
		_this.hide();

		// settings
		(function(section) {
			if (section) {
				container.appendChild(section);
			}
		})(createSection());
	};

	var bindEvents = function() {
		// editor disabled
		Core.Config.webcomponent.addEventListener('disabled', function(event) {
			// show or hide
			_this[(event.detail === true ? 'hide' : 'show')]();
		});
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
			UI.getElement('editor').insertAdjacentElement('afterbegin', container);
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
			// custom event "toolbar-closed"
			Core.dispatchEvent('toolbar-closed', {
				bubbles: true,
				cancelable: true
			}, _this.getElement());
		}, 1);
	};

	_this.getElement = function() {
		return container;
	}

	_this.get = function(name) {
		return (name in tools) ? tools[name] : null;
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