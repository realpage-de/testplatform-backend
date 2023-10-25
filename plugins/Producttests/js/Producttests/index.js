window.app.Plugins.add('Producttests.Index', function(pub) {
	'use strict';

	var table,
		buttonAdd;

	pub.set('init', function() {
		// init table
		table = pub.get('initTable')();
		// button add
		buttonAdd = document.querySelector('[data-add-producttest]');
		// init button add
		pub.get('initButtonAdd')();
		// init button edit
		pub.get('initButtonEdit')();
	});

	pub.set('initTable', function() {
		return $('table[data-table-producttests]').DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: window.app.settings.basePath + 'api/v1/producttests.json',
				data: function(d) {
					var data = {
						mode: 'datatables',
						contain: {
							0: 'Category'
						},
						columnFields: [
							'id',
							'phase_1_date_start',
							'phase_3_date_end',
							'name',
							'category_id',
							'image'
						],
						searchableColumnFields: [
							'id',
							'phase_1_date_start',
							'phase_3_date_end',
							'name',
							'content'
						]
					};
					return Object.assign({}, d, data);
				},
				complete: function(response) {
				}
			},
			columns: [
				{data: 'status'},
				{data: 'phase_1_date_start'},
				{data: 'phase_3_date_end'},
				{data: 'name'},
				{data: 'category_id'},
				{data: 'image'}
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
					targets: 1,
					render: function(data, type, row) {
						return (data ? locale_date_string(data) : '');
					}
				},
				{
					targets: 2,
					render: function(data, type, row) {
						return (data ? locale_date_string(data) : '');
					}
				},
				{
					targets: 4,
					render: function(data, type, row) {
						return (row.category ? row.category.name : '');
					}
				},
				{
					targets: 5,
					orderable: false,
					render: function(data, type, row) {
						var elementObject = document.createElement('div');
						elementObject.classList.add('table-producttests-image-object');
						// image
						(function(data) {
							if (data) {
								var element = document.createElement('img');
								element.classList.add('table-producttests-image-object-image');
								element.src = window.app.settings.basePath + 'files/' + data;
								elementObject.appendChild(element);
							}
						})(row.image);
						// seal
						(function(data) {
							if (data) {
								var element = document.createElement('img');
								element.classList.add('table-producttests-image-object-seal-image');
								element.src = window.app.settings.basePath + 'files/' + data;
								elementObject.appendChild(element);
							}
						})(row.seal_image);
						return elementObject.outerHTML;
					}
				},
				{
					targets: 6,
					render: function(data, type, row) {
						return '<div class="btn-group">' +
						'<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>' +
						'<div class="dropdown-menu dropdown-menu-right" role="menu">' +
							'<a class="dropdown-item" href="' + window.app.settings.basePath + 'producttests/' + row.id + '" data-edit-producttest>Bearbeiten</a>' +
							'<a class="dropdown-item" href="' + window.app.settings.basePath + 'producttests/users/' + row.id + '" data-edit-users>Bewerber ()</a>' +
							'<a class="dropdown-item" href="' + window.app.settings.basePath + 'producttests/users/' + row.id + '" data-edit-users>Tester ()</a>' +
							'<div class="dropdown-divider"></div>' +
							'<a class="dropdown-item text-danger" href="' + window.app.settings.basePath + 'api/v1/producttests/' + row.id + '.json" data-delete data-success="Producttests.Index{deleteSuccess}" data-failure="Producttests.Index{deleteFailure}">Löschen</a>' +
						'</div>' +
						'</div>';
					}
				}
			],
			createdRow: function(row, data, rowIndex, cols) {
				// status
				cols[0].setAttribute('data-status', '');
				// datestart
				cols[1].setAttribute('data-sort', (data.date_start ? data.date_start : '0'));
				// date end
				cols[2].setAttribute('data-sort', (data.date_end ? data.date_end : '0'));
				// image
				cols[5].classList.add('table-producttests-image');
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
				size: 'full',
				fullHeight: true
			});
			// set title
			modal.setTitle('Produkttest anlegen');
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

	pub.set('initButtonEdit', function() {
		$(document).on('click', '[data-edit-producttest]', function(event) {
			event.preventDefault();
			// create modal
			var modal = new window.app.Modal({
				size: 'full',
				fullHeight: true
			});
			// set title
			modal.setTitle('Produkttest bearbeiten');
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