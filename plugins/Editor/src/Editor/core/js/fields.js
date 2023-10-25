var Fields = Functions.createClass(function() {
	var _this = this,
		list = {};

	_this.getAllKeys = function() {
		return Object.keys(list);
	};

	_this.getByKey = function(key) {
		return (key in list) ? list[key] : null;
	};

	_this.getAll = function() {
		return list;
	};

	_this.add = function(key, block) {
		if (!(key in list)) {
			list[key] = block;
			return block;
		}
		return false;
	};

	_this.length = function() {
		return Object.keys(list).length;
	};
});