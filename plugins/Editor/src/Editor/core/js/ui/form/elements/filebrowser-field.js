return function FileBrowserField(field, name, labelText, placeholderText) {
	var _this = this,
		container,
		hiddenField,
		value;

	/* constructor */
	_this._constructor = function(_value) {
		value = _value;
	};

	/* render ui */
	_this.render = function() {
		container = api.Classes.UI.createElement('div');
		// render label
		if (labelText) {
			container.appendChild(renderLabel());
		}
		// render field
		renderField();

		return container;
	};

	var renderLabel = function() {
		var container = api.Classes.UI.createElement('div'),
			label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
		container.appendChild(label);
		return container;
	};

	var renderField = function() {
		api.Functions.ajax({
			url: '/api/v1/files/templates/widget.html?widget_id={{WIDGET_ID}}&id={{ID}}&settings[types][]=image&settings[preview]=true&settings[prefix]=false',
			onSuccess: function(data, xhr) {
				data = data.replace(new RegExp('{{WIDGET_ID}}', 'g'), name).replace(new RegExp('{{ID}}', 'g'), name);
				var wrapper = api.Classes.UI.createElement('div', {innerHTML: data});
				var children = wrapper.children;
				for (var i = 0; i < children.length; i++) {
					container.appendChild(children[i]);
				}

				hiddenField = container.querySelector('#' + name);
				hiddenField.value = (api.Functions.isObject(value) ? JSON.stringify(value) : value);

				(function(scriptTag) {
					if (scriptTag) {
						eval(scriptTag[0].replace('<script>', '').replace('</script>', ''));
					}
				})(data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi));
			},
			onFailure: function(status, xhr) {
				response.status = 'FALSE';
				// callback
				if (api.Functions.isFunction(callback)) {
					callback(response);
				}
			}
		});
	};

	/* get name */
	_this.getName = function() {
		return name;
	};

	/* get value */
	_this.getValue = function() {
		return (hiddenField && hiddenField.value && api.Functions.isJSON(hiddenField.value) ? JSON.parse(hiddenField.value) : {});
	};
};