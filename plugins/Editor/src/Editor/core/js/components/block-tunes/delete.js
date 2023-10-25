var DeleteBlockTune = function(_super, api) {
	var _this = this,
		toolbar,
		confirmationStatus = false;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Löschen',
			icon: '<i class="fa fa-times"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
	};

	/* on close event */
	_this.onClose = function(event) {
		confirmationStatus = false;
		_super.getContainer().classList.remove('button-confirm');
	};

	/* on click event */
	_this.onClick = function(event) {
		if (!confirmationStatus) {
			confirmationStatus = true;
			_super.getContainer().classList.add('button-confirm');
		} else {
			// delete block
			toolbar.getBlock().delete();
		}
	};

	/* css styles */
	_this.css = function() {
		return {
			'!@keyframes block-tune-delete-confirm': {
				'0%': {
					'transform': 'rotate(0deg)'
				},
				'25%': {
					'transform': 'rotate(2deg)'
				},
				'50%': {
					'transform': 'rotate(0deg)'
				},
				'75%': {
					'transform': 'rotate(-2deg)'
				},
				'100%': {
					'transform': 'rotate(0deg)'
				}
			},
			'': {
				'transition': 'background-color .1s ease-in-out, color .1s ease-in-out'
			},
			'-.button-confirm': {
				'background-color': '#e24a4a',
				'color': '#fff',
				'animation': 'block-tune-delete-confirm ease',
				'animation-iteration-count': 'infinite',
				'animation-duration': '.5s',
				'animation-fill-mode': 'both'
			}
		};
	};
};