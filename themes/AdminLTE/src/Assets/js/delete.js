(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(selector) {
			var _this = this,
				callbacks = [];

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

			var callback = function(callbackString, response) {
				if (typeof callbackString === 'string' && callbackString.trim !== '' && callbacks.length) {
					callbacks.forEach(function(callback) {
						callback(callbackString, response);
					});
				}
			};

			var init = function() {
				$(document).on('click', selector, function(event) {
					event.preventDefault();

					var msg = event.target.getAttribute('data-confirm');

					window.app.ModalConfirm({
						body: (msg ? msg : 'Wirklich löschen?'),
						onOkay: function() {
							$.ajax({
								url: (event.target.href ? event.target.href : event.target.getAttribute('data-url')),
								type: 'DELETE',
								data: {
									_csrfToken: window.app.settings.csrfToken
								}
							}).always(function(response, textStatus, jqXhr) {
								if (String(jqXhr.status).startsWith(2)) {
									callback(event.target.getAttribute('data-success'), response);
								} else {
									callback(event.target.getAttribute('data-failure'), response);
								}
							});
						}
					});
				});
			};
			init();

			return {
				addCallback: _this.addCallback
			};
		};
	}
})(window, 'Delete');