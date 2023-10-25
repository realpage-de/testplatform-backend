(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = new (function(_parent) {
			var _this = this,
				Functions = {
					isArray: function(value) {
						return Array.isArray ? Array.isArray(value) : (value && typeof value === 'object' && value.constructor === Array);
					},
					isString: function(value) {
						return typeof value === 'string' || value instanceof String;
					},
					isObject: function(value) {
						return !Functions.isNull(value) && value && typeof value === 'object' && value.constructor === Object;
					},
					isBoolean: function(value) {
						return typeof value === 'boolean';
					},
					isNull: function(value) {
						return value === null;
					}
				},
				sanitize = function(config, parentNode) {
					for (var i = 0; i < parentNode.childNodes.length; i += 1) {
						var node = parentNode.childNodes[i],
							nodeName = node.nodeName.toLowerCase(),
							configAttrs = config[nodeName];

						// if value is a string, map tagName to value
						if (Functions.isString(configAttrs)) {
							var newNode = document.createElement(configAttrs);
							newNode.innerHTML = node.innerHTML;
							node.parentNode.replaceChild(newNode, node);
							node = newNode;
							nodeName = node.nodeName.toLowerCase();
							configAttrs = config[nodeName];
						}

						// ignore text nodes and nodes that have already been sanitized
						if (node.nodeType === 3 || node._sanitized) {
							continue;
						}

						// drop tag entirely
						if (!configAttrs) {
							while (node.childNodes.length > 0) {
								parentNode.insertBefore(node.childNodes[0], node);
							}
							parentNode.removeChild(node);

							sanitize(config, parentNode);
							break;
						}

						// sanitize attributes
						(function() {
							var attributesToRemove = [];
							Array.prototype.forEach.call(node.attributes, function(attribute) {
								var attrName = attribute.name.toLowerCase();

								if (Functions.isObject(configAttrs) && attrName in configAttrs) {
									// attribute mapping to another?
									if (Functions.isString(configAttrs[attrName]) && configAttrs[attrName].trim() !== '') {
										node.setAttribute(configAttrs[attrName].trim(), node.getAttribute(attrName));
										attributesToRemove.push(attrName);
									}
								}
								// attribute not allowed?
								else {
									attributesToRemove.push(attrName);
								}
							});
							attributesToRemove.forEach(function(attrName) {
								node.removeAttribute(attrName);
							});
						})();

						// sanitize children
						sanitize(config, node);

						// mark node as sanitized so it's ignored in future runs
						node._sanitized = true;
					}
				};

			_this.clean = function(htmlString, config) {
				if (!Functions.isString(htmlString)) {
					throw new Error('Sanitizer.clean(htmlString, config): «htmlString» must be a string.');
				}

				config = Functions.isObject(config) ? config : {};

				// remove all before <!--StartFragment--> and after <!--EndFragment-->
				(function(posStartFragment, posEndFragment) {
					if (posStartFragment !== -1 && posEndFragment !== -1 && posStartFragment < posEndFragment) {
						htmlString = htmlString.substr(posStartFragment, posEndFragment);
					}
				})(htmlString.indexOf('<!--StartFragment-->'), htmlString.indexOf('<!--EndFragment-->'));

				// remove "&nbsp;"
				htmlString = htmlString.replace(/&nbsp;/g, '');

				var sandbox = document.createElement('div');
				sandbox.innerHTML = htmlString;

				sanitize(config, sandbox);

				return sandbox.innerHTML;
			};
		})(_parent);
    }
})(window, 'Sanitizer');