/* custom elements */
(function() {
	'use strict';

	/* custom editor element */
	window.RPEditorBaseHTMLElement = Functions.createElement(HTMLElement, function(_) {
		_.prototype.setAttributes = function setAttributes(attrs) {
			if (!Functions.isObject(attrs)) {
				return;
			}
			for (var idx in attrs) {
				this.setAttribute(idx, attrs[idx]);
			}
		};
	});

	/* custom editor wrapper element */
	window.RPEditorWrapperHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-wrapper', RPEditorBaseHTMLElement);
	
	/* custom editor toolbar element */
	window.RPEditorToolbarHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar', RPEditorBaseHTMLElement, function(_) {
		_.prototype.setType = function setType(type) {
			if (['editor', 'block', 'field'].indexOf(type) >= 0) {
				// set type attribute
				this.setAttribute('type', type);
				return true;
			}
			return false;
		};

		_.prototype.getType = function getType() {
			return this.hasAttribute('type') ? this.getAttribute('type') : null;
		};
	});

	/* custom editor toolbar section element */
	window.RPEditorToolbarSectionHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar-section', RPEditorBaseHTMLElement);

	/* custom editor toolbar button element */
	window.RPEditorToolbarButtonHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar-button', RPEditorBaseHTMLElement);

	/* custom editor blocks element */
	window.RPEditorBlocksHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-blocks', RPEditorBaseHTMLElement);

	/* custom editor block element */
	window.RPEditorBlockHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-block', RPEditorBaseHTMLElement);

	/* custom editor field wrapper element */
	window.RPEditorFieldWrapperHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-field-wrapper', RPEditorBaseHTMLElement);

	/* custom editor field element */
	window.RPEditorFieldHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-field', RPEditorBaseHTMLElement, function(_) {
		_.prototype.attachedCallback = function attachedCallback() {
			var _this = this;
			/* contenteditable-attribute */
			(function() {
				if (_this.isEditable()) {
					var editor = _this.closest(COMPONENT_TAG_NAME);
					_this.setAttribute('contenteditable', (!editor || editor.disabled ? 'false' : 'true'));
				}
			})();
		};

		_.prototype.isEditable = function isEditable(value) {
			var attrName = 'contenteditable';
			if (arguments.length) {
				if (value === true) {
					this.setAttribute(attrName, 'true');
				} else if (value === false) {
					this.removeAttribute(attrName);
				}
			} else {
				return this.hasAttribute(attrName);
			}
		};
	});

	/* custom editor editable element */
	window.RPEditorEditableHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-editable', RPEditorBaseHTMLElement, function(_) {
		_.prototype.attachedCallback = function attachedCallback() {
			var _this = this;
			/* contenteditable-attribute */
			(function() {
				var editor = _this.closest(COMPONENT_TAG_NAME);
				_this.setAttribute('contenteditable', (!editor || editor.disabled ? 'false' : 'true'));
			})();
		};
	});
})();