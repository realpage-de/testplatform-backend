var ParagraphBlock = function(_super, api) {
	var _this = this,
		data;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Absatz',
			icon: '<i class="fas fa-paragraph"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
		// create fields
		_super.createField({type: 'text', name: 'text', autofocus: true});
	};

	/* render ui */
	_this.render = function() {
		var fieldList = _super.getFieldList(),
			container = fieldList.getBlock().getContainer(),
			field = fieldList.getByKey('text');
		container.appendChild(field.getContainer());

		/* keydown */
		field.getContainer().addEventListener('keydown', function(event) {
			var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field.getElement(), includeContent: true}),
				caretIsAtEnd = api.Utilities.Caret.isAtEnd({element: field.getElement(), includeContent: true});

			// enter pressed
			if (event.key === 'Enter' && event.shiftKey === true) {
				event.stopPropagation();
				event.preventDefault();
				eventShiftAndEnter(field);
			}
			// backspace pressed
			if (event.key === 'Backspace' && caretIsAtStart) {
				event.stopPropagation();
				event.preventDefault();
				eventBackspace(field);
			}
			// delete pressed and cursor is at end
			if (event.key === 'Delete' && caretIsAtEnd) {
				event.stopPropagation();
				event.preventDefault();
				eventDelete(field);
			}
		});
	};

	var eventShiftAndEnter = function(field) {
		// get extracted fragment
		var extractedFragment = api.Utilities.Caret.extractFragmentFromPosition({element: field.getElement()});

		// get extracted html
		var extractedHTML = api.Functions.getDocumentFragmentToHTML(extractedFragment);

		// delete selection
		api.Utilities.Selection.delete();

		// save current field data without extracted text
		field.setData(field.getElement().innerHTML);
		field.save();

		// create block
		(function() {
			var newData = [{'type': 'text', 'name': 'text', 'data': extractedHTML}],
				newBlock = api.Functions.createClass(Block, [], ['paragraph', newData]);
			_super.getList().add(newBlock, _super.getPosition() + 1);
			api.Functions.trigger(newBlock.initialize, false, [_super.getList()]);
			// custom event "block-added"
			api.Classes.Core.dispatchEvent('block-added', {
				detail: {
					data: newBlock.getJson(),
					position: newBlock.getPosition()
				},
				bubbles: true,
				cancelable: true
			});
			// focus block
			setTimeout(function() {
				// call instance method
				api.Functions.trigger(newBlock.focus, true);
				// focus auto focus field
				(function(field) {
					if (field) {
						field.focus();
					}
				})(newBlock.getAutoFocusField());
			}, 1);
		})();
	};

	var eventBackspace = function(field) {
		var prevBlock = _super.getPrevious();
		if (prevBlock) {
			var prevField = prevBlock.getFieldList().getLast();
			if (prevField) {
				prevBlock.focus();
				prevField.focus();
				if (prevBlock.getKey() === 'paragraph') {
					var caretPosition = prevField.getElement().textContent.length;
					prevField.setData(prevField.getData() + field.getData());
					prevField.save();
					api.Utilities.Caret.setPosition({element: prevField.getElement(), position: caretPosition});
				} else {
					var input = prevField.getLastContentEditableElement();
					if (input) {
						api.Utilities.Caret.setPositionToEnd({element: input});
					}
				}
			}
		}
		_super.delete();
	};

	var eventDelete = function(field) {
		var nextBlock = _super.getNext();
		if (nextBlock) {
			var nextField = nextBlock.getFieldList().getFirst();
			if (nextField) {
				nextBlock.focus();
				nextField.focus();
				if (nextBlock.getKey() === 'paragraph') {
					var caretPosition = field.getElement().textContent.length;
					nextField.setData(field.getData() + nextField.getData());
					nextField.save();
					api.Utilities.Caret.setPosition({element: nextField.getElement(), position: caretPosition});
				} else {
					var input = nextField.getFirstContentEditableElement();
					if (input) {
						api.Utilities.Caret.setPositionToStart({element: input});
					}
				}
			}
		}
		_super.delete();
	};
};