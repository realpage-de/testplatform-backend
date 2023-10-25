var SettingsBlockTune = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Blockeinstellungen',
			icon: '<i class="fa fa-cog"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		// open settings modal
		toolbar.getBlock().getSettingsUI().open();
	};
};