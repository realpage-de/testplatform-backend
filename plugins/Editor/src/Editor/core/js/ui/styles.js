return Functions.createClass(function() {
	var _this = this,
		list = {},
		attrName = 'data-' + COMPONENT_TAG_NAME + '-style';

	_this.getByKey = function(key) {
		return (key in list) ? list[key] : null;
	};

	_this.getAll = function() {
		return list;
	};

	_this.add = function(key, cssObj, selectorPrefix) {
		selectorPrefix = Functions.isString(selectorPrefix) ? selectorPrefix : null;
		if (!(key in list)) {
			var escapedKey = Functions.escapeText(key);
			if (!Functions.isElement(document.querySelector('style[type="text/css"][' + attrName + '="' + escapedKey + '"]'))) {
				var cssString = buildCssString(cssObj, selectorPrefix);
				if (cssString) {
					var element = UI.createElement('style');
					element.type = 'text/css';
					element.setAttribute(attrName, escapedKey);
					if (element.styleSheet) { // IE 8-
						element.styleSheet.cssText = cssStrings;
					} else {
						element.appendChild(document.createTextNode(cssString));
					}
					list[key] = element;
					document.head.appendChild(element);
					return element;
				}
			}
		}
		return false;
	};

	_this.length = function() {
		return Object.keys(list).length;
	};

	var buildCssString = function(cssObj, selectorPrefix) {
		var recursive = function(obj, parseSelector, level) {
			level = (Functions.isUndefined(level) ? 0 : ++level);
			var array = [];
			if (Functions.isObject(obj)) {
				var indent = ("	").repeat(level);
				for (var key in obj) {
					var selector = (parseSelector === true ? buildSelector(selectorPrefix, key) : key),
						value = obj[key];
					if (selector !== null) {
						if (Functions.isObject(value)) {
							array.push((!Core.isDebug() ? '<S>{<P>}' : indent + "<S> {\n<P>\n" + indent + "}").replace('<S>', selector).replace('<P>', recursive(value, false, level)));
						} else {
							array.push((!Core.isDebug() ? '<S>:<P>;' : indent + "<S>: <P>;").replace('<S>', selector).replace('<P>', value));
						}
					}
				}
			}
			return array.length ? array.join((!Core.isDebug() ? '' : "\n")) : null;
		};
		return recursive(cssObj, true);
	};

	var buildSelector = function(selectorPrefix, selector) {
		var IS_NULL = false,
			preparedSelector;

		// -
		(function(sel) {
			if (checkSelectorPrefix(sel, selector)) {
				preparedSelector = selector.substr(sel.length);
			}
		})('-');

		// !
		(function(sel) {
			if (checkSelectorPrefix(sel, selector)) {
				if (selector.trim().length > sel.length) {
					selectorPrefix = null;
					preparedSelector = selector.substr(sel.length);
				} else {
					IS_NULL = true;
				}
			}
		})('!');

		if (Functions.isUndefined(preparedSelector)) {
			preparedSelector = ' ' + selector;
		}

		return (IS_NULL === true ? null : (selectorPrefix ? selectorPrefix + preparedSelector : preparedSelector));
	};

	var checkSelectorPrefix = function(prefix, selector) {
		return (selector.substr(0, prefix.length) === prefix);
	};
});