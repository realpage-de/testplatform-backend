var ShyInlineTool = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Weiches Trennzeichen',
			icon: '<i style="font-weight: bold;">shy</i>'
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
		range.insertNode(document.createTextNode('\u00AD'));
		_super.getToolbar().getField().save();
	};
};