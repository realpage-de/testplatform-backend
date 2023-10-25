Utilities.Selection = Functions.createClass(function() {
	var _this = this;

	_this.get = function() {
		return window.getSelection();
	};

	_this.getAsString = function() {
		return _this.get().toString();
	};

	_this.getRange = function() {
		var selection = _this.get();
		return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
	};

	_this.delete = function() {
		var range = _this.getRange();
		if (range) {
			range.deleteContents();
			return true;
		}
		return false;
	};

	_this.getContentEditableElement = function() {
		var anchorElement = _this.getAnchorElement(),
			contentEditableElement = null;
		if (anchorElement) {
			if (anchorElement.contentEditable === true) {
				contentEditableElement = anchorElement;
			} else {
				var t = anchorElement.closest('[contenteditable]');
				if (t) {
					contentEditableElement = t;
				}
			}
		}
		return contentEditableElement;
	};

	_this.getAnchorElement = function() {
		var selection = _this.get();
		return (selection && selection.anchorNode ? (Functions.isElement(selection.anchorNode) ? selection.anchorNode : selection.anchorNode.parentElement) : null);
	};
});