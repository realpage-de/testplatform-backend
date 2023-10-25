var EditorTool = function(key, _Toolbar) {
	var _this = this,
		editorTool,
		instance,
		container,
		settings;

	/* constructor */
	_this._constructor = function(_editorTool) {
		if (Functions.isFunction(_editorTool)) {
			editorTool = _editorTool;
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
	};

	/* create instance */
	var createInstance = function() {
		if (!editorTool) {
			editorTool = EditorTools.getByKey(_this.getKey());
		}
		if (!editorTool) {
			throw new Error('RPEditor: EditorTool.createInstance(): editor tool «' + _this.getKey() + '» not found.');
		}
		instance = Functions.createClass(editorTool, [], [_this, api]);
	};

	/* initialize */
	_this.initialize = function() {
		// call instance method
		Functions.trigger(instance.initialize, false, [_Toolbar]);

		// render ui
		render();

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
		return 'nicht definiertes Tool';
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

		container = UI.createElement(COMPONENT_TAG_NAME + '-toolbar-button', {innerHTML: _this.getIcon()});
		UI.createTooltip(container, _this.getName());
	};

	/* load css */
	var loadCss = function() {
		// call instance method
		var css = Functions.trigger(instance.css);
		if (Functions.isObject(css)) {
			UI.Styles.add('editor-tool/' + _this.getKey(), css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-toolbar[type="editor"]');
		}
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

	_this.getContainer = function() {
		return container;
	};

	_this.getInstance = function() {
		return instance;
	};
};