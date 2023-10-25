var NbspInlineTool = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Geschütztes Leerzeichen',
			icon: '<i class="far fa-window-minimize"></i>'
		};
	};

	/* sanitize */
	_this.sanitize = function() {
		return {
			i: {}
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		var range = api.Utilities.Selection.getRange();
		api.Utilities.Selection.delete();
		range.insertNode(document.createTextNode('\u00A0'));
		_super.getToolbar().getField().save();
	};
};