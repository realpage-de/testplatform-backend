var LocaleStorageEditorTool = function(_super, api) {
	var _this = this,
		toolbar,
		storage,
		timeout,
		delay = 1000;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Gespeicherte Versionen',
			icon: '<i class="fa fa-history"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_toolbar) {
		toolbar = _toolbar;

		storage = api.Classes.LocalStorage;

		// bind events
		bindEvents();
	};

	/* bind events */
	var bindEvents = function() {
		var _editor = api.Classes.Core.Config.webcomponent;
		_editor.addEventListener('change', function(event) {
			handleDelay();
		});
		_editor.addEventListener('block-added', function(event) {
			save();
		});
		_editor.addEventListener('block-moved', function(event) {
			save();
		});
		_editor.addEventListener('block-deleted', function(event) {
			save();
		});
	};

	var handleDelay = function() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(save, delay);
	};

	var save = function() {
		var found = false,
		data = api.Classes.Editor.getData(),
		dataString = JSON.stringify(data);

		storage.getAll().forEach(function(itemString) {
			var item =JSON.parse(itemString);
			if (JSON.stringify(item.data) === dataString) {
				found = true;
			}
		});

		if (!found) {
			storage.set(generateKey(), JSON.stringify({date: new Date(), data: data}));
		}
	};

	var generateKey = function() {
		if(typeof performance !== 'undefined' && performance.now) {
			return (performance.now() + performance.timing.navigationStart) / 1000;
		} else {
			return (Date.now ? Date.now() : new Date().getTime()) / 1000;
		}
	};

	/* on click event */
	_this.onClick = function(event) {
		createModal();
	};

	/* create modal */
	var createModal = function() {
		// create modal
		var modal = api.Classes.UI.createModal();
		// set title
		modal.setTitle(_super.getName());
		// clear body
		modal.clearBody();
		// create body
		modal.appendBody((function() {
			var data = storage.getAll();
			if (data.length) {
				var listElement = UI.createElement('ul', {className: 'modal-local-storage-list'});
				data.forEach(function(itemString) {
					var item = JSON.parse(itemString);
					var listItemElement = UI.createElement('li', {className: 'modal-local-storage-list-item', innerHTML: formatDate(new Date(item.date))});
					listItemElement.addEventListener('click', function(event) {
						api.Classes.Core.setData(item.data);
						// close
						modal.close();
					});
					listElement.appendChild(listItemElement);
				});
				return listElement;
			} else {
				return UI.createElement('p', {innerHTML: 'Es ist keine gespeicherten Versionen zum Wiederherstellen verfügbar.'});
			}
		})());
		modal.open({
			closeOnEscape: true,
			closeOnClickOutside: true
		});
	};

	var formatDate = function(date) {
		var yyyy = date.getFullYear(),
			mm = (date.getMonth() + 1),
			dd = date.getDate(),
			hh = date.getHours(),
			min = date.getMinutes(),
			ss = date.getSeconds();
		if (mm < 10) {
			mm = '0' + mm;
		}
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (hh < 10) {
			hh = '0' + hh;
		}
		if (min < 10) {
			min = '0' + min;
		}
		if (ss < 10) {
			ss = '0' + ss;
		}
		return dd + '.' + mm + '.' + yyyy + ' '+ hh + ':' + min + ':' + ss;
	};

	/* css styles */
	_this.css = function() {
		return {
			'!.modal-local-storage-list': {
				'display': 'block',
				'margin': '0',
				'padding': '0'
			},
			'!.modal-local-storage-list > .modal-local-storage-list-item': {
				'display': 'block',
				'padding': '10px'
			},
			'!.modal-local-storage-list > .modal-local-storage-list-item:not(:last-child)': {
				'border-bottom': '1px solid #dbdbe2'
			},
			'!.modal-local-storage-list > .modal-local-storage-list-item:hover': {
				'background-color': '#f8f8f8',
				'cursor': 'pointer'
			},
		};
	};
};