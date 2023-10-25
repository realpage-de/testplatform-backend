window.app.Plugins.add('Users.Index', function(pub) {
	'use strict';

	var table,
		buttonAdd;

	pub.set('init', function() {
		// init table
		table = pub.get('initTable')();
		// button add
		buttonAdd = document.querySelector('[data-add-user]');
		// init button add
		pub.get('initButtonAdd')();
		// init button edit
		pub.get('initButtonEdit')();
	});

	pub.set('initTable', function() {
		return $('table[data-table-users]').DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: window.app.settings.basePath + 'api/v1/users.json',
				data: function(d) {
					var data = {
						mode: 'datatables',
						contain: {
							0: 'Profile',
							Profile: {
								0: 'Gender',
								1: 'Country'
							}
						},
						columnFields: [
							'id',
							'username',
							'profile.gender.title',
							'profile.first_name',
							'profile.last_name',
							'profile.date_of_birth'
						],
						searchableColumnFields: [
							'id',
							'username',
							'profile.gender.title',
							'profile.first_name',
							'profile.last_name',
							'profile.date_of_birth'
						]
					};
					return Object.assign({}, d, data);
				},
				complete: function(response) {
				}
			},
			columns: [
				{data: 'status'},
				{data: 'username'},
				{data: 'profile.gender.title'},
				{data: 'profile.first_name'},
				{data: 'profile.last_name'},
				{data: 'profile.date_of_birth'}
			],
			order: [
				[0, 'asc']
			],
			columnDefs: [
				{
					targets: 0,
					render: function(data, type, row) {
						if (data) {
							var className = 'fa-check-circle text-success';
						} else {
							var className = 'fa-times-circle text-danger';
						}
						return '<i class="fas ' + className + '"></i>';
					}
				},
				{
					targets: 5,
					render: function(data, type, row) {
						return (data ? locale_date_string(data) + ' (' + get_age_by_date_string(data) + ' Jahre)' : '');
					}
				},
				{
					targets: 6,
					render: function(data, type, row) {
						return '<div class="btn-group">' +
						'<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>' +
						'<div class="dropdown-menu dropdown-menu-right" role="menu">' +
							'<a class="dropdown-item" href="' + window.app.settings.basePath + 'users/' + row.id + '" data-edit-user>Bearbeiten</a>' +
							'<div class="dropdown-divider"></div>' +
							'<a class="dropdown-item text-danger" href="' + window.app.settings.basePath + 'api/v1/users/' + row.id + '.json" data-delete data-success="Users.Index{deleteSuccess}" data-failure="Users.Index{deleteFailure}">Löschen</a>' +
						'</div>' +
						'</div>';
					}
				}
			],
			createdRow: function(row, data, rowIndex, cols) {
				// status
				cols[0].setAttribute('data-status', '');
				// actions
				cols[cols.length - 1].setAttribute('data-actions', '');
			}
		});
	});

	pub.set('deleteSuccess', function(response) {
		// redraw table
		table.draw();
	});

	pub.set('deleteFailure', function(response) {
		// alert
		window.app.ModalAlert({
			body: 'Es ist ein Fehler aufgetreten.',
			onClose: function(response) {
				console.log(response);
			}
		});
	});

	pub.set('initButtonAdd', function() {
		buttonAdd.addEventListener('click', function(event) {
			event.preventDefault();
			// create modal
			var modal = new window.app.Modal({
				size: 'large',
				fullHeight: true
			});
			// set title
			modal.setTitle('Benutzer anlegen');
			// add buttons
			modal.addButton({
				label: 'Speichern',
				onClick: function(event) {
					alert('testtt');
					alert(JSON.stringify(window.app));
					/*window.app.DataForm.submit({
						context: modal.getElement('windowBody'),
						callbacks: {
							success: function(data, form) {
								console.log('failure button', data, form);
								// redraw table
								table.draw();
								// close modal
								modal.close();
							},
							failure: function(data, form) {
								console.log('failure button', data, form);
							}
						}
					});*/
				}
			});
			modal.addButton({
				label: 'Abbrechen',
				onClick: function(event) {
					// close modal
					modal.close();
				}
			});

			$.ajax({
				  url: event.target.href,
				  type: 'GET'
			}).done(function(response) {
				// set body
				modal.setBody(response);
				// open modal
				modal.open();

				(function(context) {
					var element = context.querySelector('[data-tabs]');
					if (element) {
						context.parentNode.insertBefore(element, context);
					}
				})(modal.getElement('windowBody'));

				(function(context) {
					var scripts = context.getElementsByTagName('script');
					for (var i = 0; i < scripts.length; ++i) {
						var script = scripts[i];
						eval(script.innerHTML);
					}
				})(modal.getElement('windowBody'));
	
				// init form
				window.app.DataForm.init();
				window.app.DataForm.init({context: modal.getElement('windowBody')});
			});
		});
	});

	pub.set('initButtonEdit', function() {
		$(document).on('click', '[data-edit-user]', function(event) {
			event.preventDefault();
			// create modal
			var modal = new window.app.Modal({
				size: 'large',
				fullHeight: true
			});
			// set title
			modal.setTitle('Benutzer bearbeiten');
			// add buttons
			modal.addButton({
				label: 'Speichern',
				onClick: function(event) {
					window.app.DataForm.submit({
						context: modal.getElement('windowBody'),
						callbacks: {
							success: function(data, form) {
								console.log('failure button', data, form);
								// redraw table
								table.draw();
								// close modal
								modal.close();
							},
							failure: function(data, form) {
								console.log('failure button', data, form);
							}
						}
					});
				}
			});
			modal.addButton({
				label: 'Abbrechen',
				onClick: function(event) {
					// close modal
					modal.close();
				}
			});

			$.ajax({
				url: event.target.href,
				type: 'GET'
			}).done(function(response) {
				// set body
				modal.setBody(response);
				// open modal
				modal.open();

				(function(context) {
					var element = context.querySelector('[data-tabs]');
					if (element) {
						context.parentNode.insertBefore(element, context);
					}
				})(modal.getElement('windowBody'));

				(function(context) {
					var scripts = context.getElementsByTagName('script');
					for (var i = 0; i < scripts.length; ++i) {
						var script = scripts[i];
						eval(script.innerHTML);
					}
				})(modal.getElement('windowBody'));

				// init form
				window.app.DataForm.init();
				window.app.DataForm.init({context: modal.getElement('windowBody')});
			});
		});
	});
});