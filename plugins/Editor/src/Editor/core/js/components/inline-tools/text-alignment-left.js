var TextAlignmentLeftInlineTool = function(_super, api) {
	var _this = this,
		toolbar,
		alignment = 'left';

	/* settings */
	_this.settings = function() {
		return {
			name: 'Textausrichtung links',
			icon: '<i class="fa fa-align-left"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* render ui */
	_this.render = function() {
		if (getState()) {
			toolbar.getField().getElement().removeAttribute('alignment');
		}
		_super.getContainer().classList.toggle('is-active', getState());
	};

	/* on click event */
	_this.onClick = function(event) {
		toolbar.getField().removeSetting('alignment');
		// render ui
		_this.render();
		// check related tool states
		toolbar.checkToolState('text-alignment-center', 'text-alignment-right');
	};

	_this.checkState = function() {
		// render ui
		_this.render();
	};

	var getState = function() {
		return !toolbar.getField().getSetting('alignment') ? true : false;
	};

	/* css styles */
	_this.css = function() {
		return {
			'rp-editor-field[alignment="left"]': {
				'text-align': 'left'
			}
		};
	};
};