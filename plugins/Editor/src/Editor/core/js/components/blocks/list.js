var ListBlock = function(_super, api) {
	var _this = this,
		data;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Liste',
			icon: '<i class="fa fa-list"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
		// create fields
		_super.createField({type: 'list', name: 'list', autofocus: true});
	};

	/* render ui */
	_this.render = function() {
		var fieldList = _super.getFieldList(),
			container = fieldList.getBlock().getContainer(),
			field = fieldList.getByKey('list');
		container.appendChild(field.getContainer());

		/* keydown */
		field.getContainer().addEventListener('keydown', function(event) {
			var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field.getElement(), includeContent: true}),
				caretIsAtEnd = api.Utilities.Caret.isAtEnd({element: field.getElement(), includeContent: true}),
				listElements = field.getInstance().getElement().childNodes;

			// backspace pressed
			if (event.key === 'Backspace' && caretIsAtStart && listElements.length === 1 && !field.getElement().textContent.trim()) {
				event.stopPropagation();
				event.preventDefault();
				eventBackspace(field);
			}
			// delete pressed and cursor is at end
			if (event.key === 'Delete' && caretIsAtEnd && listElements.length === 1 && !field.getElement().textContent.trim()) {
				event.stopPropagation();
				event.preventDefault();
				eventDelete(field);
			}
		});
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