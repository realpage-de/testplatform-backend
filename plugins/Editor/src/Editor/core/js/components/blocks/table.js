var TableBlock = function(_super, api) {
	var _this = this,
		data;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Tabelle',
			icon: '<i class="fa fa-table"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
		// create fields
		_super.createField({type: 'table', name: 'data', autofocus: true});
	};

	/* render ui */
	_this.render = function() {
		_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
			_super.getContainer().appendChild(fieldArray.getInstance().getContainer());
		});
	};
};