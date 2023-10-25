var AnchorBlock = function(_super, api) {
	var _this = this,
		data;

	/* settings */
	_this.settings = function() {
		return {
			name: 'Anker',
			icon: '<i class="fa fa-anchor"></i>'
		};
	};

	/* initialize */
	_this.initialize = function(_data) {
		data = _data;
		// create fields
		(function(field) {
			field.getElement().setAttribute('placeholder', 'Name des Ankers');
		})(_super.createField({type: 'text', name: 'name', autofocus: true, settings: {inlineTools: false, enableLineBreaks: false}}));
	};

	/* render ui */
	_this.render = function() {
		var fieldList = _super.getFieldList(),
			container = fieldList.getBlock().getContainer(),
			containerElement = api.Classes.UI.createElement('div', {className: 'flex-box'}),
			iconElement = api.Classes.UI.createElement('i', {className: 'icon fa fa-anchor'});
		iconElement.setAttribute('aria-hidden', 'true');
		containerElement.appendChild(iconElement);
		containerElement.appendChild(fieldList.getByKey('name').getContainer());
		container.appendChild(containerElement);
	};

	/* css styles */
	_this.css = function() {
		return {
			'.flex-box': {
				'display': 'flex'
			},
			'.flex-box .icon': {
				'margin': '6px 8px 0 8px',
				'font-size': '16px'
			},
			'.flex-box rp-editor-field-wrapper[name="name"]': {
				'flex': '1'
			}
		};
	};
};