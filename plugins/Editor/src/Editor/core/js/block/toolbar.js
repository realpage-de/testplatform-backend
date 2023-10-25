var BlockToolbar = function(_Block) {
	var _this = this,
		container,
		tunes = {},
		isOpened = false;

	/* initialize */
	_this.initialize = function() {
		// render ui
		render();
	};

	/* render ui */
	var render = function() {
		container = UI.createToolbarElement('block');

		// block settings
		(function(section) {
			if (section) {
				container.appendChild(section);
			}
		})(createSectionBlockSettings());

		// tunes
		(function(section) {
			if (section) {
				container.appendChild(section);
			}
		})(createSectionTunes());
	};

	var createSectionBlockSettings = function() {
		var section = null;
		if (_Block.hasBlockSettings()) {
			// create element
			section = UI.createToolbarSectionElement();
			// create tune object
			var name = 'settings';
			var tune = Functions.createClass(BlockTune, [SettingsBlockTune], [name, _this]);
			tunes[name] = tune;
			Functions.trigger(tune.initialize);
			section.appendChild(tune.getContainer());
		}
		return section;
	};

	var createSectionTunes = function() {
		var section = null,
			blockTunes = BlockTunes.getAll();
		if (Object.keys(blockTunes).length) {
			// create element
			section = UI.createToolbarSectionElement();
			// create tune objects
			for (var name in blockTunes) {
				var tune = Functions.createClass(BlockTune, [], [name, _this]);
				tunes[name] = tune;
				Functions.trigger(tune.initialize);
				section.appendChild(tune.getContainer());
			};
		}
		return section;
	};

	_this.show = function() {
		// if editor is disabled, toolbar opened or no tunes exist, abort
		if (Core.isDisabled() || isOpened || !hasTunes()) {
			return;
		}
		// set flag
		isOpened = true;
		setTimeout(function() {
			// show
			_Block.getContainer().insertAdjacentElement('afterbegin', container);
			// custom event "toolbar-opened"
			Core.dispatchEvent('toolbar-opened', {
				bubbles: true,
				cancelable: true
			}, _this.getElement());
		}, 1);
	};

	_this.hide = function() {
		// if not opened or no tunes exist, abort
		if (!isOpened || !hasTunes()) {
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
	};

	_this.getBlock = function() {
		return _Block;
	};

	_this.isOpened = function() {
		return isOpened;
	};

	var hasTunes = function() {
		return Object.keys(tunes).length ? true : false;
	};

	_this.getTool = function(name) {
		if (name in tunes) {
			return tunes[name];
		}
		return null;
	};

	_this.getAllTools = function() {
		return tunes;
	};
};