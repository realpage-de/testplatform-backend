var UnderlineInlineTool = function(_super, api) {
	var _this = this,
		toolbar,
		tagName = 'u';

	/* settings */
	_this.settings = function() {
		return {
			name: 'Unterstrichen',
			icon: '<i class="fa fa-underline"></i>'
		};
	};

	/* sanitize */
	_this.sanitize = function() {
		return {
			u: {}
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		var range = api.Utilities.Selection.getRange();
		if (range) {
			var wrapper = api.Utilities.Dom.findParentTag(tagName);
			if (wrapper) {
				unwrap(wrapper);
			} else {
				wrap(range);
			}
			// save changes
			_super.getToolbar().getField().save();
		}
	};

	var wrap = function(range) {
		var el = api.Classes.UI.createElement(tagName);
		el.appendChild(range.extractContents());
		range.insertNode(el);
		api.Utilities.Dom.expandToTag(el);
	};

	var unwrap = function(wrapper) {
		api.Utilities.Dom.expandToTag(wrapper);
		var sel = api.Utilities.Selection.get();
		var range = sel.getRangeAt(0);
		var unwrappedContent = range.extractContents();
		// remove empty term-tag
		wrapper.parentNode.removeChild(wrapper);
		// insert extracted content
		range.insertNode(unwrappedContent);
		// restore selection
		sel.removeAllRanges();
		sel.addRange(range);
	};

	_this.checkState = function() {
		var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
		_super.getContainer().classList.toggle('is-active', state);
	};
};