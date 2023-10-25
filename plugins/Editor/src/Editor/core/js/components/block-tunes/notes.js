var NotesBlockTune = function(_super, api) {
	var _this = this,
		propName = 'notes',
		toolbar;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Notizen',
			icon: '<i class="fas fa-comment"></i>',
			iconNotes: '<i class="fas fa-comment-dots"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;
		// instance on opened
		toolbar.getElement().addEventListener('toolbar-opened', function(event) {
			var hasNotes = toolbar.getBlock().getProperty(propName);
			// update toolbar button icon
			_super.getContainer().innerHTML = _this.settings()['icon' + (hasNotes ? 'Notes' : '')];
			// update button
			_super.getContainer().classList[hasNotes ? 'add' : 'remove']('has-notes');
		});
	};

	/* on click event */
	_this.onClick = function(event) {
		// hide toolbar
		toolbar.hide();
		// create modal
		createModal();
	};

	/* create modal */
	var createModal = function() {
		// create modal
		var modal = api.Classes.UI.createModal(),
			inputElement;
		// set title
		modal.setTitle(_super.getName());
		// clear body
		modal.clearBody();
		// create body
		modal.appendBody((function() {
			inputElement = UI.createElement('textarea', {className: 'modal-notes-input'});
			inputElement.setAttribute('placeholder', 'Hier können Notizen eingetragen werden.');
			inputElement.value = toolbar.getBlock().getProperty(propName, '');
			inputElement.addEventListener('keyup', function(event) {
				toolbar.getBlock().setProperty(propName, this.value);
			});
			return inputElement;
		})());
		// modal opened event
		modal.addEventListener('opened', function() {
			// set focus to input field
			inputElement.focus();
		});
		// modal closed event
		modal.addEventListener('closed', function() {
			// show toolbar
			toolbar.show();
		});
		// open modal
		modal.open({
			closeOnEscape: true
		});
	};

	/* css styles */
	_this.css = function() {
		return {
			'!.modal-notes-input': {
				'margin': '-15px -36px -17px -15px',
				'padding': '15px',
				'width': 'calc(100% + 51px)',
				'height': '250px',
				'border': '0'
			},
			'-.has-notes': {
				'color': '#0c8fb9'
			}
		};
	};
};