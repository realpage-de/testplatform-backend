(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function() {
			var list = new Map();

			this.add = function(key, func) {
				if (!(typeof key === 'string' || key instanceof String)) {
					throw new Error(funcName + '.add(): First argument must be a string.');
				}
				if (!(func && {}.toString.call(func) === '[object Function]')) {
					throw new Error(funcName + '.add(): Second argument must be a function.');
				}
				var pub = new Map();
				func(pub);
				list.set(key, pub);
			};

			this.get = function(key) {
				if (!(typeof key === 'string' || key instanceof String)) {
					throw new Error(funcName + '.get(): First argument must be a string.');
				}
				var direct_access = new RegExp('([._A-z0-9]+)\{([_A-z0-9]+)\}', 'g').exec(key),
					plugin = direct_access ? list.get(direct_access[1]) : list.get(key),
					property = direct_access ? direct_access[2] : null;
				if (plugin) {
					return property ? plugin.get(property) : plugin;
				}
				return null;
			};
		};
	}
})(window, 'PluginManager');