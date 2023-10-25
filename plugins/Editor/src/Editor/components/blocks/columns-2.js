RPEditorComponents.Blocks.add('columns-2', function(_super, api) {
	var _this = this,
		data;

	/* settings */
	_this.settings = function() {
		return {
			name: '2 Spalten',
			icon: '<i class="fa fa-th"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
		// create fields
		_super.createField({type: 'container', name: 'column1'});
		_super.createField({type: 'container', name: 'column2'});
	};

	/* render ui */
	_this.render = function() {
		var container = api.Classes.UI.createElement('div', {className: 'flexbox-column-2-container'});
		_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
			var fieldContainer = fieldArray.getInstance().getContainer();
			fieldContainer.classList.add('col');
			container.appendChild(fieldContainer);
		});
		_super.getContainer().appendChild(container);
	};

	/* css styles */
	_this.css = function() {
		return {
			'.flexbox-column-2-container': {
				'display': 'flex'
			},
			'.flexbox-column-2-container > .col': {
				'width': '50%'
			}
		};
	};
});