(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(selector) {
			var _this = this,
				callbacks = [];

			// forms store
			_this.forms = function() {
				var _forms = this.forms,
					_store = [];

				_forms.add = function(form) {
					if (_store.indexOf(form) === -1) {
						_store.push(form);
						_forms._disableSubmitByEnter(form);
						_forms._enableButtonSubmit(form);
					}
				};

				_forms.remove = function(form) {
					let index = _store.indexOf(form);
					if (index !== -1) {
						_store.splice(index, 1);
					}
				};

				_forms.getAll = function() {
					return _store;
				};

				_forms._disableSubmitByEnter = function(form) {
					form.querySelectorAll('input').forEach(function(field) {
						field.addEventListener('keydown', function(event) {
							if (event.key === 'Enter') {
								event.preventDefault();
							}
						});
					});
				};

				_forms._enableButtonSubmit = function(form) {
					form.querySelectorAll('button[type="submit"]').forEach(function(button) {
						button.addEventListener('click', function(event) {
							event.preventDefault();
							_this.submit({context: $(form).parent().get(0)});
						});
					});
				}
			};
			_this.forms();

			_this.addCallback = function(callback) {
				if (!(callback && {}.toString.call(callback) === '[object Function]')) {
					throw new Error(funcName + '.addCallback(): First argument must be a function.');
				}
				if (callbacks.indexOf(callback) === -1) {
					callbacks.push(callback);
					return callback;
				}
				return false;
			};

			_this.removeCallback = function(callback) {
				if (!(callback && {}.toString.call(callback) === '[object Function]')) {
					throw new Error(funcName + '.addCallback(): First argument must be a function.');
				}
				if (callbacks.indexOf(callback) !== -1) {
					callbacks = callbacks.filter(function(_callback) {
						return _callback !== callback;
					});
					return true;
				}
				return false;
			};

			_this.init = function(opts) {
				opts = opts || {};
				let context = _this._getContext(opts);
				// init forms
				$(selector, context).each(function() {
					_this.forms.add(this);
				});
				_this.forms.getAll().forEach(function(_form) {
					if (!$(_form).closest(document.documentElement).length) {
						_this.forms.remove(_form);
					}
				});
			};

			_this.submit = function(opts) {
				opts = opts || {};

				var _submit = this.submit;

				var clearErrorsByForm = function(form) {
					var $errors = $(form).find('.is-invalid');
					$errors.parent().find('.error').remove();
					$errors.removeClass('is-invalid');
				};

				var buildErrorsByForm = function(form, errors) {
					var recursive = function(errors, prefix) {
						prefix = prefix || '';
						for (var key in errors) {
							var val = errors[key];
							if (val !== null && val && (Array.isArray(val) || (typeof val === 'object' && val.constructor === Object))) {
								recursive(errors[key], prefix + (prefix ? '[' + key + ']' : key));
							} else {
								var $input = $(form).find('[name="' + prefix + '"]');
								$input.addClass('is-invalid');
								$input.parent().append('<span class="error invalid-feedback">' + errors[key] + '</span>');
							}
						}
					};
					recursive(errors);
				};

				var callback = function(form, callbackString, data) {
					if (typeof callbackString === 'string' && callbackString.trim !== '' && callbacks.length) {
						callbacks.forEach(function(callback) {
							callback(callbackString, form, data);
						});
					}
				};

				_submit.init = function() {
					var _init = _submit.init;

					let context = _this._getContext(opts);

					// collect forms
					let submit_forms = [];
					_this.forms.getAll().forEach(function(_form) {
						let is_not_in = (!opts.notInSelector || ($(opts.notInSelector).length && !$(_form).closest($(opts.notInSelector)).length));
						if ($.contains(context, _form) && is_not_in) {
							submit_forms.push(_form);
						}
					});

					_init.callbackFormSubmits = function(opts) {
						var _that = this;

						this.submitted_forms = {
							success: [],
							fail: []
						};

						opts.callbacks = opts.callbacks || {};
						opts.callbacks.success = opts.callbacks.success || function(){};
						opts.callbacks.failure = opts.callbacks.failure || function(){};

						this.check = function(form, status, data) {
							for (let i = 0; i < submit_forms.length; i++) {
								if (submit_forms[i] === form) {
									_that.submitted_forms[(status ? 'success' : 'fail')].push(form);
								}
							}

							if (submit_forms.length === (_that.submitted_forms.success.length + _that.submitted_forms.fail.length)) {
								if (_that.submitted_forms.fail.length) {
									opts.callbacks.failure(form, data);
								} else {
									opts.callbacks.success(form, data);
								}
							}
						};
					}

					var _callbackFormSubmits = new _init.callbackFormSubmits(opts);

					// submit collected forms
					submit_forms.forEach(function(_form) {
						callback(_form, _form.getAttribute('data-before'), null);

						var data = window.app.FormData(_form);

						$.ajax({
							method: (data && '_method' in data) ? data._method : _form.method,
							url: _form.action,
							data: data,
							xhrFields: {
								withCredentials: true
							}
						})
						.always(function(data, status_text, xhr) {
							var statusCode = xhr.status || xhr,
								status = false;
							// clear error fields
							clearErrorsByForm(_form);
							callback(_form, _form.getAttribute('data-after'), data);
							// success
							if (String(statusCode).startsWith('2')) {
								callback(_form, _form.getAttribute('data-success'), data);
								status = true;
							}
							// validation failure
							else if (statusCode === 400 || statusCode === 'Bad Request') {
								if (data.responseJSON && data.responseJSON.errors) {
									buildErrorsByForm(_form, data.responseJSON.errors);
									callback(_form, _form.getAttribute('data-validation-failure'), data.responseJSON);
								}
							}
							// server failure
							else {
								callback(_form, _form.getAttribute('data-failure'), data);
							}

							_callbackFormSubmits.check(_form, status, data);
						});
					});
				};
				_submit.init = _submit.init();
			};

			_this._getContext = function(opts) {
				return (opts.context ? (opts.context instanceof jQuery ? opts.context.get(0) : opts.context) : document.documentElement);
			}

			return {
				addCallback: _this.addCallback,
				init: _this.init,
				submit: _this.submit
			};
		};
	}
})(window, 'Form');