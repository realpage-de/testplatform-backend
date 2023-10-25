var MoveUpBlockTune = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Nach oben',
			icon: '<i class="fas fa-arrow-up"></i>'
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
		toolbar.getBlock().moveUp();
		// position after movement
		var topAfter = toolbar.getBlock().getContainer().getBoundingClientRect().top;
		// scroll
		window.scrollBy(0, topAfter - topBefore);
	};
};