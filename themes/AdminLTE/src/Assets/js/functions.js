/**
 * Same as Array.join(), but recursively.
 * 
 * @param string glue
 * @param array array
 * @return array
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(glue, array) {
			var ret = [],
				str;
			if (Array.isArray(array)) {
				array.forEach(function(item) {
					if (Array.isArray(item)) {
						str = window[funcName](glue, item);
					} else {
						str = item;
					}
					ret.push(str);
				});
			}
			return ret.join(glue);
		};
	}
})('array_join_recursive');

/**
 * Checks if two objects are equal.
 * 
 * @param object x
 * @param object y
 * @return boolean
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(x, y) {
            // if both are function
            if (x instanceof Function) {
                if (y instanceof Function) {
                    return x.toString() === y.toString();
                }
                return false;
            }
            if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
            if (x === y || x.valueOf() === y.valueOf()) { return true; }

            // if one of them is date, they must had equal valueOf
            if (x instanceof Date) { return false; }
            if (y instanceof Date) { return false; }

            // if they are not function or strictly equal, they both need to be Objects
            if (!(x instanceof Object)) { return false; }
            if (!(y instanceof Object)) { return false; }

            var p = Object.keys(x);
            return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ? p.every(function (i) { return window[funcName](x[i], y[i]); }) : false;
		};
	}
})('object_equals');

/**
 * Finds whether a variable is a json.
 * 
 * @param string $val
 * @return boolean
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(val) {
            try {
                var o = JSON.parse(val);
				if (o && typeof o === 'object') {
					return true;
				}
            } catch(error) {};
			return false;
		};
	}
})('is_json');

/**
 * Finds whether a variable is an object.
 * 
 * @param ? $val
 * @return boolean
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(val) {
            return val !== null && val && typeof val === 'object' && val.constructor === Object;
		};
	}
})('is_object');

/**
 * Parse a date string to locale.
 * 
 * @param string $val
 * @return string
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(val) {
            return new Date(val).toLocaleDateString(window.app.settings.locale, {day: '2-digit', month: '2-digit', year: 'numeric'});
		};
	}
})('locale_date_string');

/**
 * Get the age of Date.
 * 
 * @param string $val
 * @return integer
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(val) {
			var today = new Date();
			var birthDate = new Date(val);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		};
	}
})('get_age_by_date_string');

/**
 * Executes a function by string name in context.
 * 
 * @param string $namespace
 * @param object $context
 * @return function response
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function(namespace, context) {
			var args = Array.prototype.slice.call(arguments, 2),
				namespaces = namespace.split('.'),
				func = namespaces.pop();
			for (var i = 0; i < namespaces.length; i++) {
			  	context = context[namespaces[i]];
			}
			return context[func].apply(context, args);
		};
	}
})('execute_function_by_name');

/**
 * Checks is user agent is mobile.
 * 
 * @return boolean
 */
(function(funcName) {
	'use strict';
	if (!(funcName in window)) {
		window[funcName] = function() {
			return (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent));
		};
	}
})('is_mobile');