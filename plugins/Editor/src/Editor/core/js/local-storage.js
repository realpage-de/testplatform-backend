var LocalStorage = Functions.createClass(function() {
	var _this = this;

	/* set data */
	_this.set = function(key, value) {
		if (_this.isEnabled()) {
			window.localStorage.setItem(_this.getKey(key), value);
			return true;
		}
		return false;
	};

	/* get data */
	_this.get = function(key) {
		return _this.isEnabled() ? window.localStorage.getItem(_this.getKey(key)) : null;
	};

	/* get all data */
	_this.getAll = function() {
		var array = [];
		if (!_this.isEnabled()) {
			return array;
		};
		for (var i = 0, j = window.localStorage.length; i < j; i++) {
			var key = window.localStorage.key([i]);
			if (key.indexOf(_this.getKey()) == 0) {
				array.push(window.localStorage.getItem(key));
			}
		}
		array.sort();
		return array.reverse();
	};

	/* remove data */
	_this.remove = function(key) {
		if (_this.isEnabled() && _this.get(key)) {
			window.localStorage.removeItem(_this.getKey(key));
			return true;
		}
		return false;
	};

	// is enabled
	_this.isEnabled = function() {
		return _this.isSupported() && Core.Config.webcomponent.hasAttribute('name') && Core.Config.webcomponent.getAttribute('name').trim() !== '';
	};

	// is supported
	_this.isSupported = function() {
		try {
			return 'localStorage' in window && !Functions.isNull(window['localStorage']);
		} catch (error) {
			return false;
		}
	};

	// get key
	_this.getKey = function(suffix) {
		return _this.isEnabled() ? 'RPEditor[' + window.location.hostname + window.location.pathname + '][' + Core.Config.webcomponent.getAttribute('name').trim() + ']' + (suffix ? '[' + suffix + ']' : '') : null;
	};
});