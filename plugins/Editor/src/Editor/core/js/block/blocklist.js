var BlockList = function() {
	var _this = this,
		list = [],
		parentContainer,
		events,
		container;

	/* constructor */
	_this._constructor = function(_parentContainer, _events) {
		parentContainer = _parentContainer;
		_events = Functions.isObject(_events) ? _events : {};
		events = {
			update: Functions.isFunction(_events.onUpdate) ? _events.onUpdate : function(){}
		};

		// render ui
		render();
	};

	/* render ui */
	var render = function() {
		container = UI.createElement(COMPONENT_TAG_NAME + '-blocks');
		if (parentContainer) {
			parentContainer.appendChild(container);
			// create block chooser
			var blockChooser = Functions.createClass(BlockChooser, [], [_this]);
			Functions.trigger(blockChooser.render, true);
		}
	};

	_this.getFirst = function() {
		return _this.length() ? list[0] : null;
	};

	_this.getLast = function() {
		return _this.length() ? list[_this.length() - 1] : null;
	};

	_this.getPreviousByBlock = function(block) {
		var index = list.indexOf(block);
		if (index > 0) {
			return list[index - 1];
		}
		return null;
	};

	_this.getNextByBlock = function(block) {
		var index = list.indexOf(block) + 1;
		if (index > 0 && index < _this.length()) {
			return list[index];
		}
		return null;
	};

	_this.getAll = function() {
		return list;
	};

	_this.add = function(block, position) {
		if (list.indexOf(block) === -1) {
			position = checkPositionParam(position);
			list.splice(position, 0, block);
			return block;
		}
		return false;
	};

	_this.setPosition = function(block, newPosition) {
		list.splice(newPosition, 0, list.splice(list.indexOf(block), 1)[0]);
	};

	_this.delete = function(block) {
		if (list.indexOf(block) !== -1) {
			list = list.filter(function(_block) {
				return _block !== block;
			});
			return true;
		}
		return false;
	};

	_this.length = function() {
		return list.length;
	};

	_this.clear = function() {
		list = [];
	};

	_this.getContainer = function() {
		return container;
	};

	var checkPositionParam = function(position) {
		if (!position || !Number.isInteger(position) || position > _this.length()) {
			position = _this.length();
		} else if (position < 0) {
			position = 0;
		}
		return position;
	};

	_this.triggerEvent = function(name) {
		if (name in events) {
			events[name]();
		}
	};

	_this.getJson = function() {
		var data = [];
		list.forEach(function(block) {
			data.push(block.getJson());
		});
		return data;
	};
};