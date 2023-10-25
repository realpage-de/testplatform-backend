var FieldList = function(Block) {
	var _this = this,
		list = {};

	_this.getAllKeys = function() {
		return Object.keys(list);
	};

	_this.getByKey = function(key) {
		return key in list ? list[key] : null;
	};

	_this.getFirst = function() {
		for (var key in list) {
			return list[key];
		}
		return null;
	};

	_this.getLast = function() {
		var i = 0,
			t = _this.length();
		for (var key in list) {
			if (++i === t) {
				return list[key];
			}
		}
		return null;
	};

	_this.getPreviousByField = function(field) {
		var prevField;
		for (var key in list) {
			if (list[key] === field && prevField) {
				return prevField;
			}
			prevField = list[key];
		}
		return null;
	};

	_this.getNextByField = function(field) {
		var found = false;
		for (var key in list) {
			if (list[key] === field) {
				found = true;
			} else if (found === true) {
				return list[key];
			}
		}
		return null;
	};

	_this.getAll = function() {
		return list;
	};

	_this.getAllAsArray = function() {
		var array = [];
		for (var key in list) {
			array.push({
				getKey: (function(_key) { return function() { return _key; }; })(key),
				getInstance: (function(_instance) { return function() { return _instance; }; })(list[key])
			});
		}
		return array;
	};

	_this.add = function(key, field) {
		if (!(key in list)) {
			list[key] = field;
			Functions.trigger(field.initialize, true, [_this]);
			return field;
		}
		return false;
	};

	_this.length = function() {
		return Object.keys(list).length;
	};

	_this.getBlock = function() {
		return Block;
	};

	_this.getJson = function() {
		var data = [];
		for (var key in list) {
			data.push(list[key].getJson());
		};
		return data;
	};
};