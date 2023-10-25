(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(start) {
			var i = (typeof start === 'number' && isFinite(start) && start > 0 ? start : 0);
			return {
				increase: function() {
					return ++i;
				},
				decrease: function() {
					return --i;
				},
				get: function() {
					return i;
				}
			};
		};
	}
})(window, 'Counter');