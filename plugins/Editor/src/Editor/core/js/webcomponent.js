(function() {
	'use strict';

	window.RPEditorHTMLElement = Functions.createElement(COMPONENT_TAG_NAME, RPEditorBaseHTMLElement, function(_) {
		_.prototype.attachedCallback = function attachedCallback() {
			var _this = this;
			// initialize
			initialize.call(_this);
		};

		var initialize = function() {
			var _this = this;
			if (Functions.isInstanceOf(_this._editor, RPEditor)) {
				return;
			}
			// removeAttribute
			(function(funcName) {
				var orgFunc = _this[funcName];
				_this[funcName] = function(attrName) {
					if (_this.hasAttribute(attrName)) {
						var oldValue = _this.getAttribute(attrName);
						orgFunc.call(_this, attrName);
						_this.attributeChangedCallback(attrName, oldValue, false);
					}
				};
			})('removeAttribute');
			// initialize Editor
			_this._editor = new RPEditor({
				webcomponent: _this,
				components: getComponents.call(_this),
				data: getData.call(_this)
			});
		};

		/* get data */
		var getData = function() {
			var _this = this,
				data = [];
			try {
				var textContent = _this.textContent.trim();
				if (textContent) {
					data = JSON.parse(textContent);
				}
			} catch (error) {
				console.error(new Error('RPEditorHTMLElement: «data» is invalid json, editor will be created without data.'));
			}
			_this.innerHTML = '';
			return data;
		};

		/* get components */
		var getComponents = function() {
			var _this = this,
				components = {};
			try {
				if (_this.hasAttribute('components')) {
					var str = _this.getAttribute('components').trim();
					if (str) {
						components = JSON.parse(str);
					}
					_this.removeAttribute('components');
				}
			} catch (error) {
				console.error(new Error('RPEditorHTMLElement: «components»-attribute is invalid json, it will be ignored.'));
			}
			return components;
		};

		/*
		(function(funcName) {
			var orgFunc = _.prototype[funcName];
			_.prototype[funcName] = function(type, listener, useCapture, wantsUntrusted) {
				if (Functions.isString(type)) {
					type.split(' ').forEach(function(type) {
						orgFunc(type, listener, useCapture, wantsUntrusted);
					});
				}
			};
		})('addEventListener');
		*/

		_.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {
			var _this = this;
			switch (attrName) {
				case 'disabled': {
					if (Functions.isInstanceOf(_this._editor, RPEditor) && newValue !== null) {
						_this._editor.disabled(_this.disabled);
					}
					break;
				}
			}
		};

		(function(attrName) {
			Object.defineProperty(_.prototype, attrName, {
				get: function() {
					return this.hasAttribute(attrName);
				},
				set: function(value) {
					if (value === true) {
						this.setAttribute(attrName, '');
					} else if (value === false) {
						this.removeAttribute(attrName);
					}
				}
			});
		})('disabled');

		/* get data */
		_.prototype.getData = function getData() {
			return this._editor.getData();
		};

		/* set data */
		_.prototype.setData = function(data) {
			var _this = this;
			if (Functions.isInstanceOf(_this._editor, RPEditor)) {
				_this._editor.setData(data);
			} else {
				var status = false,
					counter = 0,
					max = 9,
					looper = setInterval(function() {
						counter++;
						if (!status && Functions.isInstanceOf(_this._editor, RPEditor)) {
							status = true;
							_this._editor.setData(data);
						}
						if (status || counter >= max) {
							clearInterval(looper);
						}
					}, 50);
			}
		};
	});
})();