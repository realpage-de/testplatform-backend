var DuplicateBlockTune = function(_super, api) {
	var _this = this,
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Duplizieren',
			icon: '<i class="fa fa-clone"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on click event */
	_this.onClick = function(event) {
		// clone block
		var duplicatedBlock = toolbar.getBlock().clone();
		// add block to block list
		toolbar.getBlock().getList().add(duplicatedBlock, toolbar.getBlock().getPosition() + 1);
		// call instance method
		api.Functions.trigger(duplicatedBlock.initialize, false, [toolbar.getBlock().getList()]);
		// custom event "block-added"
		api.Classes.Core.dispatchEvent('block-added', {
			detail: {
				data: duplicatedBlock.getJson(),
				position: duplicatedBlock.getPosition()
			},
			bubbles: true,
			cancelable: true
		});
		// focus block
		setTimeout(function() {
			// call instance method
			api.Functions.trigger(duplicatedBlock.focus, true);
			// focus auto focus field
			(function(field) {
				if (field) {
					field.focus();
				}
			})(duplicatedBlock.getAutoFocusField());
		}, 1);
		// scroll to duplicated block
		//api.Functions.scrollToBlock(duplicatedBlock);
	};
};