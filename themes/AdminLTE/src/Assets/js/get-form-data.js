(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = (function() {
			var mapDataToObject = function(data) {
				let obj = Object.create(null);
				data.forEach(function(value, key, map) {
					obj[key] = value;
				});
				return obj;
			};

			return function(form) {
				let data = new Map();
				form.querySelectorAll('input, textarea, select').forEach(function(_field) {
					switch(_field.nodeName.toLowerCase()) {
						case 'input':
						case 'textarea':
							if (['checkbox', 'radio'].indexOf(_field.type.toLowerCase()) !== -1) {
								if ($(_field).is(':checked')) {
									if (_field.name.endsWith('[]') === true) {
										var tmp_arr = data.get(_field.name);
										if (tmp_arr) {
											tmp_arr.push(_field.value);
										} else {
											data.set(_field.name, [_field.value]);
										}
									} else {
										data.set(_field.getAttribute('name'), _field.value);
									}
								}
							} else {
								data.set(_field.getAttribute('name'), _field.value);
							}
							break;
						case 'select':
							var $tmp_options = $(_field).find(':selected'),
								tmp_val = '';
							// no multiple
							if ($tmp_options.length === 1) {
								tmp_val = $tmp_options.get(0).value;
							}
							// multiple
							else if ($tmp_options.length > 1) {
								tmp_val = [];
								$tmp_options.each(function() {
									tmp_val.push(this.value);
								});
							}
							data.set(_field.getAttribute('name'), tmp_val);
							break;
						default:
							break;
					}
				});
				return mapDataToObject(data);
			};
		})();
	}
})(window, 'GetFormData');