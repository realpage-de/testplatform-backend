var MoveDownBlockTune = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Nach unten',
			icon: '<i class="fas fa-arrow-down"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		// position before movement
		var topBefore = toolbar.getBlock().getContainer().getBoundingClientRect().top;
		// move down
		toolbar.getBlock().moveDown();
		// position after movement
		var topAfter = toolbar.getBlock().getContainer().getBoundingClientRect().top;
		// scroll
		window.scrollBy(0, topAfter - topBefore);
	};
};