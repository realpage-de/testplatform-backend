Utilities.Caret = Functions.createClass(function() {
	var _this = this;

	var prepareArgs = function(args, array) {
		args = args || {};
		if (!Functions.isObject(args)) {
			throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «args» must be an object.');
		}
		var obj = {};
		if (array.indexOf('element') !== -1) {
			obj.element = ('element' in args && Functions.isElement(args.element) ? args.element : Utilities.Selection.getContentEditableElement());
			if (!Functions.isElement(obj.element)) {
				throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «element» must be an instance of HTMLElement.');
			}
		}
		if (array.indexOf('trim') !== -1) {
			obj.trim = ('trim' in args && Functions.isBoolean(args.trim) ? args.trim : false);
		}
		if (array.indexOf('includeContent') !== -1) {
			obj.includeContent = ('includeContent' in args && Functions.isBoolean(args.includeContent) ? args.includeContent : false);
		}
		if (array.indexOf('type') !== -1) {
			if (!('type' in args) || ['BEFORE', 'AFTER'].indexOf(args.type) === -1) {
				throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «type» must be a string BEFORE|AFTER.');
			}
			obj.type = args.type;
		}
		if (array.indexOf('position') !== -1) {
			if (!('position' in args) || !Functions.isNumber(args.position) || args.position < 1) {
				throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «position» must be a number and at least 1.');
			}
			obj.position = args.position;
		}
		return obj;
	};

	_this.getPosition = function(args) {
		args = prepareArgs(args, ['element', 'trim', 'includeContent']);

		args.type = 'BEFORE';
		var textContent,
			range = getRange(args);
		if (range) {
			textContent = range.toString();
			if (args.trim === true) {
				textContent = textContent.trim();
			}
		}
		return Functions.isString(textContent) ? textContent.length : null;
	};

	_this.setPositionToStart = function(args) {
		args = prepareArgs(args, ['element']);

		var range,
			selection;
		if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
			range = document.createRange(); // create a range (a range is a like the selection but invisible)
			range.selectNodeContents(args.element); // select the entire contents of the element with the range
			range.collapse(true); // collapse the range to the end point. true means collapse to start rather than the end
			selection = Utilities.Selection.get(); // get the selection object (allows you to change selection)
			selection.removeAllRanges(); // remove any selections already made
			selection.addRange(range); // make the range you have just created the visible selection
		} else if (document.selection) { // IE 8 and lower
			range = document.body.createTextRange(); // create a range (a range is a like the selection but invisible)
			range.moveToElementText(args.element); // select the entire contents of the element with the range
			range.collapse(true); // collapse the range to the end point. true means collapse to start rather than the end
			range.select(); // select the range (make it the visible selection
		}
	};

	_this.setPositionToEnd = function(args) {
		args = prepareArgs(args, ['element']);

		var range,
			selection;
		if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
			range = document.createRange(); // create a range (a range is a like the selection but invisible)
			range.selectNodeContents(args.element); // select the entire contents of the element with the range
			range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
			selection = Utilities.Selection.get(); // get the selection object (allows you to change selection)
			selection.removeAllRanges(); // remove any selections already made
			selection.addRange(range); // make the range you have just created the visible selection
		} else if (document.selection) { // IE 8 and lower
			range = document.body.createTextRange(); // create a range (a range is a like the selection but invisible)
			range.moveToElementText(args.element); // select the entire contents of the element with the range
			range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
			range.select(); // select the range (make it the visible selection
		}
	};

	_this.setPosition = function(args) {
		args = prepareArgs(args, ['element', 'position']);

		if (args.position === 0) {
			return;
		}

		var selection = Utilities.Selection.get();
		if (!selection) {
			return;
		}

		var createRange = function(node, position, range) {
			if (!range) {
				range = document.createRange()
				range.selectNode(node);
				range.setStart(node, 0);
			}
			if (position.count === 0) {
				range.setEnd(node, position.count);
			} else if (node && position.count > 0) {
				if (node.nodeType === Node.TEXT_NODE) {
					if (node.textContent.length < position.count) {
						position.count -= node.textContent.length;
					} else {
						range.setEnd(node, position.count);
						position.count = 0;
					}
				} else {
					for (var lp = 0; lp < node.childNodes.length; lp++) {
						range = createRange(node.childNodes[lp], position, range);

						if (position.count === 0) {
							break;
						}
					}
				}
			} 
			return range;
		};

		var range = createRange(args.element, {count: args.position});
		if (range) {
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	_this.isAtStart = function(args) {
		args = prepareArgs(args, ['element', 'trim']);

		return _this.getPosition(args) === 0;
	};

	_this.isAtEnd = function(args) {
		args = prepareArgs(args, ['element', 'trim', 'includeContent']);

		var textContent = args.element.textContent;
		if (args.trim === true) {
			textContent = textContent.trim();
		}
		return _this.getPosition(args) === textContent.length;
	};

	var getRange = function(args) {
		args = prepareArgs(args, ['element', 'type', 'includeContent']);

		var range = Utilities.Selection.getRange();
		if (range) {
			var _ = [],
				clonedRange = range.cloneRange();
			clonedRange.selectNodeContents(args.element);
			if (args.type === 'BEFORE') {
				_.push('setEnd');
				_.push(args.includeContent ? range.endContainer : range.startContainer);
				_.push(args.includeContent ? 'endOffset' : 'startOffset');
			}
			else if (args.type === 'AFTER') {
				_.push('setStart');
				_.push(args.includeContent ? range.startContainer : range.endContainer);
				_.push(args.includeContent ? 'startOffset' : 'endOffset');
			}
			clonedRange[_[0]](_[1], range[_[2]]);
			return clonedRange;
		}
		return null;
	};

	_this.getRangeToPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		args.type = 'BEFORE';
		return getRange(args);
	};

	_this.getRangeFromPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		args.type = 'AFTER';
		return getRange(args);
	};

	_this.getFragmentToPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		var range = _this.getRangeToPosition(args);
		return range ? range.cloneContents() : null;
	};

	_this.getFragmentFromPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		var range = _this.getRangeFromPosition(args);
		return range ? range.cloneContents() : null;
	};

	_this.extractFragmentToPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		var range = _this.getRangeToPosition(args);
		return range ? range.extractContents() : null;
	};

	_this.extractFragmentFromPosition = function(args) {
		args = prepareArgs(args, ['element', 'includeContent']);

		var range = _this.getRangeFromPosition(args);
		return range ? range.extractContents() : null;
	};

	/*_this.extractTextFromPosition = function(element) {
		if (!Functions.isInstanceOf(element, HTMLElement)) {
			throw new Error('RPEditor: Utilities.Caret.isAtStart(): «element» must be an instance of HTMLElement.');
		}

		var extractedFragment = Utilities.Caret.extractFragmentFromPosition(element);
		if (extractedFragment) {
			var wrapper = UI.createElement('div');
			wrapper.appendChild(extractedFragment);
			return wrapper.innerHTML;
		}
	};*/

	/*_this.splitTextsOnPosition = function(element) {
		if (!Functions.isInstanceOf(element, HTMLElement)) {
			throw new Error('RPEditor: Utilities.Caret.isAtStart(): «element» must be an instance of HTMLElement.');
		}

		var splittedFragments = Utilities.Caret.splitFragmentsOnPosition(element);
		if (splittedFragments) {
			var wrapper = UI.createElement('div');

			wrapper.appendChild(splittedFragments[0]);
			var before = wrapper.innerHTML;

			wrapper.innerHTML = '';
			wrapper.appendChild(splittedFragments[1]);
			var after = wrapper.innerHTML;

			return [before, after];
		}
	};*/
});