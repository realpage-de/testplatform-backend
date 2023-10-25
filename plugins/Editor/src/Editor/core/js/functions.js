var Functions = {
	isFunction: function(value) {
		return (value && {}.toString.call(value) === '[object Function]') ? true : false;
	},
	isClass: function(value) {
		return typeof value === 'function' && /^\s*class\s+/.test(value.toString());
	},
	isString: function(value) {
		return typeof value === 'string' || value instanceof String;
	},
	isNumber: function(value) {
		return typeof value === 'number' && isFinite(value);
	},
	isNumeric: function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	isArray: function(value) {
		return Array.isArray ? Array.isArray(value) : (value && typeof value === 'object' && value.constructor === Array);
	},
	isObject: function(value) {
		return !Functions.isNull(value) && value && typeof value === 'object' && value.constructor === Object;
	},
	isJSON: function(value) {
		try {
			var o = JSON.parse(value);
			if (o && typeof o === 'object') {
				return true;
			}
		} catch(error) {};
		return false;
	},
	isNode: function(value) {
		return (typeof Node === 'object' ? value instanceof Node : value && typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.nodeName === 'string');
	},
	isElement: function(value) {
		return (typeof HTMLElement === 'object' ? value instanceof HTMLElement : value && typeof value === 'object' && value !== null && value.nodeType === 1 && typeof value.nodeName === 'string');
	},
	isInstanceOf: function(value, instance) {
		var array = Functions.isArray(instance) ? instance : [instance];
		for (var i = 0; i < array.length; i++) {
			if (Functions.isFunction(array[i]) && value instanceof array[i]) {
				return true;
			}
		}
		return false;
	},
	isNull: function(value) {
		return value === null;
	},
	isUndefined: function(value) {
		return typeof value === 'undefined';
	},
	isBoolean: function(value) {
		return typeof value === 'boolean';
	},
	isRegExp: function(value) {
		return value && typeof value === 'object' && value.constructor === RegExp;
	},
	isError: function(value) {
		return value instanceof Error && typeof !Functions.isUndefined(value.message);
	},
	isDate: function(value) {
		return value instanceof Date;
	},
	isSymbol: function(value) {
		return typeof value === 'symbol';
	},
	arrayIntersection: function(array1, array2) {
		return array1.filter(function(x) { return array2.includes(x); });
	},
	arrayDifference: function(array1, array2) {
		return array1.filter(function(x) { return !array2.includes(x); });
	},
	arraySymmetricDifference: function(array1, array2) {
		return array1.filter(function(x) { return !array2.includes(x); }).concat(array2.filter(function(x) { return !array1.includes(x); }));
	},
	objectEquals: function(x, y) {
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
		return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ? p.every(function (i) { return Functions.objectEquals(x[i], y[i]); }) : false;
	},
	createClass: function(fn, constructorArgs, classArgs) {
		classArgs = (classArgs ? (Functions.isArray(classArgs) ? classArgs : [classArgs]) : []);
		classArgs.unshift(null);
		var obj = new (Function.prototype.bind.apply(fn, classArgs));
		Functions.trigger(obj._constructor, false, constructorArgs);
		return obj;
	},
	trigger: function(fn, throwErrorIfNotFound, args) {
		if (Functions.isFunction(fn)) {
			return fn.apply(null, (args ? (Functions.isArray(args) ? args : [args]) : []));
		}
		else if (throwErrorIfNotFound === true) {
			throw new Error('RPEditor: Functions.trigger(): function not found.');
		}
		return null;
	},
	parseObject: function(obj, properties) {
		var newObj = {},
			obj = Functions.isObject(obj) ? obj : newObj,
			parse = function(property) {
				newObj[property.name] = (property.validate(obj[property.name]) === true) ? property.parse(obj[property.name]) : property.defaultValue;
			};

		properties.forEach(function(property) {
			if (Functions.isObject(property) && Functions.isString(property.name)) {
				parse({
					name: Functions.isString(property.name) ? property.name : '',
					validate: Functions.isFunction(property.validate) ? property.validate : function(value) { return true; },
					parse: Functions.isFunction(property.parse) ? property.parse : function(value) { return value; },
					defaultValue: property.defaultValue
				});
			}
		});

		return newObj;
	},
	dimension: function() {
		var w = top.window,
			d = top.document,
			e = d.documentElement,
			g = d.body,
			width = w.innerWidth || e.clientWidth || g.clientWidth,
			height = w.innerHeight|| e.clientHeight|| g.clientHeight;
		return {width: width, height: height};
	},
	viewport: function() {
		var top = window.pageYOffset !== undefined ? window.pageYOffset : window.documentElement.scrollTop,
			bottom = top + Functions.dimension().height;
		return {top: top, bottom: bottom};
	},
	getDocumentFragmentToHTML: function(fragment) {
		if (!Functions.isInstanceOf(fragment, DocumentFragment)) {
			return null;
		}
		var wrapper = document.createElement('div');
		wrapper.appendChild(fragment);
		return wrapper.innerHTML;
	},
	escapeText: function(text) {
		return String(text).replace(/"/gi, '\\"');
	},
	encodeText: function(text, raw) {
		var str = String(text);
		if (raw === true) {
			str = str.replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/"/gi, '&quot;');
		}
		return str.split("\n").join('<br>');
	},
	decodeText: function(text, raw) {
		var str = String(text);
		if (raw === true) {
			str = str.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"');
		}
		return str.replace(/<br>/gi, "\n");
	},
	isTouchSupported: function() {
		return 'ontouchstart' in document.documentElement;
	},
	scrollToBlock: function(block) {
		/*
		const elementRect = block.getContainer().getBoundingClientRect();
		const absoluteElementTop = elementRect.top;
		// align type
		const middleDiff = (elementRect.height / 2);
		// 要素の中心のY座標
		const scrollTopOfElement = absoluteElementTop + middleDiff;
		// 画面半分を引くと、要素の中心が、画面の中央になる
		const scrollY = scrollTopOfElement - (window.innerHeight / 2);
		window.scrollTo(0, scrollY);
		*/
		window.scrollTo({
			top: (block.getContainer().offsetTop/* - (block.getContainer().offsetHeight / 2)*/ - (Functions.dimension().height / 2))
		});
	},
	createElement: function(tagName, BaseElement, fn) {
		if (arguments.length === 1) {
			BaseElement = tagName;
			tagName = undefined;
		}
		else if (arguments.length === 2 && !Functions.isString(tagName)) {
			fn = BaseElement;
			BaseElement = tagName;
			tagName = undefined;
		}
		var Element = function() {
			return Reflect.construct(BaseElement, [], this.constructor);
		};
		Element.prototype = Object.create(BaseElement.prototype);
		Element.prototype.constructor = Element;
		Object.setPrototypeOf(Element, BaseElement);

		if (Functions.isFunction(fn)) {
			fn(Element);
		}

		if (tagName) {
			document.registerElement(tagName, Element);
		}
		return Element;
	},
	/**
	 * This method establishes an ajax request.
	 * @function
	 * @param opts the Configuration object.
	 * @param {String} opts.method The request method. POST or GET.
	 * @param {String} opts.url The url to query.
	 * @param {Function} opts.success A callback function that is executed on success.
	 * @param {Function} opts.failure A callback function that is executed on failure.
	 * @param {String} opts.params Parameters which are sent when using POST as request method. Example: opts.params: 'id=7&title=moo'
	 * @constructor
	 * @return {undefined}
	 */
	ajax: function(opts) {
		opts = opts || {};
		var xhr = null;
		try {
			xhr = new XMLHttpRequest();
		} catch (err) {
			try {
				xhr = new ActiveXObject('Microsoft.xhr');
			} catch (err1) {
				try {
					xhr = new ActiveXObject('Msxml2.xhr');
				} catch (err2) {
					xhr = null;
				}
			}
		}
		if (xhr) {
			opts.method = (opts.method || 'GET').toUpperCase();
			xhr.open(opts.method, opts.url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						if (Functions.isFunction(opts.onSuccess)) {
							Functions.trigger(opts.onSuccess, false, [xhr.responseText, xhr]);
						}
					} else {
						if (Functions.isFunction(opts.onFailure)) {
							Functions.trigger(opts.onFailure, false, [xhr.status, xhr]);
						}
					}
				}
			};
			xhr.onerror = function() {
				if (Functions.isFunction(opts.onFailure)) {
					Functions.trigger(opts.onFailure, false, [xhr.status, xhr]);
				}
			};
			if (opts.method === 'POST' && !Functions.isUndefined(opts.params)) {
				xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
				xhr.send(JSON.stringify(opts.params));
			} else {
				xhr.send();
			}
		}
	}
};