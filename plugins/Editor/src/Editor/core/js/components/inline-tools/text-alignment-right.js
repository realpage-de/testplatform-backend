var TextAlignmentRightInlineTool = function(_super, api) {
	var _this = this,
		toolbar,
		alignment = 'right';

	/* settings */
	_this.settings = function() {
		return {
			name: 'Textausrichtung rechts',
			icon: '<i class="fa fa-align-right"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* render ui */
	_this.render = function() {
		if (getState()) {
			toolbar.getField().getElement().setAttribute('alignment', alignment);
		}
		_super.getContainer().classList.toggle('is-active', getState());
	};

	/* on click event */
	_this.onClick = function(event) {
		if (getState()) {
			toolbar.getField().removeSetting('alignment');
		} else {
			toolbar.getField().setSetting('alignment', alignment);
		}
		// render ui
		_this.render();
		// check related tool states
		toolbar.checkToolState('text-alignment-left', 'text-alignment-center');
	};

	_this.checkState = function() {
		// render ui
		_this.render();
	};

	var getState = function() {
		return toolbar.getField().getSetting('alignment') === alignment ? true : false;
	};

	/* css styles */
	_this.css = function() {
		return {
			'rp-editor-field[alignment="right"]': {
				'text-align': 'right'
			}
		};
	};
};