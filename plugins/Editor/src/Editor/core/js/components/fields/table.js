var TableField = function(_super, api) {
	var _this = this,
		data,
		table;

	/* settings */
	_this.settings = function() {
		return {
			inlineTools: true,
			enableLineBreaks: true
		};
	};

	var validateHasHeaderRow = function(hasHeaderRow) {
		return api.Functions.isBoolean(hasHeaderRow) ? hasHeaderRow : false;
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data || [['', '']];
		// set properties
		_super.setSetting('hasHeaderRow', validateHasHeaderRow(_super.getSetting('hasHeaderRow')));
	};

	/* render ui */
	_this.render = function(field) {
		field.setAttributes({
			'spellcheck': 'true'
		});
		table = new Table(field, data);
		table.initialize();
	};

	/* render toolbar ui */
	_this.renderToolbar = function(_Field) {
		return {
			'has-header-row': function(_super, api) {
				var _this = this,
					toolbar;

				/* settings */
				_this.settings = function() {
					return {
						name: 'Kopfzeile',
						icon: '<span style="font-size: 60%; font-weight: bold; line-height: 1.2;"><span style="display: block;">HEA</span><span style="display: block;">DER</span></span>'
					};
				};

				/* initialize */
				_this.initialize = function(_toolbar) {
					toolbar = _toolbar;
				};

				/* render ui */
				_this.render = function() {
					if (getState()) {
						table.getElement().classList.add('table-with-header-row');
					} else {
						table.getElement().classList.remove('table-with-header-row');
					}
					if (_super.getContainer()) {
						_super.getContainer().classList.toggle('is-active', getState());
					}
				};

				/* on click event */
				_this.onClick = function(event) {
					toolbar.getField().setSetting('hasHeaderRow', !getState());
					// render ui
					_this.render();
				};

				_this.checkState = function() {
					// render ui
					_this.render();
				};

				var getState = function() {
					return toolbar.getField().getSetting('hasHeaderRow') === true ? true : false;
				};
			}
		};
	};

	_this.getData = function() {
		return table.getData();
	};

	/* css styles */
	_this.css = function() {
		return {
			'.table-wrapper': {
				'position': 'relative',
				'width': '100%'
			},
			'.table-wrapper .table': {
				'width': '100%',
				'background-color': '#fff',
				/*'border': '1px solid #dbdbe2',*/
				'border-collapse': 'collapse'/*,
				'table-layout': 'fixed'*/
			},
			'.table-wrapper .table .table-row .table-cell': {
				'border': '1px solid #e5e5e5',
				'padding': '10px',
				'vertical-align': 'top'
			},
			'.table-wrapper .table .table-row:first-child .table-cell': {
				'border-top': 'none'
			},
			'.table-wrapper .table .table-row:last-child .table-cell': {
				'border-bottom': 'none'
			},
			'.table-wrapper .table .table-row .table-cell:first-child': {
				'border-left': 'none'
			},
			'.table-wrapper .table .table-row .table-cell:last-child': {
				'border-right': 'none'
			},
			'.table-wrapper .table:not(.table-with-header-row) .table-row:nth-child(2n-1)': {
				'background-color': '#f4f4f4'
			},
			'.table-wrapper .table.table-with-header-row .table-row:nth-child(2n)': {
				'background-color': '#f4f4f4'
			},
			'.table-wrapper .table.table-with-header-row .table-row:first-child .table-cell': {
				'background-color': '#7aa814',
				'color': '#fff',
				'border-color': '#7aa814',
				'font-weight': 'bold'
			},
			'.table-wrapper .table-toolbar': {
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'opacity': '0',
				'transition': 'opacity .25s linear'
			},
			'.table-wrapper .table-toolbar:hover': {
				'opacity': '1'
			},
			'.table-wrapper .table-toolbar.hidden': {
				'display': 'none'
			},
			'.table-wrapper .table-toolbar .table-toolbar-line': {
				'position': 'absolute',
				'background-color': '#222'
			},
			'.table-wrapper .table-toolbar.table-toolbar-y': {
				'transform': 'translateY(-5px)',
				'width': '100%',
				'height': '11px'
			},
			'.table-wrapper .table-toolbar.table-toolbar-y .table-toolbar-line': {
				'top': '5px',
				'width': '100%',
				'height': '1px'
			},
			'.table-wrapper .table-toolbar.table-toolbar-x': {
				'transform': 'translateX(-5px)',
				'width': '11px',
				'height': '100%'
			},
			'.table-wrapper .table-toolbar.table-toolbar-x .table-toolbar-line': {
				'left': '5px',
				'width': '1px',
				'height': '100%'
			},
			'.table-wrapper .table-toolbar.table-toolbar .table-toolbar-icon': {
				'position': 'absolute',
				'display': 'inline-block',
				'font-size': '20px',
				'color': '#222',
				'background-color': '#fff',
				'line-height': '0',
				'width': '17px',
				'height': '20px',
				'opacity': '.6',
				'transition': 'opacity .25s linear'
			},
			'.table-wrapper .table-toolbar.table-toolbar .table-toolbar-icon:hover': {
				'opacity': '1',
				'cursor': 'pointer'
			},
			'.table-wrapper .table-toolbar.table-toolbar-y .table-toolbar-icon': {
				'top': '-4px',
				'left': '50%',
				'transform': 'translateX(-50%)'
			},
			'.table-wrapper .table-toolbar.table-toolbar-x .table-toolbar-icon': {
				'top': '50%',
				'left': '-3px',
				'transform': 'translateY(-50%)'
			}
		};
	};

	var TableToolbar = function(_type) {
		var _this = this,
			type = ['x', 'y'].indexOf(_type) !== -1 ? _type : null,
			callback = function(){},
			element,
			elementLine,
			elementIcon,
			index;

		_this.initialize = function() {
			if (!type) {
				throw new Error('TableToolbar::initialize(): invalid type «' + _type + '» (allowed «x» or «y»).');
			}
			createElements();
			// bind events
			bindEvents();
		};

		var createElements = function() {
			element = api.Classes.UI.createElement('div', {className: 'table-toolbar table-toolbar-' + type + ' hidden'});
			elementLine = api.Classes.UI.createElement('div', {className: 'table-toolbar-line'});
			elementIcon = api.Classes.UI.createElement('div', {className: 'table-toolbar-icon', innerHTML: '<i class="fa fa-plus-circle"></i>'});
			element.appendChild(elementLine);
			element.appendChild(elementIcon);
		};

		/* bind events */
		var bindEvents = function() {
			var mouseleaveListener = function(event) {
				_this.hide();
			};
			// editor disabled
			api.Classes.Core.Config.webcomponent.addEventListener('disabled', function(event) {
				// if editor is disabled
				if (event.detail) {
					// mouseleave
					mouseleaveListener();
				}
			});
			// mouse leave
			element.addEventListener('mouseleave', mouseleaveListener);
			// icon click
			elementIcon.addEventListener('click', function(event) {
				var tempIndex = index;
				_this.hide();
				callback(tempIndex);
			});
		};

		_this.setRow = function(_row) {
			row = _row;
		};

		_this.hide = function() {
			index = undefined;
			element.classList.add('hidden');
			if (type === 'x') {
				element.style.left = '';
			} else if (type === 'y') {
				element.style.top = '';
			}
		};

		_this.show = function(_index, _position) {
			index = _index;
			var position = _position || 0;
			element.classList.remove('hidden');
			if (type === 'x') {
				element.style.left = position + 'px';
			} else if (type === 'y') {
				element.style.top = position + 'px';
			}
		};

		_this.onClick = function(_callback) {
			callback = _callback;
		};

		_this.getElement = function() {
			return element;
		};
	};

	var TableCell = function() {
		var _this = this,
			Row,
			element,
			input;

		_this.initialize = function(_Row) {
			Row = _Row;
			// render
			render();
			// bind events
			bindEvents();
		};

		var render = function() {
			element = api.Classes.UI.createElement('td', {className: 'table-cell'});
			input = api.Classes.UI.createEditableElement();
			element.appendChild(input);

			Row.getElement().insertBefore(element, Row.getElement().children[_this.getPosition()]);
		};

		/* bind events */
		var bindEvents = function() {
			// mouse move
			element.addEventListener('mousemove', function(event) {
				// if editor is disabled, abort
				if (api.Classes.Core.isDisabled()) {
					return;
				}
				var padding = 5,
					rect = element.getBoundingClientRect(),
					rectTable = Row.getTable().getElement().getBoundingClientRect(),
					mousePosition = {x: event.clientX - rect.left, y: event.clientY - rect.top};

				// top
				if (mousePosition.y <= padding) {
					Row.getTable().getToolbar().Y.show(Row.getPosition(), rect.top - rectTable.top);
				}
				// right
				if (mousePosition.x >= rect.width - padding) {
					Row.getTable().getToolbar().X.show(_this.getPosition() + 1, rect.left + rect.width - rectTable.left);
				}
				// bottom
				if (mousePosition.y >= rect.height - padding) {
					Row.getTable().getToolbar().Y.show(Row.getPosition() + 1, rect.top + rect.height - rectTable.top);
				}
				// left
				if (mousePosition.x <= padding) {
					Row.getTable().getToolbar().X.show(_this.getPosition(), rect.left - rectTable.left);
				}
			});

			input.addEventListener('input', function(event) {
				_super.save();
			});
		};

		_this.setData = function(data) {
			input.innerHTML = api.Functions.isString(data) ? data : '';
		};

		_this.getData = function() {
			return input.innerHTML;
		};

		_this.setRow = function(_Row) {
			Row = _Row;
		};

		_this.getRow = function() {
			return Row;
		};

		_this.getPosition = function() {
			return Row.getCells().indexOf(_this);
		};

		_this.getElement = function() {
			return element;
		};
	};

	var TableRow = function() {
		var _this = this,
			Table,
			element,
			Cells = [];

		_this.initialize = function(_Table) {
			Table = _Table;
			// render
			render();
		};

		var render = function() {
			element = api.Classes.UI.createElement('tr', {className: 'table-row'});
			Table.getElement().insertBefore(element, Table.getElement().children[_this.getPosition()]);
		};

		_this.insertCell = function(Cell, position) {
			if (Cells.indexOf(Cell) === -1) {
				position = checkPositionParam(position);
				Cells.splice(position, 0, Cell);
				return Cell;
			}
			return false;
		};

		var checkPositionParam = function(position) {
			var length = _this.getCells().length;
			if (!Number.isInteger(position) || position > length) {
				position = length;
			} else if (position < 0) {
				position = 0;
			}
			return position;
		};

		_this.setTable = function(_Table) {
			Table = _Table;
		};

		_this.getTable = function() {
			return Table;
		};

		_this.getPosition = function() {
			return Table.getRows().indexOf(_this);
		};

		_this.getCells = function() {
			return Cells;
		};

		_this.getElement = function() {
			return element;
		};
	};

	var Table = function(container, data) {
		var _this = this;

		var wrapperElement,
			element,
			Toolbars = {},
			Rows = [];

		_this.initialize = function() {
			// create toolbars
			Toolbars = {
				X: new TableToolbar('x'),
				Y: new TableToolbar('y')
			};
			Toolbars.X.initialize();
			Toolbars.Y.initialize();

			// render
			render();

			// build table
			buildTable();

			// bind events
			bindEvents();
		};

		var render = function() {
			// create wrapper
			wrapperElement = api.Classes.UI.createElement('div', {className: 'table-wrapper'});

			// create table
			element = api.Classes.UI.createElement('table', {className: 'table'});
			if (_super.getSetting('hasHeaderRow')) {
				element.classList.add('table-with-header-row');
			}
			wrapperElement.appendChild(element);

			wrapperElement.appendChild(Toolbars.X.getElement());
			wrapperElement.appendChild(Toolbars.Y.getElement());

			// add wrapper to container
			container.appendChild(wrapperElement);
		};

		/* bind events */
		var bindEvents = function() {
			Toolbars.X.onClick(function(index) {
				Rows.forEach(function(Row, i) {
					var cell = new TableCell();
					Row.insertCell(cell, index);
					cell.initialize(Row);
					if (i === 0) {
						cell.getElement().focus();
					}
				});
				_super.save();
			});

			Toolbars.Y.onClick(function(index) {
				var row = new TableRow();
				insertRow(row, index);
				row.initialize(_this);
				for (var i = 0; i < _this.getCellLength(); i++) {
					var cell = new TableCell();
					row.insertCell(cell);
					cell.initialize(row);
					if (i === 0) {
						cell.getElement().focus();
					}
				}
				_super.save();
			});
		};

		var buildTable = function() {
			// build rows and cells
			(function() {
				if (api.Functions.isArray(data)) {
					data.forEach(function(rowData, index) {
						var row = new TableRow();
						insertRow(row);
						row.initialize(_this);
						if (api.Functions.isArray(rowData)) {
							rowData.forEach(function(cellData) {
								var cell = new TableCell();
								row.insertCell(cell);
								cell.initialize(row);
								cell.setData(cellData);
							});
						}
					});
				}
			})();
		};

		var insertRow = function(Row, position) {
			if (Rows.indexOf(Row) === -1) {
				position = checkPositionParam(position);
				Rows.splice(position, 0, Row);
				return Row;
			}
			return false;
		};

		var checkPositionParam = function(position) {
			var length = _this.getRows().length;
			if (!Number.isInteger(position) || position > length) {
				position = length;
			} else if (position < 0) {
				position = 0;
			}
			return position;
		};

		_this.getRows = function() {
			return Rows;
		};

		_this.getToolbar = function() {
			return {
				get X() { return Toolbars.X; },
				get Y() { return Toolbars.Y; }
			};
		};

		_this.getCellLength = function() {
			var i = 0;
			Rows.forEach(function(Row) {
				var iCells = Row.getCells().length;
				if (iCells > i) {
					i = iCells;
				}
			});
			return i;
		};

		_this.getData = function() {
			var data = [];
			Rows.forEach(function(Row) {
				var rowData = [];
				Row.getCells().forEach(function(Cell) {
					rowData.push(Cell.getData());
				});
				data.push(rowData);
			});
			return data;
		};

		_this.getElement = function() {
			return element;
		};
	};
};