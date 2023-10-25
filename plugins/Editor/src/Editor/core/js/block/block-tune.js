var BlockTune = function(key, _Toolbar) {
	var _this = this,
		blockTune,
		instance,
		container,
		settings;

	/* constructor */
	_this._constructor = function(_blockTune) {
		if (Functions.isFunction(_blockTune)) {
			blockTune = _blockTune;
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
		if (!blockTune) {
			blockTune = BlockTunes.getByKey(_this.getKey());
		}
		if (!blockTune) {
			throw new Error('RPEditor: BlockTune.createInstance(): block tool «' + _this.getKey() + '» not found.');
		}
		instance = Functions.createClass(blockTune, [], [_this, api]);
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
		container.setAttribute('tune', key);
		UI.createTooltip(container, _this.getName());
	};

	/* load css */
	var loadCss = function() {
		// call instance method
		var css = Functions.trigger(instance.css);
		if (Functions.isObject(css)) {
			UI.Styles.add('block-tune/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-toolbar[type="block"] ' + COMPONENT_TAG_NAME + '-toolbar-section ' + COMPONENT_TAG_NAME + '-toolbar-button[tune="' + key + '"]');
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