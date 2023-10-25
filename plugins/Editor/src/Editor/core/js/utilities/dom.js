Utilities.Dom = Functions.createClass(function() {
	var _this = this;

	_this.findParentTag = function(tagName, className, searchDepth) {
		searchDepth = Number.isInteger(searchDepth) ? searchDepth : 10;
		var selection = Utilities.Selection.get(),
			parentTag = null;
		/* if selection is missing or no anchorNode or focusNode were found then return null */
		if (!selection || !selection.anchorNode || !selection.focusNode) {
			return null;
		}
		/* define Nodes for start and end of selection */
		var boundNodes = [
			selection.anchorNode, /* the Node in which the selection begins */
			selection.focusNode /* the Node in which the selection ends */
		];
		/* for each selection parent Nodes we try to find target tag [with target class name]. It would be saved in parentTag variable */
		boundNodes.forEach(function(parent) {
			/* reset tags limit */
			var searchDepthIterable = searchDepth;
			while (searchDepthIterable > 0 && parent.parentNode) {
				/* check tag's name */
				if (parent.tagName === tagName.toUpperCase()) {
					/* save the result */
					parentTag = parent;
					/* optional additional check for class-name mismatching */
					if (className && parent.classList && !parent.classList.contains(className)) {
						parentTag = null;
					}
					/* if we have found required tag with class then go out from the cycle */
					if (parentTag) {
						break;
					}
				}
				/* target tag was not found. Go up to the parent and check it */
				parent = parent.parentNode;
				searchDepthIterable--;
			}
		});
		return parentTag;
	};

	_this.expandToTag = function(element) {
		var selection = Utilities.Selection.get(),
			range = document.createRange();
		selection.removeAllRanges();
		range.selectNodeContents(element);
		selection.addRange(range);
	};
});