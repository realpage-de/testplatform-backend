var UI = Functions.createClass(function(_editor) {
	var _this = this,
		elements = {};

	/* Styles */
	(function() {
		var _ = (function(_this) {
			//=require ./styles.js
		})();
		Object.defineProperty(_this, 'Styles', { get: function() { return _; } });
	})();

	/* Form */
	(function() {
		var _ = (function(_this) {
			//=require ./form/form.js
		})();
		Object.defineProperty(_this, 'Form', { get: function() { return _; } });
	})();

	/* render ui */
	_this.render = function() {
		// create editor element
		elements.editor = _this.createElement(COMPONENT_TAG_NAME + '-wrapper');
		// add editor element
		Core.Config.webcomponent.appendChild(elements.editor);
	};

	/* create toolbar element */
	_this.createToolbarElement = function(type) {
		var element = _this.createElement(COMPONENT_TAG_NAME + '-toolbar');
		if (element.setType(type)) {
			return element;
		}
		return null;
	};

	/* create toolbar section element */
	_this.createToolbarSectionElement = function() {
		return _this.createElement(COMPONENT_TAG_NAME + '-toolbar-section');
	};

	/* create toolbar element */
	_this.createToolbarButtonElement = function(type) {
		var element = _this.createElement(COMPONENT_TAG_NAME + '-toolbar-button');
		if (element.setType(type)) {
			return element;
		}
		return null;
	};

	/* get an element */
	_this.getElement = function(name) {
		return name in elements ? elements[name] : null;
	};

	_this.createElement = function(tagName, opts) {
		opts = opts || {};
		var element = document.createElement(tagName);
		for (var opt in opts) {
			element[opt] = opts[opt];
		};
		return element;
	};

	_this.createEditableElement = function(opts) {
		return _this.createElement(COMPONENT_TAG_NAME + '-editable', opts);
	};

	/* create tooltip for an element */
	_this.createTooltip = function(element, content) {
		return Libraries.Tooltip(element, {
			content: content,
			delay: [350, 0]
		});
	};

	/* create modal */
	_this.createModal = function() {
		var modal = new Libraries.Modal();
		// add created listener
		modal.addEventListener('created', function() {
			// set z-index
			modal.getElement('overlay').style.zIndex = Libraries.Counter.increase();
		});

		var disabledListener = function() {
			Core.Config.webcomponent.removeEventListener('disabled', disabledListener);
			// close modal
			modal.close();
		};
		Core.Config.webcomponent.addEventListener('disabled', disabledListener);

		return modal;
	};

	/* set editor disabled */
	_this.setEditorDisabled = function(status) {
		if (Functions.isBoolean(status)) {
			elements.editor.classList.toggle('is-disabled', status);
			if (status) {
				elements.editor.querySelectorAll('[contenteditable]').forEach(function(element) {
					element.contentEditable = false;
					element.classList.add('is-disabled');
				});
			} else {
				elements.editor.querySelectorAll('.is-disabled').forEach(function(element) {
					element.classList.remove('is-disabled');
					element.contentEditable = true;
				});
			}
			return true;
		}
		return false;
	};

	/* set editor focus */
	_this.setEditorFocus = function(status) {
		if (Functions.isBoolean(status)) {
			elements.editor.classList.toggle('is-focused', status);
			return true;
		}
		return false;
	};

	_this.getAllContentEditableElements = function() {
		// return Array.from(elements.editor.querySelectorAll('[contenteditable]'));
		return elements.editor.querySelectorAll('[contenteditable]');
	};
}, [], [Editor]);