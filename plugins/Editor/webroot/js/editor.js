(function() {
    (function(COMPONENT_TAG_NAME, window, document) {
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
        /* custom elements */
        (function() {
        	'use strict';
        
        	/* custom editor element */
        	window.RPEditorBaseHTMLElement = Functions.createElement(HTMLElement, function(_) {
        		_.prototype.setAttributes = function setAttributes(attrs) {
        			if (!Functions.isObject(attrs)) {
        				return;
        			}
        			for (var idx in attrs) {
        				this.setAttribute(idx, attrs[idx]);
        			}
        		};
        	});
        
        	/* custom editor wrapper element */
        	window.RPEditorWrapperHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-wrapper', RPEditorBaseHTMLElement);
        	
        	/* custom editor toolbar element */
        	window.RPEditorToolbarHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar', RPEditorBaseHTMLElement, function(_) {
        		_.prototype.setType = function setType(type) {
        			if (['editor', 'block', 'field'].indexOf(type) >= 0) {
        				// set type attribute
        				this.setAttribute('type', type);
        				return true;
        			}
        			return false;
        		};
        
        		_.prototype.getType = function getType() {
        			return this.hasAttribute('type') ? this.getAttribute('type') : null;
        		};
        	});
        
        	/* custom editor toolbar section element */
        	window.RPEditorToolbarSectionHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar-section', RPEditorBaseHTMLElement);
        
        	/* custom editor toolbar button element */
        	window.RPEditorToolbarButtonHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-toolbar-button', RPEditorBaseHTMLElement);
        
        	/* custom editor blocks element */
        	window.RPEditorBlocksHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-blocks', RPEditorBaseHTMLElement);
        
        	/* custom editor block element */
        	window.RPEditorBlockHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-block', RPEditorBaseHTMLElement);
        
        	/* custom editor field wrapper element */
        	window.RPEditorFieldWrapperHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-field-wrapper', RPEditorBaseHTMLElement);
        
        	/* custom editor field element */
        	window.RPEditorFieldHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-field', RPEditorBaseHTMLElement, function(_) {
        		_.prototype.attachedCallback = function attachedCallback() {
        			var _this = this;
        			/* contenteditable-attribute */
        			(function() {
        				if (_this.isEditable()) {
        					var editor = _this.closest(COMPONENT_TAG_NAME);
        					_this.setAttribute('contenteditable', (!editor || editor.disabled ? 'false' : 'true'));
        				}
        			})();
        		};
        
        		_.prototype.isEditable = function isEditable(value) {
        			var attrName = 'contenteditable';
        			if (arguments.length) {
        				if (value === true) {
        					this.setAttribute(attrName, 'true');
        				} else if (value === false) {
        					this.removeAttribute(attrName);
        				}
        			} else {
        				return this.hasAttribute(attrName);
        			}
        		};
        	});
        
        	/* custom editor editable element */
        	window.RPEditorEditableHTMLElement = Functions.createElement(COMPONENT_TAG_NAME + '-editable', RPEditorBaseHTMLElement, function(_) {
        		_.prototype.attachedCallback = function attachedCallback() {
        			var _this = this;
        			/* contenteditable-attribute */
        			(function() {
        				var editor = _this.closest(COMPONENT_TAG_NAME);
        				_this.setAttribute('contenteditable', (!editor || editor.disabled ? 'false' : 'true'));
        			})();
        		};
        	});
        })();
        (function() {
        	'use strict';
        
        	window.RPEditorHTMLElement = Functions.createElement(COMPONENT_TAG_NAME, RPEditorBaseHTMLElement, function(_) {
        		_.prototype.attachedCallback = function attachedCallback() {
        			var _this = this;
        			// initialize
        			initialize.call(_this);
        		};
        
        		var initialize = function() {
        			var _this = this;
        			if (Functions.isInstanceOf(_this._editor, RPEditor)) {
        				return;
        			}
        			// removeAttribute
        			(function(funcName) {
        				var orgFunc = _this[funcName];
        				_this[funcName] = function(attrName) {
        					if (_this.hasAttribute(attrName)) {
        						var oldValue = _this.getAttribute(attrName);
        						orgFunc.call(_this, attrName);
        						_this.attributeChangedCallback(attrName, oldValue, false);
        					}
        				};
        			})('removeAttribute');
        			// initialize Editor
        			_this._editor = new RPEditor({
        				webcomponent: _this,
        				components: getComponents.call(_this),
        				data: getData.call(_this)
        			});
        		};
        
        		/* get data */
        		var getData = function() {
        			var _this = this,
        				data = [];
        			try {
        				var textContent = _this.textContent.trim();
        				if (textContent) {
        					data = JSON.parse(textContent);
        				}
        			} catch (error) {
        				console.error(new Error('RPEditorHTMLElement: «data» is invalid json, editor will be created without data.'));
        			}
        			_this.innerHTML = '';
        			return data;
        		};
        
        		/* get components */
        		var getComponents = function() {
        			var _this = this,
        				components = {};
        			try {
        				if (_this.hasAttribute('components')) {
        					var str = _this.getAttribute('components').trim();
        					if (str) {
        						components = JSON.parse(str);
        					}
        					_this.removeAttribute('components');
        				}
        			} catch (error) {
        				console.error(new Error('RPEditorHTMLElement: «components»-attribute is invalid json, it will be ignored.'));
        			}
        			return components;
        		};
        
        		/*
        		(function(funcName) {
        			var orgFunc = _.prototype[funcName];
        			_.prototype[funcName] = function(type, listener, useCapture, wantsUntrusted) {
        				if (Functions.isString(type)) {
        					type.split(' ').forEach(function(type) {
        						orgFunc(type, listener, useCapture, wantsUntrusted);
        					});
        				}
        			};
        		})('addEventListener');
        		*/
        
        		_.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {
        			var _this = this;
        			switch (attrName) {
        				case 'disabled': {
        					if (Functions.isInstanceOf(_this._editor, RPEditor) && newValue !== null) {
        						_this._editor.disabled(_this.disabled);
        					}
        					break;
        				}
        			}
        		};
        
        		(function(attrName) {
        			Object.defineProperty(_.prototype, attrName, {
        				get: function() {
        					return this.hasAttribute(attrName);
        				},
        				set: function(value) {
        					if (value === true) {
        						this.setAttribute(attrName, '');
        					} else if (value === false) {
        						this.removeAttribute(attrName);
        					}
        				}
        			});
        		})('disabled');
        
        		/* get data */
        		_.prototype.getData = function getData() {
        			return this._editor.getData();
        		};
        
        		/* set data */
        		_.prototype.setData = function(data) {
        			var _this = this;
        			if (Functions.isInstanceOf(_this._editor, RPEditor)) {
        				_this._editor.setData(data);
        			} else {
        				var status = false,
        					counter = 0,
        					max = 9,
        					looper = setInterval(function() {
        						counter++;
        						if (!status && Functions.isInstanceOf(_this._editor, RPEditor)) {
        							status = true;
        							_this._editor.setData(data);
        						}
        						if (status || counter >= max) {
        							clearInterval(looper);
        						}
        					}, 50);
        			}
        		};
        	});
        })();
        window.RPEditorComponents = new (function RPEditorComponents() {
        	'use strict';
        	var ListObject = function RPEditorComponentCollection() {
        			var store = {};
        		
        			var add = function add(name, fn) {
        				if (!Functions.isString(name)) {
        					throw new Error('RPEditorComponentCollection.add(): the first argument «name» must be a string.');
        				}
        				if (name.length === 0) {
        					throw new Error('RPEditorComponentCollection.add(): the first argument «name» cannot be empty.');
        				}
        				if (!Functions.isFunction(fn)) {
        					throw new Error('RPEditorComponentCollection.add(): the second argument «fn» must be a function.');
        				}
        				if (name in store) {
        					throw new Error('RPEditorComponentCollection.add(): the component name «' + name + '» already exist.');
        				}
        				for (let key in store) {
        					if (store[key] === fn) {
        						throw new Error('RPEditorComponentCollection.add(): the component «fn» already exist.');
        					}
        				}
        				store[name] = fn;
        			};
        		
        			var get = function get(name) {
        				return (name in store) ? store[name] : null;
        			};
        		
        			var getAll = function getAll() {
        				return store;
        			};
        		
        			return {
        				get add() { return add; },
        				get get() { return get; },
        				get getAll() { return getAll; }
        			};
        		},
        		types = {
        			editorTools: new ListObject(),
        			blocks: new ListObject(),
        			blockTunes: new ListObject(),
        			fields: new ListObject(),
        			inlineTools: new ListObject()
        		};
        
        	return {
        		get EditorTools() { return types.editorTools; },
        		get Blocks() { return types.blocks; },
        		get BlockTunes() { return types.blockTunes; },
        		get Fields() { return types.fields; },
        		get InlineTools() { return types.inlineTools; }
        	};
        })();
        window.RPEditor = function RPEditor(config) {
        	'use strict';
        	var Editor = this;
        
        	/* core editor tools */
        	var AddBlockEditorTool = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Block hinzufügen',
        				icon: '<i class="fa fa-plus-circle"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			console.log('add-block clicked!');
        			// create block chooser
        			var blockChooser = Functions.createClass(api.Classes.BlockChooser, [], [api.Classes.Core.getBlocks()]);
        			blockChooser.getModal().setPosition('down');
        			blockChooser.getModal().open();
        			blockChooser.getModal().getContainer().classList.add('block-chooser-editor-toolbar');
        			blockChooser.getModal().getContainer().classList.add('position-left');
        			// move block chooser after toolbar
        			toolbar.getElement().parentNode.insertBefore(blockChooser.getModal().getContainer(), toolbar.getElement().nextElementSibling);
        		};
        	};
        	var LocaleStorageEditorTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			storage,
        			timeout,
        			delay = 1000;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Gespeicherte Versionen',
        				icon: '<i class="fa fa-history"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        	
        			storage = api.Classes.LocalStorage;
        	
        			// bind events
        			bindEvents();
        		};
        	
        		/* bind events */
        		var bindEvents = function() {
        			var _editor = api.Classes.Core.Config.webcomponent;
        			_editor.addEventListener('change', function(event) {
        				handleDelay();
        			});
        			_editor.addEventListener('block-added', function(event) {
        				save();
        			});
        			_editor.addEventListener('block-moved', function(event) {
        				save();
        			});
        			_editor.addEventListener('block-deleted', function(event) {
        				save();
        			});
        		};
        	
        		var handleDelay = function() {
        			if (timeout) {
        				clearTimeout(timeout);
        			}
        			timeout = setTimeout(save, delay);
        		};
        	
        		var save = function() {
        			var found = false,
        			data = api.Classes.Editor.getData(),
        			dataString = JSON.stringify(data);
        	
        			storage.getAll().forEach(function(itemString) {
        				var item =JSON.parse(itemString);
        				if (JSON.stringify(item.data) === dataString) {
        					found = true;
        				}
        			});
        	
        			if (!found) {
        				storage.set(generateKey(), JSON.stringify({date: new Date(), data: data}));
        			}
        		};
        	
        		var generateKey = function() {
        			if(typeof performance !== 'undefined' && performance.now) {
        				return (performance.now() + performance.timing.navigationStart) / 1000;
        			} else {
        				return (Date.now ? Date.now() : new Date().getTime()) / 1000;
        			}
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			createModal();
        		};
        	
        		/* create modal */
        		var createModal = function() {
        			// create modal
        			var modal = api.Classes.UI.createModal();
        			// set title
        			modal.setTitle(_super.getName());
        			// clear body
        			modal.clearBody();
        			// create body
        			modal.appendBody((function() {
        				var data = storage.getAll();
        				if (data.length) {
        					var listElement = UI.createElement('ul', {className: 'modal-local-storage-list'});
        					data.forEach(function(itemString) {
        						var item = JSON.parse(itemString);
        						var listItemElement = UI.createElement('li', {className: 'modal-local-storage-list-item', innerHTML: formatDate(new Date(item.date))});
        						listItemElement.addEventListener('click', function(event) {
        							api.Classes.Core.setData(item.data);
        							// close
        							modal.close();
        						});
        						listElement.appendChild(listItemElement);
        					});
        					return listElement;
        				} else {
        					return UI.createElement('p', {innerHTML: 'Es ist keine gespeicherten Versionen zum Wiederherstellen verfügbar.'});
        				}
        			})());
        			modal.open({
        				closeOnEscape: true,
        				closeOnClickOutside: true
        			});
        		};
        	
        		var formatDate = function(date) {
        			var yyyy = date.getFullYear(),
        				mm = (date.getMonth() + 1),
        				dd = date.getDate(),
        				hh = date.getHours(),
        				min = date.getMinutes(),
        				ss = date.getSeconds();
        			if (mm < 10) {
        				mm = '0' + mm;
        			}
        			if (dd < 10) {
        				dd = '0' + dd;
        			}
        			if (hh < 10) {
        				hh = '0' + hh;
        			}
        			if (min < 10) {
        				min = '0' + min;
        			}
        			if (ss < 10) {
        				ss = '0' + ss;
        			}
        			return dd + '.' + mm + '.' + yyyy + ' '+ hh + ':' + min + ':' + ss;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'!.modal-local-storage-list': {
        					'display': 'block',
        					'margin': '0',
        					'padding': '0'
        				},
        				'!.modal-local-storage-list > .modal-local-storage-list-item': {
        					'display': 'block',
        					'padding': '10px'
        				},
        				'!.modal-local-storage-list > .modal-local-storage-list-item:not(:last-child)': {
        					'border-bottom': '1px solid #dbdbe2'
        				},
        				'!.modal-local-storage-list > .modal-local-storage-list-item:hover': {
        					'background-color': '#f8f8f8',
        					'cursor': 'pointer'
        				},
        			};
        		};
        	};
        
        	/* core blocks */
        	var ParagraphBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Absatz',
        				icon: '<i class="fas fa-paragraph"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			_super.createField({type: 'text', name: 'text', autofocus: true});
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			var fieldList = _super.getFieldList(),
        				container = fieldList.getBlock().getContainer(),
        				field = fieldList.getByKey('text');
        			container.appendChild(field.getContainer());
        	
        			/* keydown */
        			field.getContainer().addEventListener('keydown', function(event) {
        				var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field.getElement(), includeContent: true}),
        					caretIsAtEnd = api.Utilities.Caret.isAtEnd({element: field.getElement(), includeContent: true});
        	
        				// enter pressed
        				if (event.key === 'Enter' && event.shiftKey === true) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventShiftAndEnter(field);
        				}
        				// backspace pressed
        				if (event.key === 'Backspace' && caretIsAtStart) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventBackspace(field);
        				}
        				// delete pressed and cursor is at end
        				if (event.key === 'Delete' && caretIsAtEnd) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventDelete(field);
        				}
        			});
        		};
        	
        		var eventShiftAndEnter = function(field) {
        			// get extracted fragment
        			var extractedFragment = api.Utilities.Caret.extractFragmentFromPosition({element: field.getElement()});
        	
        			// get extracted html
        			var extractedHTML = api.Functions.getDocumentFragmentToHTML(extractedFragment);
        	
        			// delete selection
        			api.Utilities.Selection.delete();
        	
        			// save current field data without extracted text
        			field.setData(field.getElement().innerHTML);
        			field.save();
        	
        			// create block
        			(function() {
        				var newData = [{'type': 'text', 'name': 'text', 'data': extractedHTML}],
        					newBlock = api.Functions.createClass(Block, [], ['paragraph', newData]);
        				_super.getList().add(newBlock, _super.getPosition() + 1);
        				api.Functions.trigger(newBlock.initialize, false, [_super.getList()]);
        				// custom event "block-added"
        				api.Classes.Core.dispatchEvent('block-added', {
        					detail: {
        						data: newBlock.getJson(),
        						position: newBlock.getPosition()
        					},
        					bubbles: true,
        					cancelable: true
        				});
        				// focus block
        				setTimeout(function() {
        					// call instance method
        					api.Functions.trigger(newBlock.focus, true);
        					// focus auto focus field
        					(function(field) {
        						if (field) {
        							field.focus();
        						}
        					})(newBlock.getAutoFocusField());
        				}, 1);
        			})();
        		};
        	
        		var eventBackspace = function(field) {
        			var prevBlock = _super.getPrevious();
        			if (prevBlock) {
        				var prevField = prevBlock.getFieldList().getLast();
        				if (prevField) {
        					prevBlock.focus();
        					prevField.focus();
        					if (prevBlock.getKey() === 'paragraph') {
        						var caretPosition = prevField.getElement().textContent.length;
        						prevField.setData(prevField.getData() + field.getData());
        						prevField.save();
        						api.Utilities.Caret.setPosition({element: prevField.getElement(), position: caretPosition});
        					} else {
        						var input = prevField.getLastContentEditableElement();
        						if (input) {
        							api.Utilities.Caret.setPositionToEnd({element: input});
        						}
        					}
        				}
        			}
        			_super.delete();
        		};
        	
        		var eventDelete = function(field) {
        			var nextBlock = _super.getNext();
        			if (nextBlock) {
        				var nextField = nextBlock.getFieldList().getFirst();
        				if (nextField) {
        					nextBlock.focus();
        					nextField.focus();
        					if (nextBlock.getKey() === 'paragraph') {
        						var caretPosition = field.getElement().textContent.length;
        						nextField.setData(field.getData() + nextField.getData());
        						nextField.save();
        						api.Utilities.Caret.setPosition({element: nextField.getElement(), position: caretPosition});
        					} else {
        						var input = nextField.getFirstContentEditableElement();
        						if (input) {
        							api.Utilities.Caret.setPositionToStart({element: input});
        						}
        					}
        				}
        			}
        			_super.delete();
        		};
        	};
        	var HeadingBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Überschrift',
        				icon: '<i class="fas fa-heading"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			_super.createField({type: 'heading', name: 'text', autofocus: true});
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
        				_super.getContainer().appendChild(fieldArray.getInstance().getContainer());
        			});
        		};
        	};
        	var ListBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Liste',
        				icon: '<i class="fa fa-list"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			_super.createField({type: 'list', name: 'list', autofocus: true});
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			var fieldList = _super.getFieldList(),
        				container = fieldList.getBlock().getContainer(),
        				field = fieldList.getByKey('list');
        			container.appendChild(field.getContainer());
        	
        			/* keydown */
        			field.getContainer().addEventListener('keydown', function(event) {
        				var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field.getElement(), includeContent: true}),
        					caretIsAtEnd = api.Utilities.Caret.isAtEnd({element: field.getElement(), includeContent: true}),
        					listElements = field.getInstance().getElement().childNodes;
        	
        				// backspace pressed
        				if (event.key === 'Backspace' && caretIsAtStart && listElements.length === 1 && !field.getElement().textContent.trim()) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventBackspace(field);
        				}
        				// delete pressed and cursor is at end
        				if (event.key === 'Delete' && caretIsAtEnd && listElements.length === 1 && !field.getElement().textContent.trim()) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventDelete(field);
        				}
        			});
        		};
        	
        		var eventBackspace = function(field) {
        			var prevBlock = _super.getPrevious();
        			if (prevBlock) {
        				var prevField = prevBlock.getFieldList().getLast();
        				if (prevField) {
        					prevBlock.focus();
        					prevField.focus();
        					if (prevBlock.getKey() === 'paragraph') {
        						var caretPosition = prevField.getElement().textContent.length;
        						prevField.setData(prevField.getData() + field.getData());
        						prevField.save();
        						api.Utilities.Caret.setPosition({element: prevField.getElement(), position: caretPosition});
        					} else {
        						var input = prevField.getLastContentEditableElement();
        						if (input) {
        							api.Utilities.Caret.setPositionToEnd({element: input});
        						}
        					}
        				}
        			}
        			_super.delete();
        		};
        	
        		var eventDelete = function(field) {
        			var nextBlock = _super.getNext();
        			if (nextBlock) {
        				var nextField = nextBlock.getFieldList().getFirst();
        				if (nextField) {
        					nextBlock.focus();
        					nextField.focus();
        					if (nextBlock.getKey() === 'paragraph') {
        						var caretPosition = field.getElement().textContent.length;
        						nextField.setData(field.getData() + nextField.getData());
        						nextField.save();
        						api.Utilities.Caret.setPosition({element: nextField.getElement(), position: caretPosition});
        					} else {
        						var input = nextField.getFirstContentEditableElement();
        						if (input) {
        							api.Utilities.Caret.setPositionToStart({element: input});
        						}
        					}
        				}
        			}
        			_super.delete();
        		};
        	};
        	var TableBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Tabelle',
        				icon: '<i class="fa fa-table"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			_super.createField({type: 'table', name: 'data', autofocus: true});
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
        				_super.getContainer().appendChild(fieldArray.getInstance().getContainer());
        			});
        		};
        	};
        	var CodeBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Code',
        				icon: '<i class="fa fa-code"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			_super.createField({type: 'code', name: 'code', autofocus: true});
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
        				_super.getContainer().appendChild(fieldArray.getInstance().getContainer());
        			});
        		};
        	};
        	var AnchorBlock = function(_super, api) {
        		var _this = this,
        			data;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Anker',
        				icon: '<i class="fa fa-anchor"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        			// create fields
        			(function(field) {
        				field.getElement().setAttribute('placeholder', 'Name des Ankers');
        			})(_super.createField({type: 'text', name: 'name', autofocus: true, settings: {inlineTools: false, enableLineBreaks: false}}));
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			var fieldList = _super.getFieldList(),
        				container = fieldList.getBlock().getContainer(),
        				containerElement = api.Classes.UI.createElement('div', {className: 'flex-box'}),
        				iconElement = api.Classes.UI.createElement('i', {className: 'icon fa fa-anchor'});
        			iconElement.setAttribute('aria-hidden', 'true');
        			containerElement.appendChild(iconElement);
        			containerElement.appendChild(fieldList.getByKey('name').getContainer());
        			container.appendChild(containerElement);
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'.flex-box': {
        					'display': 'flex'
        				},
        				'.flex-box .icon': {
        					'margin': '6px 8px 0 8px',
        					'font-size': '16px'
        				},
        				'.flex-box rp-editor-field-wrapper[name="name"]': {
        					'flex': '1'
        				}
        			};
        		};
        	};
        
        	/* core block tunes */
        	var SettingsBlockTune = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Blockeinstellungen',
        				icon: '<i class="fa fa-cog"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			// open settings modal
        			toolbar.getBlock().getSettingsUI().open();
        		};
        	};
        	var MoveUpBlockTune = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Nach oben',
        				icon: '<i class="fas fa-arrow-up"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			// position before movement
        			var topBefore = toolbar.getBlock().getContainer().getBoundingClientRect().top;
        			// move down
        			toolbar.getBlock().moveUp();
        			// position after movement
        			var topAfter = toolbar.getBlock().getContainer().getBoundingClientRect().top;
        			// scroll
        			window.scrollBy(0, topAfter - topBefore);
        		};
        	};
        	var MoveDownBlockTune = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Nach unten',
        				icon: '<i class="fas fa-arrow-down"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			// position before movement
        			var topBefore = toolbar.getBlock().getContainer().getBoundingClientRect().top;
        			// move down
        			toolbar.getBlock().moveDown();
        			// position after movement
        			var topAfter = toolbar.getBlock().getContainer().getBoundingClientRect().top;
        			// scroll
        			window.scrollBy(0, topAfter - topBefore);
        		};
        	};
        	var DeleteBlockTune = function(_super, api) {
        		var _this = this,
        			toolbar,
        			confirmationStatus = false;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Löschen',
        				icon: '<i class="fa fa-times"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on close event */
        		_this.onClose = function(event) {
        			confirmationStatus = false;
        			_super.getContainer().classList.remove('button-confirm');
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			if (!confirmationStatus) {
        				confirmationStatus = true;
        				_super.getContainer().classList.add('button-confirm');
        			} else {
        				// delete block
        				toolbar.getBlock().delete();
        			}
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'!@keyframes block-tune-delete-confirm': {
        					'0%': {
        						'transform': 'rotate(0deg)'
        					},
        					'25%': {
        						'transform': 'rotate(2deg)'
        					},
        					'50%': {
        						'transform': 'rotate(0deg)'
        					},
        					'75%': {
        						'transform': 'rotate(-2deg)'
        					},
        					'100%': {
        						'transform': 'rotate(0deg)'
        					}
        				},
        				'': {
        					'transition': 'background-color .1s ease-in-out, color .1s ease-in-out'
        				},
        				'-.button-confirm': {
        					'background-color': '#e24a4a',
        					'color': '#fff',
        					'animation': 'block-tune-delete-confirm ease',
        					'animation-iteration-count': 'infinite',
        					'animation-duration': '.5s',
        					'animation-fill-mode': 'both'
        				}
        			};
        		};
        	};
        	var DuplicateBlockTune = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Duplizieren',
        				icon: '<i class="fa fa-clone"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			// clone block
        			var duplicatedBlock = toolbar.getBlock().clone();
        			// add block to block list
        			toolbar.getBlock().getList().add(duplicatedBlock, toolbar.getBlock().getPosition() + 1);
        			// call instance method
        			api.Functions.trigger(duplicatedBlock.initialize, false, [toolbar.getBlock().getList()]);
        			// custom event "block-added"
        			api.Classes.Core.dispatchEvent('block-added', {
        				detail: {
        					data: duplicatedBlock.getJson(),
        					position: duplicatedBlock.getPosition()
        				},
        				bubbles: true,
        				cancelable: true
        			});
        			// focus block
        			setTimeout(function() {
        				// call instance method
        				api.Functions.trigger(duplicatedBlock.focus, true);
        				// focus auto focus field
        				(function(field) {
        					if (field) {
        						field.focus();
        					}
        				})(duplicatedBlock.getAutoFocusField());
        			}, 1);
        			// scroll to duplicated block
        			//api.Functions.scrollToBlock(duplicatedBlock);
        		};
        	};
        	var NotesBlockTune = function(_super, api) {
        		var _this = this,
        			propName = 'notes',
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Notizen',
        				icon: '<i class="fas fa-comment"></i>',
        				iconNotes: '<i class="fas fa-comment-dots"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        			// instance on opened
        			toolbar.getElement().addEventListener('toolbar-opened', function(event) {
        				var hasNotes = toolbar.getBlock().getProperty(propName);
        				// update toolbar button icon
        				_super.getContainer().innerHTML = _this.settings()['icon' + (hasNotes ? 'Notes' : '')];
        				// update button
        				_super.getContainer().classList[hasNotes ? 'add' : 'remove']('has-notes');
        			});
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			// hide toolbar
        			toolbar.hide();
        			// create modal
        			createModal();
        		};
        	
        		/* create modal */
        		var createModal = function() {
        			// create modal
        			var modal = api.Classes.UI.createModal(),
        				inputElement;
        			// set title
        			modal.setTitle(_super.getName());
        			// clear body
        			modal.clearBody();
        			// create body
        			modal.appendBody((function() {
        				inputElement = UI.createElement('textarea', {className: 'modal-notes-input'});
        				inputElement.setAttribute('placeholder', 'Hier können Notizen eingetragen werden.');
        				inputElement.value = toolbar.getBlock().getProperty(propName, '');
        				inputElement.addEventListener('keyup', function(event) {
        					toolbar.getBlock().setProperty(propName, this.value);
        				});
        				return inputElement;
        			})());
        			// modal opened event
        			modal.addEventListener('opened', function() {
        				// set focus to input field
        				inputElement.focus();
        			});
        			// modal closed event
        			modal.addEventListener('closed', function() {
        				// show toolbar
        				toolbar.show();
        			});
        			// open modal
        			modal.open({
        				closeOnEscape: true
        			});
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'!.modal-notes-input': {
        					'margin': '-15px -36px -17px -15px',
        					'padding': '15px',
        					'width': 'calc(100% + 51px)',
        					'height': '250px',
        					'border': '0'
        				},
        				'-.has-notes': {
        					'color': '#0c8fb9'
        				}
        			};
        		};
        	};
        
        	/* core fields */
        	var ContainerField = function(_super, api) {
        		var _this = this,
        			data,
        			blockList;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				enableLineBreaks: true
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = api.Functions.isArray(_data) ? _data : [];
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			// initialize block list
        			initializeBlockList();
        		};
        	
        		/* initialize block list */
        		var initializeBlockList = function() {
        			// create block container
        			blockList = api.Functions.createClass(api.Classes.BlockList, [_super.getElement(), {
        				onUpdate: function() {
        					//_super.save(false);
        				}
        			}]);
        			// initialize blocks
        			initializeBlocks();
        		};
        	
        		/* initialize blocks */
        		var initializeBlocks = function() {
        			data.forEach(function(blockData) {
        				try {
        					var block = api.Functions.createClass(api.Classes.Block, [], [blockData.type, blockData.fields, api.Classes.Core.extractBlockProperties(blockData)]);
        				} catch (error) {
        					console.error(error.message);
        				}
        				if (block) {
        					blockList.add(block);
        					api.Functions.trigger(block.initialize, false, [blockList]);
        				}
        			});
        		};
        	
        		_this.getData = function() {
        			return blockList.getJson();
        		};
        	
        		_this.getBlockList = function() {
        			return blockList;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'': {
        					'width': '100%',
        					'padding': '7px 0',
        					'border': '1px solid #dbdbe2',
        				},
        				'rp-editor-blocks': {
        					'margin': '0'
        				},
        				'rp-editor-blocks > rp-editor-block': {
        					'margin-left': '10px',
        					'margin-right': '7px'
        				}
        			};
        		};
        	};
        	var TextField = function(_super, api) {
        		var _this = this,
        			data = '';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				inlineTools: true,
        				enableLineBreaks: true
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = api.Functions.isString(_data) ? _data : data;
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			field.setAttributes({
        				'placeholder': 'Text einfügen',
        				'contenteditable': 'true',
        				'spellcheck': 'true'
        			});
        			field.innerHTML = data;
        			field.addEventListener('input', function(event) {
        				_super.save();
        			});
        		};
        	
        		_this.getData = function() {
        			return _super.getElement().innerHTML;
        		};
        	
        		_this.setData = function(data) {
        			_super.getElement().innerHTML = api.Functions.isString(data) ? data : '';
        		};
        	};
        	var HeadingField = function(_super, api) {
        		var _this = this,
        			data = '';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				inlineTools: true,
        				enableLineBreaks: false
        			};
        		};
        	
        		var validateLevel = function(level) {
        			return level ? (level <= 0 ? 1 : (level > 6) ? 6 : level) : 1;
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = api.Functions.isString(_data) ? _data : data;
        			// set properties
        			_super.setSetting('level', validateLevel(_super.getSetting('level')));
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			field.setAttributes({
        				'level': _super.getSetting('level'),
        				'placeholder': 'Überschrift einfügen',
        				'contenteditable': 'true',
        				'spellcheck': 'true'
        			});
        			field.innerHTML = data;
        			field.addEventListener('input', function(event) {
        				_super.save();
        			});
        		};
        	
        		_this.getData = function() {
        			return _super.getElement().innerHTML;
        		};
        	
        		/* render toolbar ui */
        		_this.renderToolbar = function(_Field) {
        			return {
        				'h1': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 1;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 1',
        							icon: '<i class="fas fa-heading">1</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h2', 'h3', 'h4', 'h5', 'h6');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="1"]': {
        								'font-size': '35px'
        							}
        						};
        					};
        				},
        				'h2': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 2;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 2',
        							icon: '<i class="fas fa-heading">2</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h1', 'h3', 'h4', 'h5', 'h6');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="2"]': {
        								'font-size': '30px'
        							}
        						};
        					};
        				},
        				'h3': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 3;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 3',
        							icon: '<i class="fas fa-heading">3</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h1', 'h2', 'h4', 'h5', 'h6');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="3"]': {
        								'font-size': '27px'
        							}
        						};
        					};
        				},
        				'h4': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 4;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 4',
        							icon: '<i class="fas fa-heading">4</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h1', 'h2', 'h3', 'h5', 'h6');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="4"]': {
        								'font-size': '24px'
        							}
        						};
        					};
        				},
        				'h5': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 5;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 5',
        							icon: '<i class="fas fa-heading">5</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h1', 'h2', 'h3', 'h4', 'h6');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="5"]': {
        								'font-size': '21px'
        							}
        						};
        					};
        				},
        				'h6': function(_super, api) {
        					var _this = this,
        						toolbar,
        						level = 6;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Überschrift 6',
        							icon: '<i class="fas fa-heading">6</i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							toolbar.getField().getElement().setAttribute('level', level);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('level', level);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('h1', 'h2', 'h3', 'h4', 'h5');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('level') === level ? true : false;
        					};
        	
        					/* css styles */
        					_this.css = function() {
        						return {
        							'rp-editor-field[level="6"]': {
        								'font-size': '18px'
        							}
        						};
        					};
        				}
        			};
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'': {
        					'line-height': '1'
        				}
        			};
        		};
        	};
        	var ListField = function(_super, api) {
        		var _this = this,
        			data,
        			listElement;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				inlineTools: true,
        				enableLineBreaks: true
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data;
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			field.setAttributes({
        				'spellcheck': 'true'
        			});
        	
        			// list element
        			//listElement = api.Classes.UI.createEditableElement({className: 'list'});
        			listElement = api.Classes.UI.createElement('ul', {contentEditable: true, className: 'list'});
        			field.appendChild(listElement);
        	
        			var items = data || [];
        			if (items.length) {
        				items.forEach(function(item) {
        					listElement.appendChild(createItemElement(item));
        				});
        			} else {
        				listElement.appendChild(createItemElement());
        			}
        	
        			/*field.addEventListener('input', function(event) {
        				event.preventDefault();
        				listElement.querySelectorAll('.list-item').forEach(function(item) {
        					console.log('DD', item.innerHTML);
        					if (item.innerHTML === '<br>') { // item.innerHTML.replace('<br>', '').trim() === ''
        						console.log(item);
        						item.innerHTML = '';
        					}
        				});
        				if (listElement.innerHTML === '') {
        					listElement.appendChild(createItemElement());
        				}
        				_super.save();
        			});*/
        	
        			field.addEventListener('keydown', function(event) {
        				var caretIsAtStart = api.Utilities.Caret.isAtStart({element: field, includeContent: true});
        				if (event.key === 'Backspace' && caretIsAtStart && listElement.childNodes.length === 1 && !field.textContent.trim()) {
        					event.preventDefault();
        				}
        			});
        		};
        	
        		_this.getElement = function() {
        			return listElement;
        		}
        	
        		var createItemElement = function(text) {
        			return api.Classes.UI.createElement('li', {className: 'list-item', innerHTML: (text || '')});
        		};
        	
        		/* render toolbar ui */
        		_this.renderToolbar = function(_Field) {
        			return {
        				unordered: function(_super, api) {
        					var _this = this,
        						toolbar,
        						style = 'unordered';
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'unsortierte Liste',
        							icon: '<i class="fa fa-list-ul"></i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							listElement.setAttribute('list-style', style);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('style', style);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('ordered');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('style', style) === style ? true : false;
        					};
        				},
        				ordered: function(_super, api) {
        					var _this = this,
        						toolbar,
        						style = 'ordered';
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Aufzählungsliste',
        							icon: '<i class="fa fa-list-ol"></i>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							listElement.setAttribute('list-style', style);
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('style', style);
        						// render ui
        						_this.render();
        						// check related tool states
        						toolbar.checkToolState('unordered');
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('style') === style ? true : false;
        					};
        				}
        			};
        		};
        	
        		_this.onAutoFocus = function() {
        			if (listElement.childNodes.length) {
        				Utilities.Caret.setPositionToStart({element: listElement.childNodes[0]});
        			}
        		};
        	
        		_this.getData = function() {
        			var data = [];
        			listElement.querySelectorAll('.list-item').forEach(function(item) {
        				data.push(item.innerHTML);
        			});
        			return data;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'.list': {
        					'width': '100%',
        					'max-width': '100%',
        					'display': 'inline-block'
        				},
        				'.list[list-style="unordered"]': {
        					'list-style-type': 'disc'
        				},
        				'.list[list-style="ordered"]': {
        					'list-style-type': 'decimal'
        				},
        				'.list > .list-item + .list-item': {
        					'margin-top': '10px'
        				}
        			};
        		};
        	};
        	var TableField = function(_super, api) {
        		var _this = this,
        			data,
        			table;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				inlineTools: true,
        				enableLineBreaks: true
        			};
        		};
        	
        		var validateHasHeaderRow = function(hasHeaderRow) {
        			return api.Functions.isBoolean(hasHeaderRow) ? hasHeaderRow : false;
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = _data || [['', '']];
        			// set properties
        			_super.setSetting('hasHeaderRow', validateHasHeaderRow(_super.getSetting('hasHeaderRow')));
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			field.setAttributes({
        				'spellcheck': 'true'
        			});
        			table = new Table(field, data);
        			table.initialize();
        		};
        	
        		/* render toolbar ui */
        		_this.renderToolbar = function(_Field) {
        			return {
        				'has-header-row': function(_super, api) {
        					var _this = this,
        						toolbar;
        	
        					/* settings */
        					_this.settings = function() {
        						return {
        							name: 'Kopfzeile',
        							icon: '<span style="font-size: 60%; font-weight: bold; line-height: 1.2;"><span style="display: block;">HEA</span><span style="display: block;">DER</span></span>'
        						};
        					};
        	
        					/* initialize */
        					_this.initialize = function(_toolbar) {
        						toolbar = _toolbar;
        					};
        	
        					/* render ui */
        					_this.render = function() {
        						if (getState()) {
        							table.getElement().classList.add('table-with-header-row');
        						} else {
        							table.getElement().classList.remove('table-with-header-row');
        						}
        						if (_super.getContainer()) {
        							_super.getContainer().classList.toggle('is-active', getState());
        						}
        					};
        	
        					/* on click event */
        					_this.onClick = function(event) {
        						toolbar.getField().setSetting('hasHeaderRow', !getState());
        						// render ui
        						_this.render();
        					};
        	
        					_this.checkState = function() {
        						// render ui
        						_this.render();
        					};
        	
        					var getState = function() {
        						return toolbar.getField().getSetting('hasHeaderRow') === true ? true : false;
        					};
        				}
        			};
        		};
        	
        		_this.getData = function() {
        			return table.getData();
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'.table-wrapper': {
        					'position': 'relative',
        					'width': '100%'
        				},
        				'.table-wrapper .table': {
        					'width': '100%',
        					'background-color': '#fff',
        					/*'border': '1px solid #dbdbe2',*/
        					'border-collapse': 'collapse'/*,
        					'table-layout': 'fixed'*/
        				},
        				'.table-wrapper .table .table-row .table-cell': {
        					'border': '1px solid #e5e5e5',
        					'padding': '10px',
        					'vertical-align': 'top'
        				},
        				'.table-wrapper .table .table-row:first-child .table-cell': {
        					'border-top': 'none'
        				},
        				'.table-wrapper .table .table-row:last-child .table-cell': {
        					'border-bottom': 'none'
        				},
        				'.table-wrapper .table .table-row .table-cell:first-child': {
        					'border-left': 'none'
        				},
        				'.table-wrapper .table .table-row .table-cell:last-child': {
        					'border-right': 'none'
        				},
        				'.table-wrapper .table:not(.table-with-header-row) .table-row:nth-child(2n-1)': {
        					'background-color': '#f4f4f4'
        				},
        				'.table-wrapper .table.table-with-header-row .table-row:nth-child(2n)': {
        					'background-color': '#f4f4f4'
        				},
        				'.table-wrapper .table.table-with-header-row .table-row:first-child .table-cell': {
        					'background-color': '#7aa814',
        					'color': '#fff',
        					'border-color': '#7aa814',
        					'font-weight': 'bold'
        				},
        				'.table-wrapper .table-toolbar': {
        					'position': 'absolute',
        					'top': '0',
        					'left': '0',
        					'opacity': '0',
        					'transition': 'opacity .25s linear'
        				},
        				'.table-wrapper .table-toolbar:hover': {
        					'opacity': '1'
        				},
        				'.table-wrapper .table-toolbar.hidden': {
        					'display': 'none'
        				},
        				'.table-wrapper .table-toolbar .table-toolbar-line': {
        					'position': 'absolute',
        					'background-color': '#222'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-y': {
        					'transform': 'translateY(-5px)',
        					'width': '100%',
        					'height': '11px'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-y .table-toolbar-line': {
        					'top': '5px',
        					'width': '100%',
        					'height': '1px'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-x': {
        					'transform': 'translateX(-5px)',
        					'width': '11px',
        					'height': '100%'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-x .table-toolbar-line': {
        					'left': '5px',
        					'width': '1px',
        					'height': '100%'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar .table-toolbar-icon': {
        					'position': 'absolute',
        					'display': 'inline-block',
        					'font-size': '20px',
        					'color': '#222',
        					'background-color': '#fff',
        					'line-height': '0',
        					'width': '17px',
        					'height': '20px',
        					'opacity': '.6',
        					'transition': 'opacity .25s linear'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar .table-toolbar-icon:hover': {
        					'opacity': '1',
        					'cursor': 'pointer'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-y .table-toolbar-icon': {
        					'top': '-4px',
        					'left': '50%',
        					'transform': 'translateX(-50%)'
        				},
        				'.table-wrapper .table-toolbar.table-toolbar-x .table-toolbar-icon': {
        					'top': '50%',
        					'left': '-3px',
        					'transform': 'translateY(-50%)'
        				}
        			};
        		};
        	
        		var TableToolbar = function(_type) {
        			var _this = this,
        				type = ['x', 'y'].indexOf(_type) !== -1 ? _type : null,
        				callback = function(){},
        				element,
        				elementLine,
        				elementIcon,
        				index;
        	
        			_this.initialize = function() {
        				if (!type) {
        					throw new Error('TableToolbar::initialize(): invalid type «' + _type + '» (allowed «x» or «y»).');
        				}
        				createElements();
        				// bind events
        				bindEvents();
        			};
        	
        			var createElements = function() {
        				element = api.Classes.UI.createElement('div', {className: 'table-toolbar table-toolbar-' + type + ' hidden'});
        				elementLine = api.Classes.UI.createElement('div', {className: 'table-toolbar-line'});
        				elementIcon = api.Classes.UI.createElement('div', {className: 'table-toolbar-icon', innerHTML: '<i class="fa fa-plus-circle"></i>'});
        				element.appendChild(elementLine);
        				element.appendChild(elementIcon);
        			};
        	
        			/* bind events */
        			var bindEvents = function() {
        				var mouseleaveListener = function(event) {
        					_this.hide();
        				};
        				// editor disabled
        				api.Classes.Core.Config.webcomponent.addEventListener('disabled', function(event) {
        					// if editor is disabled
        					if (event.detail) {
        						// mouseleave
        						mouseleaveListener();
        					}
        				});
        				// mouse leave
        				element.addEventListener('mouseleave', mouseleaveListener);
        				// icon click
        				elementIcon.addEventListener('click', function(event) {
        					var tempIndex = index;
        					_this.hide();
        					callback(tempIndex);
        				});
        			};
        	
        			_this.setRow = function(_row) {
        				row = _row;
        			};
        	
        			_this.hide = function() {
        				index = undefined;
        				element.classList.add('hidden');
        				if (type === 'x') {
        					element.style.left = '';
        				} else if (type === 'y') {
        					element.style.top = '';
        				}
        			};
        	
        			_this.show = function(_index, _position) {
        				index = _index;
        				var position = _position || 0;
        				element.classList.remove('hidden');
        				if (type === 'x') {
        					element.style.left = position + 'px';
        				} else if (type === 'y') {
        					element.style.top = position + 'px';
        				}
        			};
        	
        			_this.onClick = function(_callback) {
        				callback = _callback;
        			};
        	
        			_this.getElement = function() {
        				return element;
        			};
        		};
        	
        		var TableCell = function() {
        			var _this = this,
        				Row,
        				element,
        				input;
        	
        			_this.initialize = function(_Row) {
        				Row = _Row;
        				// render
        				render();
        				// bind events
        				bindEvents();
        			};
        	
        			var render = function() {
        				element = api.Classes.UI.createElement('td', {className: 'table-cell'});
        				input = api.Classes.UI.createEditableElement();
        				element.appendChild(input);
        	
        				Row.getElement().insertBefore(element, Row.getElement().children[_this.getPosition()]);
        			};
        	
        			/* bind events */
        			var bindEvents = function() {
        				// mouse move
        				element.addEventListener('mousemove', function(event) {
        					// if editor is disabled, abort
        					if (api.Classes.Core.isDisabled()) {
        						return;
        					}
        					var padding = 5,
        						rect = element.getBoundingClientRect(),
        						rectTable = Row.getTable().getElement().getBoundingClientRect(),
        						mousePosition = {x: event.clientX - rect.left, y: event.clientY - rect.top};
        	
        					// top
        					if (mousePosition.y <= padding) {
        						Row.getTable().getToolbar().Y.show(Row.getPosition(), rect.top - rectTable.top);
        					}
        					// right
        					if (mousePosition.x >= rect.width - padding) {
        						Row.getTable().getToolbar().X.show(_this.getPosition() + 1, rect.left + rect.width - rectTable.left);
        					}
        					// bottom
        					if (mousePosition.y >= rect.height - padding) {
        						Row.getTable().getToolbar().Y.show(Row.getPosition() + 1, rect.top + rect.height - rectTable.top);
        					}
        					// left
        					if (mousePosition.x <= padding) {
        						Row.getTable().getToolbar().X.show(_this.getPosition(), rect.left - rectTable.left);
        					}
        				});
        	
        				input.addEventListener('input', function(event) {
        					_super.save();
        				});
        			};
        	
        			_this.setData = function(data) {
        				input.innerHTML = api.Functions.isString(data) ? data : '';
        			};
        	
        			_this.getData = function() {
        				return input.innerHTML;
        			};
        	
        			_this.setRow = function(_Row) {
        				Row = _Row;
        			};
        	
        			_this.getRow = function() {
        				return Row;
        			};
        	
        			_this.getPosition = function() {
        				return Row.getCells().indexOf(_this);
        			};
        	
        			_this.getElement = function() {
        				return element;
        			};
        		};
        	
        		var TableRow = function() {
        			var _this = this,
        				Table,
        				element,
        				Cells = [];
        	
        			_this.initialize = function(_Table) {
        				Table = _Table;
        				// render
        				render();
        			};
        	
        			var render = function() {
        				element = api.Classes.UI.createElement('tr', {className: 'table-row'});
        				Table.getElement().insertBefore(element, Table.getElement().children[_this.getPosition()]);
        			};
        	
        			_this.insertCell = function(Cell, position) {
        				if (Cells.indexOf(Cell) === -1) {
        					position = checkPositionParam(position);
        					Cells.splice(position, 0, Cell);
        					return Cell;
        				}
        				return false;
        			};
        	
        			var checkPositionParam = function(position) {
        				var length = _this.getCells().length;
        				if (!Number.isInteger(position) || position > length) {
        					position = length;
        				} else if (position < 0) {
        					position = 0;
        				}
        				return position;
        			};
        	
        			_this.setTable = function(_Table) {
        				Table = _Table;
        			};
        	
        			_this.getTable = function() {
        				return Table;
        			};
        	
        			_this.getPosition = function() {
        				return Table.getRows().indexOf(_this);
        			};
        	
        			_this.getCells = function() {
        				return Cells;
        			};
        	
        			_this.getElement = function() {
        				return element;
        			};
        		};
        	
        		var Table = function(container, data) {
        			var _this = this;
        	
        			var wrapperElement,
        				element,
        				Toolbars = {},
        				Rows = [];
        	
        			_this.initialize = function() {
        				// create toolbars
        				Toolbars = {
        					X: new TableToolbar('x'),
        					Y: new TableToolbar('y')
        				};
        				Toolbars.X.initialize();
        				Toolbars.Y.initialize();
        	
        				// render
        				render();
        	
        				// build table
        				buildTable();
        	
        				// bind events
        				bindEvents();
        			};
        	
        			var render = function() {
        				// create wrapper
        				wrapperElement = api.Classes.UI.createElement('div', {className: 'table-wrapper'});
        	
        				// create table
        				element = api.Classes.UI.createElement('table', {className: 'table'});
        				if (_super.getSetting('hasHeaderRow')) {
        					element.classList.add('table-with-header-row');
        				}
        				wrapperElement.appendChild(element);
        	
        				wrapperElement.appendChild(Toolbars.X.getElement());
        				wrapperElement.appendChild(Toolbars.Y.getElement());
        	
        				// add wrapper to container
        				container.appendChild(wrapperElement);
        			};
        	
        			/* bind events */
        			var bindEvents = function() {
        				Toolbars.X.onClick(function(index) {
        					Rows.forEach(function(Row, i) {
        						var cell = new TableCell();
        						Row.insertCell(cell, index);
        						cell.initialize(Row);
        						if (i === 0) {
        							cell.getElement().focus();
        						}
        					});
        					_super.save();
        				});
        	
        				Toolbars.Y.onClick(function(index) {
        					var row = new TableRow();
        					insertRow(row, index);
        					row.initialize(_this);
        					for (var i = 0; i < _this.getCellLength(); i++) {
        						var cell = new TableCell();
        						row.insertCell(cell);
        						cell.initialize(row);
        						if (i === 0) {
        							cell.getElement().focus();
        						}
        					}
        					_super.save();
        				});
        			};
        	
        			var buildTable = function() {
        				// build rows and cells
        				(function() {
        					if (api.Functions.isArray(data)) {
        						data.forEach(function(rowData, index) {
        							var row = new TableRow();
        							insertRow(row);
        							row.initialize(_this);
        							if (api.Functions.isArray(rowData)) {
        								rowData.forEach(function(cellData) {
        									var cell = new TableCell();
        									row.insertCell(cell);
        									cell.initialize(row);
        									cell.setData(cellData);
        								});
        							}
        						});
        					}
        				})();
        			};
        	
        			var insertRow = function(Row, position) {
        				if (Rows.indexOf(Row) === -1) {
        					position = checkPositionParam(position);
        					Rows.splice(position, 0, Row);
        					return Row;
        				}
        				return false;
        			};
        	
        			var checkPositionParam = function(position) {
        				var length = _this.getRows().length;
        				if (!Number.isInteger(position) || position > length) {
        					position = length;
        				} else if (position < 0) {
        					position = 0;
        				}
        				return position;
        			};
        	
        			_this.getRows = function() {
        				return Rows;
        			};
        	
        			_this.getToolbar = function() {
        				return {
        					get X() { return Toolbars.X; },
        					get Y() { return Toolbars.Y; }
        				};
        			};
        	
        			_this.getCellLength = function() {
        				var i = 0;
        				Rows.forEach(function(Row) {
        					var iCells = Row.getCells().length;
        					if (iCells > i) {
        						i = iCells;
        					}
        				});
        				return i;
        			};
        	
        			_this.getData = function() {
        				var data = [];
        				Rows.forEach(function(Row) {
        					var rowData = [];
        					Row.getCells().forEach(function(Cell) {
        						rowData.push(Cell.getData());
        					});
        					data.push(rowData);
        				});
        				return data;
        			};
        	
        			_this.getElement = function() {
        				return element;
        			};
        		};
        	};
        	var CodeField = function(_super, api) {
        		var _this = this,
        			data = '';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				inlineTools: false,
        				enableLineBreaks: true
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_data) {
        			data = api.Functions.isString(_data) ? _data : data;
        		};
        	
        		/* render ui */
        		_this.render = function(field) {
        			field.setAttributes({
        				'placeholder': 'Code einfügen',
        				'contenteditable': 'true'
        			});
        			field.innerHTML = api.Functions.encodeText(data, true);
        			field.addEventListener('input', function(event) {
        				_super.save();
        			});
        			/* keydown */
        			field.addEventListener('keydown', function(event) {
        				// tab pressed
        				if (event.key === 'Tab') {
        					event.stopImmediatePropagation();
        					event.preventDefault();
        					document.execCommand('insertHTML', false, '&#009');
        				}
        			});
        		};
        	
        		_this.getData = function() {
        			return _super.getElement().innerHTML;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'': {
        					'width': '100%',
        					'padding': '7px 10px',
        					'resize': 'none',
        					'border-radius': '1px',
        					'background-color': '#1e2128',
        					'line-height': '1.5',
        					'letter-spacing': '-0.2px',
        					'color': '#b0b6c4',
        					'overflow': 'hidden',
        					'font-family': 'Verdana',
        					'font-size': '95%',
        					'white-space': 'pre'
        				},
        				'-[placeholder]:empty:before': {
        					'color': '#d1d6e0'
        				}
        			};
        		};
        	};
        
        	/* core inline tools */
        	var TextAlignmentLeftInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			alignment = 'left';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Textausrichtung links',
        				icon: '<i class="fa fa-align-left"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			if (getState()) {
        				toolbar.getField().getElement().removeAttribute('alignment');
        			}
        			_super.getContainer().classList.toggle('is-active', getState());
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			toolbar.getField().removeSetting('alignment');
        			// render ui
        			_this.render();
        			// check related tool states
        			toolbar.checkToolState('text-alignment-center', 'text-alignment-right');
        		};
        	
        		_this.checkState = function() {
        			// render ui
        			_this.render();
        		};
        	
        		var getState = function() {
        			return !toolbar.getField().getSetting('alignment') ? true : false;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'rp-editor-field[alignment="left"]': {
        					'text-align': 'left'
        				}
        			};
        		};
        	};
        	var TextAlignmentCenterInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			alignment = 'center';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Textausrichtung zentriert',
        				icon: '<i class="fa fa-align-center"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			if (getState()) {
        				toolbar.getField().getElement().setAttribute('alignment', alignment);
        			}
        			_super.getContainer().classList.toggle('is-active', getState());
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			if (getState()) {
        				toolbar.getField().removeSetting('alignment');
        			} else {
        				toolbar.getField().setSetting('alignment', alignment);
        			}
        			// render ui
        			_this.render();
        			// check related tool states
        			toolbar.checkToolState('text-alignment-left', 'text-alignment-right');
        		};
        	
        		_this.checkState = function() {
        			// render ui
        			_this.render();
        		};
        	
        		var getState = function() {
        			return toolbar.getField().getSetting('alignment') === alignment ? true : false;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'rp-editor-field[alignment="center"]': {
        					'text-align': 'center'
        				}
        			};
        		};
        	};
        	var TextAlignmentRightInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			alignment = 'right';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Textausrichtung rechts',
        				icon: '<i class="fa fa-align-right"></i>'
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* render ui */
        		_this.render = function() {
        			if (getState()) {
        				toolbar.getField().getElement().setAttribute('alignment', alignment);
        			}
        			_super.getContainer().classList.toggle('is-active', getState());
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			if (getState()) {
        				toolbar.getField().removeSetting('alignment');
        			} else {
        				toolbar.getField().setSetting('alignment', alignment);
        			}
        			// render ui
        			_this.render();
        			// check related tool states
        			toolbar.checkToolState('text-alignment-left', 'text-alignment-center');
        		};
        	
        		_this.checkState = function() {
        			// render ui
        			_this.render();
        		};
        	
        		var getState = function() {
        			return toolbar.getField().getSetting('alignment') === alignment ? true : false;
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'rp-editor-field[alignment="right"]': {
        					'text-align': 'right'
        				}
        			};
        		};
        	};
        	var StrongInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'strong';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Fett',
        				icon: '<i class="fa fa-bold"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				b: tagName,
        				strong: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		_this.checkState = function() {
        			var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        			_super.getContainer().classList.toggle('is-active', state);
        		};
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'rp-editor-field strong': {
        					'font-weight': 'bold'
        				}
        			};
        		};
        	};
        	var ItalicInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'i';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Kursiv',
        				icon: '<i class="fa fa-italic"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				i: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		_this.checkState = function() {
        			var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        			_super.getContainer().classList.toggle('is-active', state);
        		};
        	};
        	var UnderlineInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'u';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Unterstrichen',
        				icon: '<i class="fa fa-underline"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				u: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		_this.checkState = function() {
        			var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        			_super.getContainer().classList.toggle('is-active', state);
        		};
        	};
        	var LinkInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'rp-link';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Link',
        				icon: '<i class="fa fa-link"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				a: {
        					href: 'src',
        					src: true,
        					target: true
        				}
        			};
        		};
        	
        		var AttributeSelect = function(tagElement, attributeName) {
        			var _this = this,
        				element,
        				labelElement,
        				optionElements = {};
        	
        			// render
        			element = api.Classes.UI.createElement('select', {className: 'input input-select'});
        			element.style.width = '250px';
        	
        			element.addEventListener('change', function(event) {
        				event.stopPropagation();
        				var selectedOption = this.value in optionElements ? optionElements[this.value] : null,
        					selectedAttr = selectedOption.getAttribute('attribute-value');
        				if (selectedAttr) {
        					tagElement.setAttribute(attributeName, selectedAttr);
        				} else {
        					tagElement.removeAttribute(attributeName);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        				/*switch (this.value) {
        					case 'yes':
        						tagElement.setAttribute(attributeName, 'new');
        						break;
        					default:
        						tagElement.removeAttribute(attributeName);
        						break;
        				}*/
        			});
        	
        			/* set options */
        			_this.addOption = function(value, label, attributeValue) {
        				if (api.Functions.isString(value) && value) {
        					var element = api.Classes.UI.createElement('option', {value: value});
        					if (!api.Functions.isString(attributeValue)) {
        						attributeValue = value;
        					}
        					element.setAttribute('attribute-value', attributeValue);
        					if (!api.Functions.isString(label) || !label) {
        						label = value;
        					}
        					element.innerHTML = label;
        					optionElements[value] = element;
        				}
        				return _this;
        			};
        	
        			/* set options */
        			_this.setLabel = function(label) {
        				if (api.Functions.isString(label) && label) {
        					labelElement = api.Classes.UI.createElement('label', {innerHTML: label});
        				} else {
        					if (api.Functions.isElement(labelElement)) {
        						labelElement.remove();
        					}
        					labelElement = null;
        				}
        				return _this;
        			};
        	
        			_this.getElement = function() {
        				return element;
        			};
        	
        			_this.appendTo = function(parentElement) {
        				if (api.Functions.isElement(parentElement)) {
        					if (api.Functions.isElement(labelElement)) {
        						parentElement.appendChild(labelElement);
        					}
        					parentElement.appendChild(element);
        					for (var value in optionElements) {
        						if (tagElement.getAttribute(attributeName) === optionElements[value].getAttribute('attribute-value')) {
        							optionElements[value].selected = true;
        						}
        						element.appendChild(optionElements[value]);
        					};
        				}
        				return _this;
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		/* render settings */
        		_this.renderSettings = function(container, isNew) {
        			var tagElement = api.Utilities.Dom.findParentTag(tagName);
        			var createRow = function() {
        				return api.Classes.UI.createElement('div', {className: 'toolbar-popover-row'});
        			};
        			var row1 = createRow();
        			row1.classList.add('no-padding');
        			var row2 = createRow();
        			// create src input field
        			var inputUrl = (function() {
        				var element = api.Classes.UI.createElement('input', {type: 'text', className: 'input input-text no-border', placeholder: 'URL einfügen', value: tagElement.getAttribute('src')});
        				element.addEventListener('keyup', function(event) {
        					event.stopPropagation();
        					if (this.value) {
        						tagElement.setAttribute('src', this.value);
        					} else {
        						tagElement.removeAttribute('src');
        					}
        					// save changes
        					_super.getToolbar().getField().save();
        				});
        				return element;
        			})();
        			// append src input field
        			row1.appendChild(inputUrl);
        			// set autofocus to src input field
        			if (isNew) {
        				setTimeout(function() {
        					inputUrl.focus();
        				}, 1);
        			}
        	
        			// target select field
        			new AttributeSelect(tagElement, 'target')
        				.setLabel('In neuem Tab öffnen?')
        				.addOption('no', 'nein', '')
        				.addOption('yes', 'ja', 'new')
        				.appendTo(row2);
        	
        			// append row 1
        			container.appendChild(row1);
        			// append row 2
        			container.appendChild(row2);
        		};
        	
        		_this.checkState = function() {
        			return api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        		};
        	
        	
        		/* css styles */
        		_this.css = function() {
        			return {
        				'rp-editor-field rp-link': {
        					'color': '#0c8fb9'
        				},
        				'rp-editor-field rp-link:hover': {
        					'color': '#0c8fb9'
        				}
        			};
        		};
        	};
        	var SubInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'sub';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Tiefgestellt',
        				icon: '<i class="fas fa-subscript"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				i: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		_this.checkState = function() {
        			var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        			_super.getContainer().classList.toggle('is-active', state);
        		};
        	};
        	var SupInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar,
        			tagName = 'sup';
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Hochgestellt',
        				icon: '<i class="fas fa-superscript"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				i: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			if (range) {
        				var wrapper = api.Utilities.Dom.findParentTag(tagName);
        				if (wrapper) {
        					unwrap(wrapper);
        				} else {
        					wrap(range);
        				}
        				// save changes
        				_super.getToolbar().getField().save();
        			}
        		};
        	
        		var wrap = function(range) {
        			var el = api.Classes.UI.createElement(tagName);
        			el.appendChild(range.extractContents());
        			range.insertNode(el);
        			api.Utilities.Dom.expandToTag(el);
        		};
        	
        		var unwrap = function(wrapper) {
        			api.Utilities.Dom.expandToTag(wrapper);
        			var sel = api.Utilities.Selection.get();
        			var range = sel.getRangeAt(0);
        			var unwrappedContent = range.extractContents();
        			// remove empty term-tag
        			wrapper.parentNode.removeChild(wrapper);
        			// insert extracted content
        			range.insertNode(unwrappedContent);
        			// restore selection
        			sel.removeAllRanges();
        			sel.addRange(range);
        		};
        	
        		_this.checkState = function() {
        			var state = api.Utilities.Selection.getContentEditableElement() && api.Utilities.Dom.findParentTag(tagName) ? true : false;
        			_super.getContainer().classList.toggle('is-active', state);
        		};
        	};
        	var ShyInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Weiches Trennzeichen',
        				icon: '<i style="font-weight: bold;">shy</i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				i: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			api.Utilities.Selection.delete();
        			range.insertNode(document.createTextNode('\u00AD'));
        			_super.getToolbar().getField().save();
        		};
        	};
        	var NbspInlineTool = function(_super, api) {
        		var _this = this,
        			toolbar;
        	
        		/* settings */
        		_this.settings = function() {
        			return {
        				name: 'Geschütztes Leerzeichen',
        				icon: '<i class="far fa-window-minimize"></i>'
        			};
        		};
        	
        		/* sanitize */
        		_this.sanitize = function() {
        			return {
        				i: {}
        			};
        		};
        	
        		/* initialize */
        		_this.initialize = function(_toolbar) {
        			toolbar = _toolbar;
        		};
        	
        		/* on click event */
        		_this.onClick = function(event) {
        			var range = api.Utilities.Selection.getRange();
        			api.Utilities.Selection.delete();
        			range.insertNode(document.createTextNode('\u00A0'));
        			_super.getToolbar().getField().save();
        		};
        	};
        
        	/* Libraries */
        	var Libraries = {};
        	
        	/* Counter */
        	(function() {
        		Libraries.Counter = window.app.ModalCounter;
        	})();
        	
        	/* Modal */
        	(function() {
        		Libraries.Modal = window.app.Modal;
        	})();
        	
        	/* Sanitizer */
        	(function() {
        		Libraries.Sanitizer = window.app.Sanitizer;
        	})();
        	
        	/* Popper.js */
        	(function() {
        		/**!
        		 * @fileOverview Kickass library to create and place poppers near their reference elements.
        		 * @version 1.16.1
        		 * @license
        		 * Copyright (c) 2016 Federico Zivolo and contributors
        		 *
        		 * Permission is hereby granted, free of charge, to any person obtaining a copy
        		 * of this software and associated documentation files (the "Software"), to deal
        		 * in the Software without restriction, including without limitation the rights
        		 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        		 * copies of the Software, and to permit persons to whom the Software is
        		 * furnished to do so, subject to the following conditions:
        		 *
        		 * The above copyright notice and this permission notice shall be included in all
        		 * copies or substantial portions of the Software.
        		 *
        		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        		 * SOFTWARE.
        		 */
        		(function (global, factory) {
        			typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        			typeof define === 'function' && define.amd ? define(factory) :
        			(global.Popper = factory());
        		}(this, (function () { 'use strict';
        		
        		var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';
        		
        		var timeoutDuration = function () {
        		  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
        		  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
        		    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
        		      return 1;
        		    }
        		  }
        		  return 0;
        		}();
        		
        		function microtaskDebounce(fn) {
        		  var called = false;
        		  return function () {
        		    if (called) {
        		      return;
        		    }
        		    called = true;
        		    window.Promise.resolve().then(function () {
        		      called = false;
        		      fn();
        		    });
        		  };
        		}
        		
        		function taskDebounce(fn) {
        		  var scheduled = false;
        		  return function () {
        		    if (!scheduled) {
        		      scheduled = true;
        		      setTimeout(function () {
        		        scheduled = false;
        		        fn();
        		      }, timeoutDuration);
        		    }
        		  };
        		}
        		
        		var supportsMicroTasks = isBrowser && window.Promise;
        		
        		/**
        		* Create a debounced version of a method, that's asynchronously deferred
        		* but called in the minimum time possible.
        		*
        		* @method
        		* @memberof Popper.Utils
        		* @argument {Function} fn
        		* @returns {Function}
        		*/
        		var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
        		
        		/**
        		 * Check if the given variable is a function
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Any} functionToCheck - variable to check
        		 * @returns {Boolean} answer to: is a function?
        		 */
        		function isFunction(functionToCheck) {
        		  var getType = {};
        		  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        		}
        		
        		/**
        		 * Get CSS computed property of the given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Eement} element
        		 * @argument {String} property
        		 */
        		function getStyleComputedProperty(element, property) {
        		  if (element.nodeType !== 1) {
        		    return [];
        		  }
        		  // NOTE: 1 DOM access here
        		  var window = element.ownerDocument.defaultView;
        		  var css = window.getComputedStyle(element, null);
        		  return property ? css[property] : css;
        		}
        		
        		/**
        		 * Returns the parentNode or the host of the element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @returns {Element} parent
        		 */
        		function getParentNode(element) {
        		  if (element.nodeName === 'HTML') {
        		    return element;
        		  }
        		  return element.parentNode || element.host;
        		}
        		
        		/**
        		 * Returns the scrolling parent of the given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @returns {Element} scroll parent
        		 */
        		function getScrollParent(element) {
        		  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
        		  if (!element) {
        		    return document.body;
        		  }
        		
        		  switch (element.nodeName) {
        		    case 'HTML':
        		    case 'BODY':
        		      return element.ownerDocument.body;
        		    case '#document':
        		      return element.body;
        		  }
        		
        		  // Firefox want us to check `-x` and `-y` variations as well
        		
        		  var _getStyleComputedProp = getStyleComputedProperty(element),
        		      overflow = _getStyleComputedProp.overflow,
        		      overflowX = _getStyleComputedProp.overflowX,
        		      overflowY = _getStyleComputedProp.overflowY;
        		
        		  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
        		    return element;
        		  }
        		
        		  return getScrollParent(getParentNode(element));
        		}
        		
        		/**
        		 * Returns the reference node of the reference object, or the reference object itself.
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
        		 * @returns {Element} parent
        		 */
        		function getReferenceNode(reference) {
        		  return reference && reference.referenceNode ? reference.referenceNode : reference;
        		}
        		
        		var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
        		var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
        		
        		/**
        		 * Determines if the browser is Internet Explorer
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Number} version to check
        		 * @returns {Boolean} isIE
        		 */
        		function isIE(version) {
        		  if (version === 11) {
        		    return isIE11;
        		  }
        		  if (version === 10) {
        		    return isIE10;
        		  }
        		  return isIE11 || isIE10;
        		}
        		
        		/**
        		 * Returns the offset parent of the given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @returns {Element} offset parent
        		 */
        		function getOffsetParent(element) {
        		  if (!element) {
        		    return document.documentElement;
        		  }
        		
        		  var noOffsetParent = isIE(10) ? document.body : null;
        		
        		  // NOTE: 1 DOM access here
        		  var offsetParent = element.offsetParent || null;
        		  // Skip hidden elements which don't have an offsetParent
        		  while (offsetParent === noOffsetParent && element.nextElementSibling) {
        		    offsetParent = (element = element.nextElementSibling).offsetParent;
        		  }
        		
        		  var nodeName = offsetParent && offsetParent.nodeName;
        		
        		  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
        		    return element ? element.ownerDocument.documentElement : document.documentElement;
        		  }
        		
        		  // .offsetParent will return the closest TH, TD or TABLE in case
        		  // no offsetParent is present, I hate this job...
        		  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
        		    return getOffsetParent(offsetParent);
        		  }
        		
        		  return offsetParent;
        		}
        		
        		function isOffsetContainer(element) {
        		  var nodeName = element.nodeName;
        		
        		  if (nodeName === 'BODY') {
        		    return false;
        		  }
        		  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
        		}
        		
        		/**
        		 * Finds the root node (document, shadowDOM root) of the given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} node
        		 * @returns {Element} root node
        		 */
        		function getRoot(node) {
        		  if (node.parentNode !== null) {
        		    return getRoot(node.parentNode);
        		  }
        		
        		  return node;
        		}
        		
        		/**
        		 * Finds the offset parent common to the two provided nodes
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element1
        		 * @argument {Element} element2
        		 * @returns {Element} common offset parent
        		 */
        		function findCommonOffsetParent(element1, element2) {
        		  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
        		  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
        		    return document.documentElement;
        		  }
        		
        		  // Here we make sure to give as "start" the element that comes first in the DOM
        		  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
        		  var start = order ? element1 : element2;
        		  var end = order ? element2 : element1;
        		
        		  // Get common ancestor container
        		  var range = document.createRange();
        		  range.setStart(start, 0);
        		  range.setEnd(end, 0);
        		  var commonAncestorContainer = range.commonAncestorContainer;
        		
        		  // Both nodes are inside #document
        		
        		  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
        		    if (isOffsetContainer(commonAncestorContainer)) {
        		      return commonAncestorContainer;
        		    }
        		
        		    return getOffsetParent(commonAncestorContainer);
        		  }
        		
        		  // one of the nodes is inside shadowDOM, find which one
        		  var element1root = getRoot(element1);
        		  if (element1root.host) {
        		    return findCommonOffsetParent(element1root.host, element2);
        		  } else {
        		    return findCommonOffsetParent(element1, getRoot(element2).host);
        		  }
        		}
        		
        		/**
        		 * Gets the scroll value of the given element in the given side (top and left)
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @argument {String} side `top` or `left`
        		 * @returns {number} amount of scrolled pixels
        		 */
        		function getScroll(element) {
        		  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
        		
        		  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
        		  var nodeName = element.nodeName;
        		
        		  if (nodeName === 'BODY' || nodeName === 'HTML') {
        		    var html = element.ownerDocument.documentElement;
        		    var scrollingElement = element.ownerDocument.scrollingElement || html;
        		    return scrollingElement[upperSide];
        		  }
        		
        		  return element[upperSide];
        		}
        		
        		/*
        		 * Sum or subtract the element scroll values (left and top) from a given rect object
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Object} rect - Rect object you want to change
        		 * @param {HTMLElement} element - The element from the function reads the scroll values
        		 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
        		 * @return {Object} rect - The modifier rect object
        		 */
        		function includeScroll(rect, element) {
        		  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        		
        		  var scrollTop = getScroll(element, 'top');
        		  var scrollLeft = getScroll(element, 'left');
        		  var modifier = subtract ? -1 : 1;
        		  rect.top += scrollTop * modifier;
        		  rect.bottom += scrollTop * modifier;
        		  rect.left += scrollLeft * modifier;
        		  rect.right += scrollLeft * modifier;
        		  return rect;
        		}
        		
        		/*
        		 * Helper to detect borders of a given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {CSSStyleDeclaration} styles
        		 * Result of `getStyleComputedProperty` on the given element
        		 * @param {String} axis - `x` or `y`
        		 * @return {number} borders - The borders size of the given axis
        		 */
        		
        		function getBordersSize(styles, axis) {
        		  var sideA = axis === 'x' ? 'Left' : 'Top';
        		  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';
        		
        		  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
        		}
        		
        		function getSize(axis, body, html, computedStyle) {
        		  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
        		}
        		
        		function getWindowSizes(document) {
        		  var body = document.body;
        		  var html = document.documentElement;
        		  var computedStyle = isIE(10) && getComputedStyle(html);
        		
        		  return {
        		    height: getSize('Height', body, html, computedStyle),
        		    width: getSize('Width', body, html, computedStyle)
        		  };
        		}
        		
        		var classCallCheck = function (instance, Constructor) {
        		  if (!(instance instanceof Constructor)) {
        		    throw new TypeError("Cannot call a class as a function");
        		  }
        		};
        		
        		var createClass = function () {
        		  function defineProperties(target, props) {
        		    for (var i = 0; i < props.length; i++) {
        		      var descriptor = props[i];
        		      descriptor.enumerable = descriptor.enumerable || false;
        		      descriptor.configurable = true;
        		      if ("value" in descriptor) descriptor.writable = true;
        		      Object.defineProperty(target, descriptor.key, descriptor);
        		    }
        		  }
        		
        		  return function (Constructor, protoProps, staticProps) {
        		    if (protoProps) defineProperties(Constructor.prototype, protoProps);
        		    if (staticProps) defineProperties(Constructor, staticProps);
        		    return Constructor;
        		  };
        		}();
        		
        		
        		
        		
        		
        		var defineProperty = function (obj, key, value) {
        		  if (key in obj) {
        		    Object.defineProperty(obj, key, {
        		      value: value,
        		      enumerable: true,
        		      configurable: true,
        		      writable: true
        		    });
        		  } else {
        		    obj[key] = value;
        		  }
        		
        		  return obj;
        		};
        		
        		var _extends = Object.assign || function (target) {
        		  for (var i = 1; i < arguments.length; i++) {
        		    var source = arguments[i];
        		
        		    for (var key in source) {
        		      if (Object.prototype.hasOwnProperty.call(source, key)) {
        		        target[key] = source[key];
        		      }
        		    }
        		  }
        		
        		  return target;
        		};
        		
        		/**
        		 * Given element offsets, generate an output similar to getBoundingClientRect
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Object} offsets
        		 * @returns {Object} ClientRect like output
        		 */
        		function getClientRect(offsets) {
        		  return _extends({}, offsets, {
        		    right: offsets.left + offsets.width,
        		    bottom: offsets.top + offsets.height
        		  });
        		}
        		
        		/**
        		 * Get bounding client rect of given element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {HTMLElement} element
        		 * @return {Object} client rect
        		 */
        		function getBoundingClientRect(element) {
        		  var rect = {};
        		
        		  // IE10 10 FIX: Please, don't ask, the element isn't
        		  // considered in DOM in some circumstances...
        		  // This isn't reproducible in IE10 compatibility mode of IE11
        		  try {
        		    if (isIE(10)) {
        		      rect = element.getBoundingClientRect();
        		      var scrollTop = getScroll(element, 'top');
        		      var scrollLeft = getScroll(element, 'left');
        		      rect.top += scrollTop;
        		      rect.left += scrollLeft;
        		      rect.bottom += scrollTop;
        		      rect.right += scrollLeft;
        		    } else {
        		      rect = element.getBoundingClientRect();
        		    }
        		  } catch (e) {}
        		
        		  var result = {
        		    left: rect.left,
        		    top: rect.top,
        		    width: rect.right - rect.left,
        		    height: rect.bottom - rect.top
        		  };
        		
        		  // subtract scrollbar size from sizes
        		  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
        		  var width = sizes.width || element.clientWidth || result.width;
        		  var height = sizes.height || element.clientHeight || result.height;
        		
        		  var horizScrollbar = element.offsetWidth - width;
        		  var vertScrollbar = element.offsetHeight - height;
        		
        		  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
        		  // we make this check conditional for performance reasons
        		  if (horizScrollbar || vertScrollbar) {
        		    var styles = getStyleComputedProperty(element);
        		    horizScrollbar -= getBordersSize(styles, 'x');
        		    vertScrollbar -= getBordersSize(styles, 'y');
        		
        		    result.width -= horizScrollbar;
        		    result.height -= vertScrollbar;
        		  }
        		
        		  return getClientRect(result);
        		}
        		
        		function getOffsetRectRelativeToArbitraryNode(children, parent) {
        		  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        		
        		  var isIE10 = isIE(10);
        		  var isHTML = parent.nodeName === 'HTML';
        		  var childrenRect = getBoundingClientRect(children);
        		  var parentRect = getBoundingClientRect(parent);
        		  var scrollParent = getScrollParent(children);
        		
        		  var styles = getStyleComputedProperty(parent);
        		  var borderTopWidth = parseFloat(styles.borderTopWidth);
        		  var borderLeftWidth = parseFloat(styles.borderLeftWidth);
        		
        		  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
        		  if (fixedPosition && isHTML) {
        		    parentRect.top = Math.max(parentRect.top, 0);
        		    parentRect.left = Math.max(parentRect.left, 0);
        		  }
        		  var offsets = getClientRect({
        		    top: childrenRect.top - parentRect.top - borderTopWidth,
        		    left: childrenRect.left - parentRect.left - borderLeftWidth,
        		    width: childrenRect.width,
        		    height: childrenRect.height
        		  });
        		  offsets.marginTop = 0;
        		  offsets.marginLeft = 0;
        		
        		  // Subtract margins of documentElement in case it's being used as parent
        		  // we do this only on HTML because it's the only element that behaves
        		  // differently when margins are applied to it. The margins are included in
        		  // the box of the documentElement, in the other cases not.
        		  if (!isIE10 && isHTML) {
        		    var marginTop = parseFloat(styles.marginTop);
        		    var marginLeft = parseFloat(styles.marginLeft);
        		
        		    offsets.top -= borderTopWidth - marginTop;
        		    offsets.bottom -= borderTopWidth - marginTop;
        		    offsets.left -= borderLeftWidth - marginLeft;
        		    offsets.right -= borderLeftWidth - marginLeft;
        		
        		    // Attach marginTop and marginLeft because in some circumstances we may need them
        		    offsets.marginTop = marginTop;
        		    offsets.marginLeft = marginLeft;
        		  }
        		
        		  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
        		    offsets = includeScroll(offsets, parent);
        		  }
        		
        		  return offsets;
        		}
        		
        		function getViewportOffsetRectRelativeToArtbitraryNode(element) {
        		  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        		
        		  var html = element.ownerDocument.documentElement;
        		  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
        		  var width = Math.max(html.clientWidth, window.innerWidth || 0);
        		  var height = Math.max(html.clientHeight, window.innerHeight || 0);
        		
        		  var scrollTop = !excludeScroll ? getScroll(html) : 0;
        		  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;
        		
        		  var offset = {
        		    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
        		    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
        		    width: width,
        		    height: height
        		  };
        		
        		  return getClientRect(offset);
        		}
        		
        		/**
        		 * Check if the given element is fixed or is inside a fixed parent
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @argument {Element} customContainer
        		 * @returns {Boolean} answer to "isFixed?"
        		 */
        		function isFixed(element) {
        		  var nodeName = element.nodeName;
        		  if (nodeName === 'BODY' || nodeName === 'HTML') {
        		    return false;
        		  }
        		  if (getStyleComputedProperty(element, 'position') === 'fixed') {
        		    return true;
        		  }
        		  var parentNode = getParentNode(element);
        		  if (!parentNode) {
        		    return false;
        		  }
        		  return isFixed(parentNode);
        		}
        		
        		/**
        		 * Finds the first parent of an element that has a transformed property defined
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @returns {Element} first transformed parent or documentElement
        		 */
        		
        		function getFixedPositionOffsetParent(element) {
        		  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
        		  if (!element || !element.parentElement || isIE()) {
        		    return document.documentElement;
        		  }
        		  var el = element.parentElement;
        		  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
        		    el = el.parentElement;
        		  }
        		  return el || document.documentElement;
        		}
        		
        		/**
        		 * Computed the boundaries limits and return them
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {HTMLElement} popper
        		 * @param {HTMLElement} reference
        		 * @param {number} padding
        		 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
        		 * @param {Boolean} fixedPosition - Is in fixed position mode
        		 * @returns {Object} Coordinates of the boundaries
        		 */
        		function getBoundaries(popper, reference, padding, boundariesElement) {
        		  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        		
        		  // NOTE: 1 DOM access here
        		
        		  var boundaries = { top: 0, left: 0 };
        		  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
        		
        		  // Handle viewport case
        		  if (boundariesElement === 'viewport') {
        		    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
        		  } else {
        		    // Handle other cases based on DOM element used as boundaries
        		    var boundariesNode = void 0;
        		    if (boundariesElement === 'scrollParent') {
        		      boundariesNode = getScrollParent(getParentNode(reference));
        		      if (boundariesNode.nodeName === 'BODY') {
        		        boundariesNode = popper.ownerDocument.documentElement;
        		      }
        		    } else if (boundariesElement === 'window') {
        		      boundariesNode = popper.ownerDocument.documentElement;
        		    } else {
        		      boundariesNode = boundariesElement;
        		    }
        		
        		    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);
        		
        		    // In case of HTML, we need a different computation
        		    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        		      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
        		          height = _getWindowSizes.height,
        		          width = _getWindowSizes.width;
        		
        		      boundaries.top += offsets.top - offsets.marginTop;
        		      boundaries.bottom = height + offsets.top;
        		      boundaries.left += offsets.left - offsets.marginLeft;
        		      boundaries.right = width + offsets.left;
        		    } else {
        		      // for all the other DOM elements, this one is good
        		      boundaries = offsets;
        		    }
        		  }
        		
        		  // Add paddings
        		  padding = padding || 0;
        		  var isPaddingNumber = typeof padding === 'number';
        		  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
        		  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
        		  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
        		  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
        		
        		  return boundaries;
        		}
        		
        		function getArea(_ref) {
        		  var width = _ref.width,
        		      height = _ref.height;
        		
        		  return width * height;
        		}
        		
        		/**
        		 * Utility used to transform the `auto` placement to the placement with more
        		 * available space.
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
        		  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        		
        		  if (placement.indexOf('auto') === -1) {
        		    return placement;
        		  }
        		
        		  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
        		
        		  var rects = {
        		    top: {
        		      width: boundaries.width,
        		      height: refRect.top - boundaries.top
        		    },
        		    right: {
        		      width: boundaries.right - refRect.right,
        		      height: boundaries.height
        		    },
        		    bottom: {
        		      width: boundaries.width,
        		      height: boundaries.bottom - refRect.bottom
        		    },
        		    left: {
        		      width: refRect.left - boundaries.left,
        		      height: boundaries.height
        		    }
        		  };
        		
        		  var sortedAreas = Object.keys(rects).map(function (key) {
        		    return _extends({
        		      key: key
        		    }, rects[key], {
        		      area: getArea(rects[key])
        		    });
        		  }).sort(function (a, b) {
        		    return b.area - a.area;
        		  });
        		
        		  var filteredAreas = sortedAreas.filter(function (_ref2) {
        		    var width = _ref2.width,
        		        height = _ref2.height;
        		    return width >= popper.clientWidth && height >= popper.clientHeight;
        		  });
        		
        		  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
        		
        		  var variation = placement.split('-')[1];
        		
        		  return computedPlacement + (variation ? '-' + variation : '');
        		}
        		
        		/**
        		 * Get offsets to the reference element
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Object} state
        		 * @param {Element} popper - the popper element
        		 * @param {Element} reference - the reference element (the popper will be relative to this)
        		 * @param {Element} fixedPosition - is in fixed position mode
        		 * @returns {Object} An object containing the offsets which will be applied to the popper
        		 */
        		function getReferenceOffsets(state, popper, reference) {
        		  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        		
        		  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
        		  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
        		}
        		
        		/**
        		 * Get the outer sizes of the given element (offset size + margins)
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element
        		 * @returns {Object} object containing width and height properties
        		 */
        		function getOuterSizes(element) {
        		  var window = element.ownerDocument.defaultView;
        		  var styles = window.getComputedStyle(element);
        		  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
        		  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
        		  var result = {
        		    width: element.offsetWidth + y,
        		    height: element.offsetHeight + x
        		  };
        		  return result;
        		}
        		
        		/**
        		 * Get the opposite placement of the given one
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {String} placement
        		 * @returns {String} flipped placement
        		 */
        		function getOppositePlacement(placement) {
        		  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
        		  return placement.replace(/left|right|bottom|top/g, function (matched) {
        		    return hash[matched];
        		  });
        		}
        		
        		/**
        		 * Get offsets to the popper
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Object} position - CSS position the Popper will get applied
        		 * @param {HTMLElement} popper - the popper element
        		 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
        		 * @param {String} placement - one of the valid placement options
        		 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
        		 */
        		function getPopperOffsets(popper, referenceOffsets, placement) {
        		  placement = placement.split('-')[0];
        		
        		  // Get popper node sizes
        		  var popperRect = getOuterSizes(popper);
        		
        		  // Add position, width and height to our offsets object
        		  var popperOffsets = {
        		    width: popperRect.width,
        		    height: popperRect.height
        		  };
        		
        		  // depending by the popper placement we have to compute its offsets slightly differently
        		  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
        		  var mainSide = isHoriz ? 'top' : 'left';
        		  var secondarySide = isHoriz ? 'left' : 'top';
        		  var measurement = isHoriz ? 'height' : 'width';
        		  var secondaryMeasurement = !isHoriz ? 'height' : 'width';
        		
        		  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
        		  if (placement === secondarySide) {
        		    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
        		  } else {
        		    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
        		  }
        		
        		  return popperOffsets;
        		}
        		
        		/**
        		 * Mimics the `find` method of Array
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Array} arr
        		 * @argument prop
        		 * @argument value
        		 * @returns index or -1
        		 */
        		function find(arr, check) {
        		  // use native find if supported
        		  if (Array.prototype.find) {
        		    return arr.find(check);
        		  }
        		
        		  // use `filter` to obtain the same behavior of `find`
        		  return arr.filter(check)[0];
        		}
        		
        		/**
        		 * Return the index of the matching object
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Array} arr
        		 * @argument prop
        		 * @argument value
        		 * @returns index or -1
        		 */
        		function findIndex(arr, prop, value) {
        		  // use native findIndex if supported
        		  if (Array.prototype.findIndex) {
        		    return arr.findIndex(function (cur) {
        		      return cur[prop] === value;
        		    });
        		  }
        		
        		  // use `find` + `indexOf` if `findIndex` isn't supported
        		  var match = find(arr, function (obj) {
        		    return obj[prop] === value;
        		  });
        		  return arr.indexOf(match);
        		}
        		
        		/**
        		 * Loop trough the list of modifiers and run them in order,
        		 * each of them will then edit the data object.
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {dataObject} data
        		 * @param {Array} modifiers
        		 * @param {String} ends - Optional modifier name used as stopper
        		 * @returns {dataObject}
        		 */
        		function runModifiers(modifiers, data, ends) {
        		  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));
        		
        		  modifiersToRun.forEach(function (modifier) {
        		    if (modifier['function']) {
        		      // eslint-disable-line dot-notation
        		      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
        		    }
        		    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
        		    if (modifier.enabled && isFunction(fn)) {
        		      // Add properties to offsets to make them a complete clientRect object
        		      // we do this before each modifier to make sure the previous one doesn't
        		      // mess with these values
        		      data.offsets.popper = getClientRect(data.offsets.popper);
        		      data.offsets.reference = getClientRect(data.offsets.reference);
        		
        		      data = fn(data, modifier);
        		    }
        		  });
        		
        		  return data;
        		}
        		
        		/**
        		 * Updates the position of the popper, computing the new offsets and applying
        		 * the new style.<br />
        		 * Prefer `scheduleUpdate` over `update` because of performance reasons.
        		 * @method
        		 * @memberof Popper
        		 */
        		function update() {
        		  // if popper is destroyed, don't perform any further update
        		  if (this.state.isDestroyed) {
        		    return;
        		  }
        		
        		  var data = {
        		    instance: this,
        		    styles: {},
        		    arrowStyles: {},
        		    attributes: {},
        		    flipped: false,
        		    offsets: {}
        		  };
        		
        		  // compute reference element offsets
        		  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);
        		
        		  // compute auto placement, store placement inside the data object,
        		  // modifiers will be able to edit `placement` if needed
        		  // and refer to originalPlacement to know the original value
        		  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);
        		
        		  // store the computed placement inside `originalPlacement`
        		  data.originalPlacement = data.placement;
        		
        		  data.positionFixed = this.options.positionFixed;
        		
        		  // compute the popper offsets
        		  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
        		
        		  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';
        		
        		  // run the modifiers
        		  data = runModifiers(this.modifiers, data);
        		
        		  // the first `update` will call `onCreate` callback
        		  // the other ones will call `onUpdate` callback
        		  if (!this.state.isCreated) {
        		    this.state.isCreated = true;
        		    this.options.onCreate(data);
        		  } else {
        		    this.options.onUpdate(data);
        		  }
        		}
        		
        		/**
        		 * Helper used to know if the given modifier is enabled.
        		 * @method
        		 * @memberof Popper.Utils
        		 * @returns {Boolean}
        		 */
        		function isModifierEnabled(modifiers, modifierName) {
        		  return modifiers.some(function (_ref) {
        		    var name = _ref.name,
        		        enabled = _ref.enabled;
        		    return enabled && name === modifierName;
        		  });
        		}
        		
        		/**
        		 * Get the prefixed supported property name
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {String} property (camelCase)
        		 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
        		 */
        		function getSupportedPropertyName(property) {
        		  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
        		  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);
        		
        		  for (var i = 0; i < prefixes.length; i++) {
        		    var prefix = prefixes[i];
        		    var toCheck = prefix ? '' + prefix + upperProp : property;
        		    if (typeof document.body.style[toCheck] !== 'undefined') {
        		      return toCheck;
        		    }
        		  }
        		  return null;
        		}
        		
        		/**
        		 * Destroys the popper.
        		 * @method
        		 * @memberof Popper
        		 */
        		function destroy() {
        		  this.state.isDestroyed = true;
        		
        		  // touch DOM only if `applyStyle` modifier is enabled
        		  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
        		    this.popper.removeAttribute('x-placement');
        		    this.popper.style.position = '';
        		    this.popper.style.top = '';
        		    this.popper.style.left = '';
        		    this.popper.style.right = '';
        		    this.popper.style.bottom = '';
        		    this.popper.style.willChange = '';
        		    this.popper.style[getSupportedPropertyName('transform')] = '';
        		  }
        		
        		  this.disableEventListeners();
        		
        		  // remove the popper if user explicitly asked for the deletion on destroy
        		  // do not use `remove` because IE11 doesn't support it
        		  if (this.options.removeOnDestroy) {
        		    this.popper.parentNode.removeChild(this.popper);
        		  }
        		  return this;
        		}
        		
        		/**
        		 * Get the window associated with the element
        		 * @argument {Element} element
        		 * @returns {Window}
        		 */
        		function getWindow(element) {
        		  var ownerDocument = element.ownerDocument;
        		  return ownerDocument ? ownerDocument.defaultView : window;
        		}
        		
        		function attachToScrollParents(scrollParent, event, callback, scrollParents) {
        		  var isBody = scrollParent.nodeName === 'BODY';
        		  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
        		  target.addEventListener(event, callback, { passive: true });
        		
        		  if (!isBody) {
        		    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
        		  }
        		  scrollParents.push(target);
        		}
        		
        		/**
        		 * Setup needed event listeners used to update the popper position
        		 * @method
        		 * @memberof Popper.Utils
        		 * @private
        		 */
        		function setupEventListeners(reference, options, state, updateBound) {
        		  // Resize event listener on window
        		  state.updateBound = updateBound;
        		  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });
        		
        		  // Scroll event listener on scroll parents
        		  var scrollElement = getScrollParent(reference);
        		  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
        		  state.scrollElement = scrollElement;
        		  state.eventsEnabled = true;
        		
        		  return state;
        		}
        		
        		/**
        		 * It will add resize/scroll events and start recalculating
        		 * position of the popper element when they are triggered.
        		 * @method
        		 * @memberof Popper
        		 */
        		function enableEventListeners() {
        		  if (!this.state.eventsEnabled) {
        		    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
        		  }
        		}
        		
        		/**
        		 * Remove event listeners used to update the popper position
        		 * @method
        		 * @memberof Popper.Utils
        		 * @private
        		 */
        		function removeEventListeners(reference, state) {
        		  // Remove resize event listener on window
        		  getWindow(reference).removeEventListener('resize', state.updateBound);
        		
        		  // Remove scroll event listener on scroll parents
        		  state.scrollParents.forEach(function (target) {
        		    target.removeEventListener('scroll', state.updateBound);
        		  });
        		
        		  // Reset state
        		  state.updateBound = null;
        		  state.scrollParents = [];
        		  state.scrollElement = null;
        		  state.eventsEnabled = false;
        		  return state;
        		}
        		
        		/**
        		 * It will remove resize/scroll events and won't recalculate popper position
        		 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
        		 * unless you call `update` method manually.
        		 * @method
        		 * @memberof Popper
        		 */
        		function disableEventListeners() {
        		  if (this.state.eventsEnabled) {
        		    cancelAnimationFrame(this.scheduleUpdate);
        		    this.state = removeEventListeners(this.reference, this.state);
        		  }
        		}
        		
        		/**
        		 * Tells if a given input is a number
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {*} input to check
        		 * @return {Boolean}
        		 */
        		function isNumeric(n) {
        		  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
        		}
        		
        		/**
        		 * Set the style to the given popper
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element - Element to apply the style to
        		 * @argument {Object} styles
        		 * Object with a list of properties and values which will be applied to the element
        		 */
        		function setStyles(element, styles) {
        		  Object.keys(styles).forEach(function (prop) {
        		    var unit = '';
        		    // add unit if the value is numeric and is one of the following
        		    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        		      unit = 'px';
        		    }
        		    element.style[prop] = styles[prop] + unit;
        		  });
        		}
        		
        		/**
        		 * Set the attributes to the given popper
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {Element} element - Element to apply the attributes to
        		 * @argument {Object} styles
        		 * Object with a list of properties and values which will be applied to the element
        		 */
        		function setAttributes(element, attributes) {
        		  Object.keys(attributes).forEach(function (prop) {
        		    var value = attributes[prop];
        		    if (value !== false) {
        		      element.setAttribute(prop, attributes[prop]);
        		    } else {
        		      element.removeAttribute(prop);
        		    }
        		  });
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Object} data.styles - List of style properties - values to apply to popper element
        		 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The same data object
        		 */
        		function applyStyle(data) {
        		  // any property present in `data.styles` will be applied to the popper,
        		  // in this way we can make the 3rd party modifiers add custom styles to it
        		  // Be aware, modifiers could override the properties defined in the previous
        		  // lines of this modifier!
        		  setStyles(data.instance.popper, data.styles);
        		
        		  // any property present in `data.attributes` will be applied to the popper,
        		  // they will be set as HTML attributes of the element
        		  setAttributes(data.instance.popper, data.attributes);
        		
        		  // if arrowElement is defined and arrowStyles has some properties
        		  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
        		    setStyles(data.arrowElement, data.arrowStyles);
        		  }
        		
        		  return data;
        		}
        		
        		/**
        		 * Set the x-placement attribute before everything else because it could be used
        		 * to add margins to the popper margins needs to be calculated to get the
        		 * correct popper offsets.
        		 * @method
        		 * @memberof Popper.modifiers
        		 * @param {HTMLElement} reference - The reference element used to position the popper
        		 * @param {HTMLElement} popper - The HTML element used as popper
        		 * @param {Object} options - Popper.js options
        		 */
        		function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
        		  // compute reference element offsets
        		  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);
        		
        		  // compute auto placement, store placement inside the data object,
        		  // modifiers will be able to edit `placement` if needed
        		  // and refer to originalPlacement to know the original value
        		  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
        		
        		  popper.setAttribute('x-placement', placement);
        		
        		  // Apply `position` to popper before anything else because
        		  // without the position applied we can't guarantee correct computations
        		  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });
        		
        		  return options;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Popper.Utils
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
        		 * @returns {Object} The popper's position offsets rounded
        		 *
        		 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
        		 * good as it can be within reason.
        		 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
        		 *
        		 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
        		 * as well on High DPI screens).
        		 *
        		 * Firefox prefers no rounding for positioning and does not have blurriness on
        		 * high DPI screens.
        		 *
        		 * Only horizontal placement and left/right values need to be considered.
        		 */
        		function getRoundedOffsets(data, shouldRound) {
        		  var _data$offsets = data.offsets,
        		      popper = _data$offsets.popper,
        		      reference = _data$offsets.reference;
        		  var round = Math.round,
        		      floor = Math.floor;
        		
        		  var noRound = function noRound(v) {
        		    return v;
        		  };
        		
        		  var referenceWidth = round(reference.width);
        		  var popperWidth = round(popper.width);
        		
        		  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
        		  var isVariation = data.placement.indexOf('-') !== -1;
        		  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
        		  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
        		
        		  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
        		  var verticalToInteger = !shouldRound ? noRound : round;
        		
        		  return {
        		    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
        		    top: verticalToInteger(popper.top),
        		    bottom: verticalToInteger(popper.bottom),
        		    right: horizontalToInteger(popper.right)
        		  };
        		}
        		
        		var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function computeStyle(data, options) {
        		  var x = options.x,
        		      y = options.y;
        		  var popper = data.offsets.popper;
        		
        		  // Remove this legacy support in Popper.js v2
        		
        		  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
        		    return modifier.name === 'applyStyle';
        		  }).gpuAcceleration;
        		  if (legacyGpuAccelerationOption !== undefined) {
        		    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
        		  }
        		  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;
        		
        		  var offsetParent = getOffsetParent(data.instance.popper);
        		  var offsetParentRect = getBoundingClientRect(offsetParent);
        		
        		  // Styles
        		  var styles = {
        		    position: popper.position
        		  };
        		
        		  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);
        		
        		  var sideA = x === 'bottom' ? 'top' : 'bottom';
        		  var sideB = y === 'right' ? 'left' : 'right';
        		
        		  // if gpuAcceleration is set to `true` and transform is supported,
        		  //  we use `translate3d` to apply the position to the popper we
        		  // automatically use the supported prefixed version if needed
        		  var prefixedProperty = getSupportedPropertyName('transform');
        		
        		  // now, let's make a step back and look at this code closely (wtf?)
        		  // If the content of the popper grows once it's been positioned, it
        		  // may happen that the popper gets misplaced because of the new content
        		  // overflowing its reference element
        		  // To avoid this problem, we provide two options (x and y), which allow
        		  // the consumer to define the offset origin.
        		  // If we position a popper on top of a reference element, we can set
        		  // `x` to `top` to make the popper grow towards its top instead of
        		  // its bottom.
        		  var left = void 0,
        		      top = void 0;
        		  if (sideA === 'bottom') {
        		    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
        		    // and not the bottom of the html element
        		    if (offsetParent.nodeName === 'HTML') {
        		      top = -offsetParent.clientHeight + offsets.bottom;
        		    } else {
        		      top = -offsetParentRect.height + offsets.bottom;
        		    }
        		  } else {
        		    top = offsets.top;
        		  }
        		  if (sideB === 'right') {
        		    if (offsetParent.nodeName === 'HTML') {
        		      left = -offsetParent.clientWidth + offsets.right;
        		    } else {
        		      left = -offsetParentRect.width + offsets.right;
        		    }
        		  } else {
        		    left = offsets.left;
        		  }
        		  if (gpuAcceleration && prefixedProperty) {
        		    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
        		    styles[sideA] = 0;
        		    styles[sideB] = 0;
        		    styles.willChange = 'transform';
        		  } else {
        		    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
        		    var invertTop = sideA === 'bottom' ? -1 : 1;
        		    var invertLeft = sideB === 'right' ? -1 : 1;
        		    styles[sideA] = top * invertTop;
        		    styles[sideB] = left * invertLeft;
        		    styles.willChange = sideA + ', ' + sideB;
        		  }
        		
        		  // Attributes
        		  var attributes = {
        		    'x-placement': data.placement
        		  };
        		
        		  // Update `data` attributes, styles and arrowStyles
        		  data.attributes = _extends({}, attributes, data.attributes);
        		  data.styles = _extends({}, styles, data.styles);
        		  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
        		
        		  return data;
        		}
        		
        		/**
        		 * Helper used to know if the given modifier depends from another one.<br />
        		 * It checks if the needed modifier is listed and enabled.
        		 * @method
        		 * @memberof Popper.Utils
        		 * @param {Array} modifiers - list of modifiers
        		 * @param {String} requestingName - name of requesting modifier
        		 * @param {String} requestedName - name of requested modifier
        		 * @returns {Boolean}
        		 */
        		function isModifierRequired(modifiers, requestingName, requestedName) {
        		  var requesting = find(modifiers, function (_ref) {
        		    var name = _ref.name;
        		    return name === requestingName;
        		  });
        		
        		  var isRequired = !!requesting && modifiers.some(function (modifier) {
        		    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
        		  });
        		
        		  if (!isRequired) {
        		    var _requesting = '`' + requestingName + '`';
        		    var requested = '`' + requestedName + '`';
        		    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
        		  }
        		  return isRequired;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function arrow(data, options) {
        		  var _data$offsets$arrow;
        		
        		  // arrow depends on keepTogether in order to work
        		  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
        		    return data;
        		  }
        		
        		  var arrowElement = options.element;
        		
        		  // if arrowElement is a string, suppose it's a CSS selector
        		  if (typeof arrowElement === 'string') {
        		    arrowElement = data.instance.popper.querySelector(arrowElement);
        		
        		    // if arrowElement is not found, don't run the modifier
        		    if (!arrowElement) {
        		      return data;
        		    }
        		  } else {
        		    // if the arrowElement isn't a query selector we must check that the
        		    // provided DOM node is child of its popper node
        		    if (!data.instance.popper.contains(arrowElement)) {
        		      console.warn('WARNING: `arrow.element` must be child of its popper element!');
        		      return data;
        		    }
        		  }
        		
        		  var placement = data.placement.split('-')[0];
        		  var _data$offsets = data.offsets,
        		      popper = _data$offsets.popper,
        		      reference = _data$offsets.reference;
        		
        		  var isVertical = ['left', 'right'].indexOf(placement) !== -1;
        		
        		  var len = isVertical ? 'height' : 'width';
        		  var sideCapitalized = isVertical ? 'Top' : 'Left';
        		  var side = sideCapitalized.toLowerCase();
        		  var altSide = isVertical ? 'left' : 'top';
        		  var opSide = isVertical ? 'bottom' : 'right';
        		  var arrowElementSize = getOuterSizes(arrowElement)[len];
        		
        		  //
        		  // extends keepTogether behavior making sure the popper and its
        		  // reference have enough pixels in conjunction
        		  //
        		
        		  // top/left side
        		  if (reference[opSide] - arrowElementSize < popper[side]) {
        		    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
        		  }
        		  // bottom/right side
        		  if (reference[side] + arrowElementSize > popper[opSide]) {
        		    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
        		  }
        		  data.offsets.popper = getClientRect(data.offsets.popper);
        		
        		  // compute center of the popper
        		  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;
        		
        		  // Compute the sideValue using the updated popper offsets
        		  // take popper margin in account because we don't have this info available
        		  var css = getStyleComputedProperty(data.instance.popper);
        		  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
        		  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
        		  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;
        		
        		  // prevent arrowElement from being placed not contiguously to its popper
        		  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
        		
        		  data.arrowElement = arrowElement;
        		  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);
        		
        		  return data;
        		}
        		
        		/**
        		 * Get the opposite placement variation of the given one
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {String} placement variation
        		 * @returns {String} flipped placement variation
        		 */
        		function getOppositeVariation(variation) {
        		  if (variation === 'end') {
        		    return 'start';
        		  } else if (variation === 'start') {
        		    return 'end';
        		  }
        		  return variation;
        		}
        		
        		/**
        		 * List of accepted placements to use as values of the `placement` option.<br />
        		 * Valid placements are:
        		 * - `auto`
        		 * - `top`
        		 * - `right`
        		 * - `bottom`
        		 * - `left`
        		 *
        		 * Each placement can have a variation from this list:
        		 * - `-start`
        		 * - `-end`
        		 *
        		 * Variations are interpreted easily if you think of them as the left to right
        		 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
        		 * is right.<br />
        		 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
        		 *
        		 * Some valid examples are:
        		 * - `top-end` (on top of reference, right aligned)
        		 * - `right-start` (on right of reference, top aligned)
        		 * - `bottom` (on bottom, centered)
        		 * - `auto-end` (on the side with more space available, alignment depends by placement)
        		 *
        		 * @static
        		 * @type {Array}
        		 * @enum {String}
        		 * @readonly
        		 * @method placements
        		 * @memberof Popper
        		 */
        		var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];
        		
        		// Get rid of `auto` `auto-start` and `auto-end`
        		var validPlacements = placements.slice(3);
        		
        		/**
        		 * Given an initial placement, returns all the subsequent placements
        		 * clockwise (or counter-clockwise).
        		 *
        		 * @method
        		 * @memberof Popper.Utils
        		 * @argument {String} placement - A valid placement (it accepts variations)
        		 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
        		 * @returns {Array} placements including their variations
        		 */
        		function clockwise(placement) {
        		  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        		
        		  var index = validPlacements.indexOf(placement);
        		  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
        		  return counter ? arr.reverse() : arr;
        		}
        		
        		var BEHAVIORS = {
        		  FLIP: 'flip',
        		  CLOCKWISE: 'clockwise',
        		  COUNTERCLOCKWISE: 'counterclockwise'
        		};
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function flip(data, options) {
        		  // if `inner` modifier is enabled, we can't use the `flip` modifier
        		  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
        		    return data;
        		  }
        		
        		  if (data.flipped && data.placement === data.originalPlacement) {
        		    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
        		    return data;
        		  }
        		
        		  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
        		
        		  var placement = data.placement.split('-')[0];
        		  var placementOpposite = getOppositePlacement(placement);
        		  var variation = data.placement.split('-')[1] || '';
        		
        		  var flipOrder = [];
        		
        		  switch (options.behavior) {
        		    case BEHAVIORS.FLIP:
        		      flipOrder = [placement, placementOpposite];
        		      break;
        		    case BEHAVIORS.CLOCKWISE:
        		      flipOrder = clockwise(placement);
        		      break;
        		    case BEHAVIORS.COUNTERCLOCKWISE:
        		      flipOrder = clockwise(placement, true);
        		      break;
        		    default:
        		      flipOrder = options.behavior;
        		  }
        		
        		  flipOrder.forEach(function (step, index) {
        		    if (placement !== step || flipOrder.length === index + 1) {
        		      return data;
        		    }
        		
        		    placement = data.placement.split('-')[0];
        		    placementOpposite = getOppositePlacement(placement);
        		
        		    var popperOffsets = data.offsets.popper;
        		    var refOffsets = data.offsets.reference;
        		
        		    // using floor because the reference offsets may contain decimals we are not going to consider here
        		    var floor = Math.floor;
        		    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);
        		
        		    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
        		    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
        		    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
        		    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
        		
        		    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;
        		
        		    // flip the variation if required
        		    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
        		
        		    // flips variation if reference element overflows boundaries
        		    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);
        		
        		    // flips variation if popper content overflows boundaries
        		    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);
        		
        		    var flippedVariation = flippedVariationByRef || flippedVariationByContent;
        		
        		    if (overlapsRef || overflowsBoundaries || flippedVariation) {
        		      // this boolean to detect any flip loop
        		      data.flipped = true;
        		
        		      if (overlapsRef || overflowsBoundaries) {
        		        placement = flipOrder[index + 1];
        		      }
        		
        		      if (flippedVariation) {
        		        variation = getOppositeVariation(variation);
        		      }
        		
        		      data.placement = placement + (variation ? '-' + variation : '');
        		
        		      // this object contains `position`, we want to preserve it along with
        		      // any additional property we may add in the future
        		      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
        		
        		      data = runModifiers(data.instance.modifiers, data, 'flip');
        		    }
        		  });
        		  return data;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function keepTogether(data) {
        		  var _data$offsets = data.offsets,
        		      popper = _data$offsets.popper,
        		      reference = _data$offsets.reference;
        		
        		  var placement = data.placement.split('-')[0];
        		  var floor = Math.floor;
        		  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
        		  var side = isVertical ? 'right' : 'bottom';
        		  var opSide = isVertical ? 'left' : 'top';
        		  var measurement = isVertical ? 'width' : 'height';
        		
        		  if (popper[side] < floor(reference[opSide])) {
        		    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
        		  }
        		  if (popper[opSide] > floor(reference[side])) {
        		    data.offsets.popper[opSide] = floor(reference[side]);
        		  }
        		
        		  return data;
        		}
        		
        		/**
        		 * Converts a string containing value + unit into a px value number
        		 * @function
        		 * @memberof {modifiers~offset}
        		 * @private
        		 * @argument {String} str - Value + unit string
        		 * @argument {String} measurement - `height` or `width`
        		 * @argument {Object} popperOffsets
        		 * @argument {Object} referenceOffsets
        		 * @returns {Number|String}
        		 * Value in pixels, or original string if no values were extracted
        		 */
        		function toValue(str, measurement, popperOffsets, referenceOffsets) {
        		  // separate value from unit
        		  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
        		  var value = +split[1];
        		  var unit = split[2];
        		
        		  // If it's not a number it's an operator, I guess
        		  if (!value) {
        		    return str;
        		  }
        		
        		  if (unit.indexOf('%') === 0) {
        		    var element = void 0;
        		    switch (unit) {
        		      case '%p':
        		        element = popperOffsets;
        		        break;
        		      case '%':
        		      case '%r':
        		      default:
        		        element = referenceOffsets;
        		    }
        		
        		    var rect = getClientRect(element);
        		    return rect[measurement] / 100 * value;
        		  } else if (unit === 'vh' || unit === 'vw') {
        		    // if is a vh or vw, we calculate the size based on the viewport
        		    var size = void 0;
        		    if (unit === 'vh') {
        		      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        		    } else {
        		      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        		    }
        		    return size / 100 * value;
        		  } else {
        		    // if is an explicit pixel unit, we get rid of the unit and keep the value
        		    // if is an implicit unit, it's px, and we return just the value
        		    return value;
        		  }
        		}
        		
        		/**
        		 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
        		 * @function
        		 * @memberof {modifiers~offset}
        		 * @private
        		 * @argument {String} offset
        		 * @argument {Object} popperOffsets
        		 * @argument {Object} referenceOffsets
        		 * @argument {String} basePlacement
        		 * @returns {Array} a two cells array with x and y offsets in numbers
        		 */
        		function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
        		  var offsets = [0, 0];
        		
        		  // Use height if placement is left or right and index is 0 otherwise use width
        		  // in this way the first offset will use an axis and the second one
        		  // will use the other one
        		  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;
        		
        		  // Split the offset string to obtain a list of values and operands
        		  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
        		  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
        		    return frag.trim();
        		  });
        		
        		  // Detect if the offset string contains a pair of values or a single one
        		  // they could be separated by comma or space
        		  var divider = fragments.indexOf(find(fragments, function (frag) {
        		    return frag.search(/,|\s/) !== -1;
        		  }));
        		
        		  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
        		    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
        		  }
        		
        		  // If divider is found, we divide the list of values and operands to divide
        		  // them by ofset X and Y.
        		  var splitRegex = /\s*,\s*|\s+/;
        		  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];
        		
        		  // Convert the values with units to absolute pixels to allow our computations
        		  ops = ops.map(function (op, index) {
        		    // Most of the units rely on the orientation of the popper
        		    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
        		    var mergeWithPrevious = false;
        		    return op
        		    // This aggregates any `+` or `-` sign that aren't considered operators
        		    // e.g.: 10 + +5 => [10, +, +5]
        		    .reduce(function (a, b) {
        		      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        		        a[a.length - 1] = b;
        		        mergeWithPrevious = true;
        		        return a;
        		      } else if (mergeWithPrevious) {
        		        a[a.length - 1] += b;
        		        mergeWithPrevious = false;
        		        return a;
        		      } else {
        		        return a.concat(b);
        		      }
        		    }, [])
        		    // Here we convert the string values into number values (in px)
        		    .map(function (str) {
        		      return toValue(str, measurement, popperOffsets, referenceOffsets);
        		    });
        		  });
        		
        		  // Loop trough the offsets arrays and execute the operations
        		  ops.forEach(function (op, index) {
        		    op.forEach(function (frag, index2) {
        		      if (isNumeric(frag)) {
        		        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        		      }
        		    });
        		  });
        		  return offsets;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @argument {Number|String} options.offset=0
        		 * The offset value as described in the modifier description
        		 * @returns {Object} The data object, properly modified
        		 */
        		function offset(data, _ref) {
        		  var offset = _ref.offset;
        		  var placement = data.placement,
        		      _data$offsets = data.offsets,
        		      popper = _data$offsets.popper,
        		      reference = _data$offsets.reference;
        		
        		  var basePlacement = placement.split('-')[0];
        		
        		  var offsets = void 0;
        		  if (isNumeric(+offset)) {
        		    offsets = [+offset, 0];
        		  } else {
        		    offsets = parseOffset(offset, popper, reference, basePlacement);
        		  }
        		
        		  if (basePlacement === 'left') {
        		    popper.top += offsets[0];
        		    popper.left -= offsets[1];
        		  } else if (basePlacement === 'right') {
        		    popper.top += offsets[0];
        		    popper.left += offsets[1];
        		  } else if (basePlacement === 'top') {
        		    popper.left += offsets[0];
        		    popper.top -= offsets[1];
        		  } else if (basePlacement === 'bottom') {
        		    popper.left += offsets[0];
        		    popper.top += offsets[1];
        		  }
        		
        		  data.popper = popper;
        		  return data;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function preventOverflow(data, options) {
        		  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);
        		
        		  // If offsetParent is the reference element, we really want to
        		  // go one step up and use the next offsetParent as reference to
        		  // avoid to make this modifier completely useless and look like broken
        		  if (data.instance.reference === boundariesElement) {
        		    boundariesElement = getOffsetParent(boundariesElement);
        		  }
        		
        		  // NOTE: DOM access here
        		  // resets the popper's position so that the document size can be calculated excluding
        		  // the size of the popper element itself
        		  var transformProp = getSupportedPropertyName('transform');
        		  var popperStyles = data.instance.popper.style; // assignment to help minification
        		  var top = popperStyles.top,
        		      left = popperStyles.left,
        		      transform = popperStyles[transformProp];
        		
        		  popperStyles.top = '';
        		  popperStyles.left = '';
        		  popperStyles[transformProp] = '';
        		
        		  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);
        		
        		  // NOTE: DOM access here
        		  // restores the original style properties after the offsets have been computed
        		  popperStyles.top = top;
        		  popperStyles.left = left;
        		  popperStyles[transformProp] = transform;
        		
        		  options.boundaries = boundaries;
        		
        		  var order = options.priority;
        		  var popper = data.offsets.popper;
        		
        		  var check = {
        		    primary: function primary(placement) {
        		      var value = popper[placement];
        		      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        		        value = Math.max(popper[placement], boundaries[placement]);
        		      }
        		      return defineProperty({}, placement, value);
        		    },
        		    secondary: function secondary(placement) {
        		      var mainSide = placement === 'right' ? 'left' : 'top';
        		      var value = popper[mainSide];
        		      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        		        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        		      }
        		      return defineProperty({}, mainSide, value);
        		    }
        		  };
        		
        		  order.forEach(function (placement) {
        		    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
        		    popper = _extends({}, popper, check[side](placement));
        		  });
        		
        		  data.offsets.popper = popper;
        		
        		  return data;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function shift(data) {
        		  var placement = data.placement;
        		  var basePlacement = placement.split('-')[0];
        		  var shiftvariation = placement.split('-')[1];
        		
        		  // if shift shiftvariation is specified, run the modifier
        		  if (shiftvariation) {
        		    var _data$offsets = data.offsets,
        		        reference = _data$offsets.reference,
        		        popper = _data$offsets.popper;
        		
        		    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
        		    var side = isVertical ? 'left' : 'top';
        		    var measurement = isVertical ? 'width' : 'height';
        		
        		    var shiftOffsets = {
        		      start: defineProperty({}, side, reference[side]),
        		      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
        		    };
        		
        		    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
        		  }
        		
        		  return data;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by update method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function hide(data) {
        		  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
        		    return data;
        		  }
        		
        		  var refRect = data.offsets.reference;
        		  var bound = find(data.instance.modifiers, function (modifier) {
        		    return modifier.name === 'preventOverflow';
        		  }).boundaries;
        		
        		  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
        		    // Avoid unnecessary DOM access if visibility hasn't changed
        		    if (data.hide === true) {
        		      return data;
        		    }
        		
        		    data.hide = true;
        		    data.attributes['x-out-of-boundaries'] = '';
        		  } else {
        		    // Avoid unnecessary DOM access if visibility hasn't changed
        		    if (data.hide === false) {
        		      return data;
        		    }
        		
        		    data.hide = false;
        		    data.attributes['x-out-of-boundaries'] = false;
        		  }
        		
        		  return data;
        		}
        		
        		/**
        		 * @function
        		 * @memberof Modifiers
        		 * @argument {Object} data - The data object generated by `update` method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {Object} The data object, properly modified
        		 */
        		function inner(data) {
        		  var placement = data.placement;
        		  var basePlacement = placement.split('-')[0];
        		  var _data$offsets = data.offsets,
        		      popper = _data$offsets.popper,
        		      reference = _data$offsets.reference;
        		
        		  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;
        		
        		  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;
        		
        		  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);
        		
        		  data.placement = getOppositePlacement(placement);
        		  data.offsets.popper = getClientRect(popper);
        		
        		  return data;
        		}
        		
        		/**
        		 * Modifier function, each modifier can have a function of this type assigned
        		 * to its `fn` property.<br />
        		 * These functions will be called on each update, this means that you must
        		 * make sure they are performant enough to avoid performance bottlenecks.
        		 *
        		 * @function ModifierFn
        		 * @argument {dataObject} data - The data object generated by `update` method
        		 * @argument {Object} options - Modifiers configuration and options
        		 * @returns {dataObject} The data object, properly modified
        		 */
        		
        		/**
        		 * Modifiers are plugins used to alter the behavior of your poppers.<br />
        		 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
        		 * needed by the library.
        		 *
        		 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
        		 * All the other properties are configurations that could be tweaked.
        		 * @namespace modifiers
        		 */
        		var modifiers = {
        		  /**
        		   * Modifier used to shift the popper on the start or end of its reference
        		   * element.<br />
        		   * It will read the variation of the `placement` property.<br />
        		   * It can be one either `-end` or `-start`.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  shift: {
        		    /** @prop {number} order=100 - Index used to define the order of execution */
        		    order: 100,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: shift
        		  },
        		
        		  /**
        		   * The `offset` modifier can shift your popper on both its axis.
        		   *
        		   * It accepts the following units:
        		   * - `px` or unit-less, interpreted as pixels
        		   * - `%` or `%r`, percentage relative to the length of the reference element
        		   * - `%p`, percentage relative to the length of the popper element
        		   * - `vw`, CSS viewport width unit
        		   * - `vh`, CSS viewport height unit
        		   *
        		   * For length is intended the main axis relative to the placement of the popper.<br />
        		   * This means that if the placement is `top` or `bottom`, the length will be the
        		   * `width`. In case of `left` or `right`, it will be the `height`.
        		   *
        		   * You can provide a single value (as `Number` or `String`), or a pair of values
        		   * as `String` divided by a comma or one (or more) white spaces.<br />
        		   * The latter is a deprecated method because it leads to confusion and will be
        		   * removed in v2.<br />
        		   * Additionally, it accepts additions and subtractions between different units.
        		   * Note that multiplications and divisions aren't supported.
        		   *
        		   * Valid examples are:
        		   * ```
        		   * 10
        		   * '10%'
        		   * '10, 10'
        		   * '10%, 10'
        		   * '10 + 10%'
        		   * '10 - 5vh + 3%'
        		   * '-10px + 5vh, 5px - 6%'
        		   * ```
        		   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
        		   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
        		   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
        		   *
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  offset: {
        		    /** @prop {number} order=200 - Index used to define the order of execution */
        		    order: 200,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: offset,
        		    /** @prop {Number|String} offset=0
        		     * The offset value as described in the modifier description
        		     */
        		    offset: 0
        		  },
        		
        		  /**
        		   * Modifier used to prevent the popper from being positioned outside the boundary.
        		   *
        		   * A scenario exists where the reference itself is not within the boundaries.<br />
        		   * We can say it has "escaped the boundaries" — or just "escaped".<br />
        		   * In this case we need to decide whether the popper should either:
        		   *
        		   * - detach from the reference and remain "trapped" in the boundaries, or
        		   * - if it should ignore the boundary and "escape with its reference"
        		   *
        		   * When `escapeWithReference` is set to`true` and reference is completely
        		   * outside its boundaries, the popper will overflow (or completely leave)
        		   * the boundaries in order to remain attached to the edge of the reference.
        		   *
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  preventOverflow: {
        		    /** @prop {number} order=300 - Index used to define the order of execution */
        		    order: 300,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: preventOverflow,
        		    /**
        		     * @prop {Array} [priority=['left','right','top','bottom']]
        		     * Popper will try to prevent overflow following these priorities by default,
        		     * then, it could overflow on the left and on top of the `boundariesElement`
        		     */
        		    priority: ['left', 'right', 'top', 'bottom'],
        		    /**
        		     * @prop {number} padding=5
        		     * Amount of pixel used to define a minimum distance between the boundaries
        		     * and the popper. This makes sure the popper always has a little padding
        		     * between the edges of its container
        		     */
        		    padding: 5,
        		    /**
        		     * @prop {String|HTMLElement} boundariesElement='scrollParent'
        		     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
        		     * `viewport` or any DOM element.
        		     */
        		    boundariesElement: 'scrollParent'
        		  },
        		
        		  /**
        		   * Modifier used to make sure the reference and its popper stay near each other
        		   * without leaving any gap between the two. Especially useful when the arrow is
        		   * enabled and you want to ensure that it points to its reference element.
        		   * It cares only about the first axis. You can still have poppers with margin
        		   * between the popper and its reference element.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  keepTogether: {
        		    /** @prop {number} order=400 - Index used to define the order of execution */
        		    order: 400,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: keepTogether
        		  },
        		
        		  /**
        		   * This modifier is used to move the `arrowElement` of the popper to make
        		   * sure it is positioned between the reference element and its popper element.
        		   * It will read the outer size of the `arrowElement` node to detect how many
        		   * pixels of conjunction are needed.
        		   *
        		   * It has no effect if no `arrowElement` is provided.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  arrow: {
        		    /** @prop {number} order=500 - Index used to define the order of execution */
        		    order: 500,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: arrow,
        		    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
        		    element: '[x-arrow]'
        		  },
        		
        		  /**
        		   * Modifier used to flip the popper's placement when it starts to overlap its
        		   * reference element.
        		   *
        		   * Requires the `preventOverflow` modifier before it in order to work.
        		   *
        		   * **NOTE:** this modifier will interrupt the current update cycle and will
        		   * restart it if it detects the need to flip the placement.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  flip: {
        		    /** @prop {number} order=600 - Index used to define the order of execution */
        		    order: 600,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: flip,
        		    /**
        		     * @prop {String|Array} behavior='flip'
        		     * The behavior used to change the popper's placement. It can be one of
        		     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
        		     * placements (with optional variations)
        		     */
        		    behavior: 'flip',
        		    /**
        		     * @prop {number} padding=5
        		     * The popper will flip if it hits the edges of the `boundariesElement`
        		     */
        		    padding: 5,
        		    /**
        		     * @prop {String|HTMLElement} boundariesElement='viewport'
        		     * The element which will define the boundaries of the popper position.
        		     * The popper will never be placed outside of the defined boundaries
        		     * (except if `keepTogether` is enabled)
        		     */
        		    boundariesElement: 'viewport',
        		    /**
        		     * @prop {Boolean} flipVariations=false
        		     * The popper will switch placement variation between `-start` and `-end` when
        		     * the reference element overlaps its boundaries.
        		     *
        		     * The original placement should have a set variation.
        		     */
        		    flipVariations: false,
        		    /**
        		     * @prop {Boolean} flipVariationsByContent=false
        		     * The popper will switch placement variation between `-start` and `-end` when
        		     * the popper element overlaps its reference boundaries.
        		     *
        		     * The original placement should have a set variation.
        		     */
        		    flipVariationsByContent: false
        		  },
        		
        		  /**
        		   * Modifier used to make the popper flow toward the inner of the reference element.
        		   * By default, when this modifier is disabled, the popper will be placed outside
        		   * the reference element.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  inner: {
        		    /** @prop {number} order=700 - Index used to define the order of execution */
        		    order: 700,
        		    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
        		    enabled: false,
        		    /** @prop {ModifierFn} */
        		    fn: inner
        		  },
        		
        		  /**
        		   * Modifier used to hide the popper when its reference element is outside of the
        		   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
        		   * be used to hide with a CSS selector the popper when its reference is
        		   * out of boundaries.
        		   *
        		   * Requires the `preventOverflow` modifier before it in order to work.
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  hide: {
        		    /** @prop {number} order=800 - Index used to define the order of execution */
        		    order: 800,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: hide
        		  },
        		
        		  /**
        		   * Computes the style that will be applied to the popper element to gets
        		   * properly positioned.
        		   *
        		   * Note that this modifier will not touch the DOM, it just prepares the styles
        		   * so that `applyStyle` modifier can apply it. This separation is useful
        		   * in case you need to replace `applyStyle` with a custom implementation.
        		   *
        		   * This modifier has `850` as `order` value to maintain backward compatibility
        		   * with previous versions of Popper.js. Expect the modifiers ordering method
        		   * to change in future major versions of the library.
        		   *
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  computeStyle: {
        		    /** @prop {number} order=850 - Index used to define the order of execution */
        		    order: 850,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: computeStyle,
        		    /**
        		     * @prop {Boolean} gpuAcceleration=true
        		     * If true, it uses the CSS 3D transformation to position the popper.
        		     * Otherwise, it will use the `top` and `left` properties
        		     */
        		    gpuAcceleration: true,
        		    /**
        		     * @prop {string} [x='bottom']
        		     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
        		     * Change this if your popper should grow in a direction different from `bottom`
        		     */
        		    x: 'bottom',
        		    /**
        		     * @prop {string} [x='left']
        		     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
        		     * Change this if your popper should grow in a direction different from `right`
        		     */
        		    y: 'right'
        		  },
        		
        		  /**
        		   * Applies the computed styles to the popper element.
        		   *
        		   * All the DOM manipulations are limited to this modifier. This is useful in case
        		   * you want to integrate Popper.js inside a framework or view library and you
        		   * want to delegate all the DOM manipulations to it.
        		   *
        		   * Note that if you disable this modifier, you must make sure the popper element
        		   * has its position set to `absolute` before Popper.js can do its work!
        		   *
        		   * Just disable this modifier and define your own to achieve the desired effect.
        		   *
        		   * @memberof modifiers
        		   * @inner
        		   */
        		  applyStyle: {
        		    /** @prop {number} order=900 - Index used to define the order of execution */
        		    order: 900,
        		    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        		    enabled: true,
        		    /** @prop {ModifierFn} */
        		    fn: applyStyle,
        		    /** @prop {Function} */
        		    onLoad: applyStyleOnLoad,
        		    /**
        		     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
        		     * @prop {Boolean} gpuAcceleration=true
        		     * If true, it uses the CSS 3D transformation to position the popper.
        		     * Otherwise, it will use the `top` and `left` properties
        		     */
        		    gpuAcceleration: undefined
        		  }
        		};
        		
        		/**
        		 * The `dataObject` is an object containing all the information used by Popper.js.
        		 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
        		 * @name dataObject
        		 * @property {Object} data.instance The Popper.js instance
        		 * @property {String} data.placement Placement applied to popper
        		 * @property {String} data.originalPlacement Placement originally defined on init
        		 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
        		 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
        		 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
        		 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
        		 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
        		 * @property {Object} data.boundaries Offsets of the popper boundaries
        		 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
        		 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
        		 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
        		 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
        		 */
        		
        		/**
        		 * Default options provided to Popper.js constructor.<br />
        		 * These can be overridden using the `options` argument of Popper.js.<br />
        		 * To override an option, simply pass an object with the same
        		 * structure of the `options` object, as the 3rd argument. For example:
        		 * ```
        		 * new Popper(ref, pop, {
        		 *   modifiers: {
        		 *     preventOverflow: { enabled: false }
        		 *   }
        		 * })
        		 * ```
        		 * @type {Object}
        		 * @static
        		 * @memberof Popper
        		 */
        		var Defaults = {
        		  /**
        		   * Popper's placement.
        		   * @prop {Popper.placements} placement='bottom'
        		   */
        		  placement: 'bottom',
        		
        		  /**
        		   * Set this to true if you want popper to position it self in 'fixed' mode
        		   * @prop {Boolean} positionFixed=false
        		   */
        		  positionFixed: false,
        		
        		  /**
        		   * Whether events (resize, scroll) are initially enabled.
        		   * @prop {Boolean} eventsEnabled=true
        		   */
        		  eventsEnabled: true,
        		
        		  /**
        		   * Set to true if you want to automatically remove the popper when
        		   * you call the `destroy` method.
        		   * @prop {Boolean} removeOnDestroy=false
        		   */
        		  removeOnDestroy: false,
        		
        		  /**
        		   * Callback called when the popper is created.<br />
        		   * By default, it is set to no-op.<br />
        		   * Access Popper.js instance with `data.instance`.
        		   * @prop {onCreate}
        		   */
        		  onCreate: function onCreate() {},
        		
        		  /**
        		   * Callback called when the popper is updated. This callback is not called
        		   * on the initialization/creation of the popper, but only on subsequent
        		   * updates.<br />
        		   * By default, it is set to no-op.<br />
        		   * Access Popper.js instance with `data.instance`.
        		   * @prop {onUpdate}
        		   */
        		  onUpdate: function onUpdate() {},
        		
        		  /**
        		   * List of modifiers used to modify the offsets before they are applied to the popper.
        		   * They provide most of the functionalities of Popper.js.
        		   * @prop {modifiers}
        		   */
        		  modifiers: modifiers
        		};
        		
        		/**
        		 * @callback onCreate
        		 * @param {dataObject} data
        		 */
        		
        		/**
        		 * @callback onUpdate
        		 * @param {dataObject} data
        		 */
        		
        		// Utils
        		// Methods
        		var Popper = function () {
        		  /**
        		   * Creates a new Popper.js instance.
        		   * @class Popper
        		   * @param {Element|referenceObject} reference - The reference element used to position the popper
        		   * @param {Element} popper - The HTML / XML element used as the popper
        		   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
        		   * @return {Object} instance - The generated Popper.js instance
        		   */
        		  function Popper(reference, popper) {
        		    var _this = this;
        		
        		    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        		    classCallCheck(this, Popper);
        		
        		    this.scheduleUpdate = function () {
        		      return requestAnimationFrame(_this.update);
        		    };
        		
        		    // make update() debounced, so that it only runs at most once-per-tick
        		    this.update = debounce(this.update.bind(this));
        		
        		    // with {} we create a new object with the options inside it
        		    this.options = _extends({}, Popper.Defaults, options);
        		
        		    // init state
        		    this.state = {
        		      isDestroyed: false,
        		      isCreated: false,
        		      scrollParents: []
        		    };
        		
        		    // get reference and popper elements (allow jQuery wrappers)
        		    this.reference = reference && reference.jquery ? reference[0] : reference;
        		    this.popper = popper && popper.jquery ? popper[0] : popper;
        		
        		    // Deep merge modifiers options
        		    this.options.modifiers = {};
        		    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        		      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
        		    });
        		
        		    // Refactoring modifiers' list (Object => Array)
        		    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        		      return _extends({
        		        name: name
        		      }, _this.options.modifiers[name]);
        		    })
        		    // sort the modifiers by order
        		    .sort(function (a, b) {
        		      return a.order - b.order;
        		    });
        		
        		    // modifiers have the ability to execute arbitrary code when Popper.js get inited
        		    // such code is executed in the same order of its modifier
        		    // they could add new properties to their options configuration
        		    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
        		    this.modifiers.forEach(function (modifierOptions) {
        		      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        		        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        		      }
        		    });
        		
        		    // fire the first update to position the popper in the right place
        		    this.update();
        		
        		    var eventsEnabled = this.options.eventsEnabled;
        		    if (eventsEnabled) {
        		      // setup event listeners, they will take care of update the position in specific situations
        		      this.enableEventListeners();
        		    }
        		
        		    this.state.eventsEnabled = eventsEnabled;
        		  }
        		
        		  // We can't use class properties because they don't get listed in the
        		  // class prototype and break stuff like Sinon stubs
        		
        		
        		  createClass(Popper, [{
        		    key: 'update',
        		    value: function update$$1() {
        		      return update.call(this);
        		    }
        		  }, {
        		    key: 'destroy',
        		    value: function destroy$$1() {
        		      return destroy.call(this);
        		    }
        		  }, {
        		    key: 'enableEventListeners',
        		    value: function enableEventListeners$$1() {
        		      return enableEventListeners.call(this);
        		    }
        		  }, {
        		    key: 'disableEventListeners',
        		    value: function disableEventListeners$$1() {
        		      return disableEventListeners.call(this);
        		    }
        		
        		    /**
        		     * Schedules an update. It will run on the next UI update available.
        		     * @method scheduleUpdate
        		     * @memberof Popper
        		     */
        		
        		
        		    /**
        		     * Collection of utilities useful when writing custom modifiers.
        		     * Starting from version 1.7, this method is available only if you
        		     * include `popper-utils.js` before `popper.js`.
        		     *
        		     * **DEPRECATION**: This way to access PopperUtils is deprecated
        		     * and will be removed in v2! Use the PopperUtils module directly instead.
        		     * Due to the high instability of the methods contained in Utils, we can't
        		     * guarantee them to follow semver. Use them at your own risk!
        		     * @static
        		     * @private
        		     * @type {Object}
        		     * @deprecated since version 1.8
        		     * @member Utils
        		     * @memberof Popper
        		     */
        		
        		  }]);
        		  return Popper;
        		}();
        		
        		/**
        		 * The `referenceObject` is an object that provides an interface compatible with Popper.js
        		 * and lets you use it as replacement of a real DOM node.<br />
        		 * You can use this method to position a popper relatively to a set of coordinates
        		 * in case you don't have a DOM node to use as reference.
        		 *
        		 * ```
        		 * new Popper(referenceObject, popperNode);
        		 * ```
        		 *
        		 * NB: This feature isn't supported in Internet Explorer 10.
        		 * @name referenceObject
        		 * @property {Function} data.getBoundingClientRect
        		 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
        		 * @property {number} data.clientWidth
        		 * An ES6 getter that will return the width of the virtual reference element.
        		 * @property {number} data.clientHeight
        		 * An ES6 getter that will return the height of the virtual reference element.
        		 */
        		
        		
        		Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
        		Popper.placements = placements;
        		Popper.Defaults = Defaults;
        		
        		return Popper;
        		
        		})));
        		//# sourceMappingURL=popper.js.map
        	}).call(Libraries);
        	
        	/* Tippy.js */
        	(function(Popper) {
        		var tippy=function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;function e(){return(e=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var n={passive:!0},r="tippy-iOS",i="tippy-popper",o="tippy-tooltip",a="tippy-content",p="tippy-backdrop",u="tippy-arrow",s="tippy-svg-arrow",c="."+i,l="."+o,f="."+a,d="."+u,v="."+s;function m(t,e){t.innerHTML=e}function g(t){return!(!t||!t._tippy||t._tippy.reference!==t)}function h(t,e){return{}.hasOwnProperty.call(t,e)}function b(t){return A(t)?[t]:function(t){return E(t,"NodeList")}(t)?M(t):Array.isArray(t)?t:M(document.querySelectorAll(t))}function y(t,e,n){if(Array.isArray(t)){var r=t[e];return null==r?Array.isArray(n)?n[e]:n:r}return t}function w(t,e){return t&&t.modifiers&&t.modifiers[e]}function E(t,e){var n={}.toString.call(t);return 0===n.indexOf("[object")&&n.indexOf(e+"]")>-1}function A(t){return E(t,"Element")}function T(t){return E(t,"MouseEvent")}function x(t,e){return"function"==typeof t?t.apply(void 0,e):t}function C(t,e,n,r){t.filter(function(t){return t.name===e})[0][n]=r}function I(){return document.createElement("div")}function O(t,e){t.forEach(function(t){t&&(t.style.transitionDuration=e+"ms")})}function D(t,e){t.forEach(function(t){t&&t.setAttribute("data-state",e)})}function L(t,e){return 0===e?t:function(r){clearTimeout(n),n=setTimeout(function(){t(r)},e)};var n}function k(t,e,n){t&&t!==e&&t.apply(void 0,n)}function M(t){return[].slice.call(t)}function S(t,e){for(;t;){if(e(t))return t;t=t.parentElement}return null}function P(t,e){return t.indexOf(e)>-1}function V(t){return t.split(/\s+/).filter(Boolean)}function B(t,e){return void 0!==t?t:e}function U(t){return[].concat(t)}function H(t){var e=U(t)[0];return e&&e.ownerDocument||document}function N(t,e){-1===t.indexOf(e)&&t.push(e)}function z(t){return"number"==typeof t?t:parseFloat(t)}function R(t,e,n){void 0===e&&(e=5);var r={top:0,right:0,bottom:0,left:0};return Object.keys(r).reduce(function(r,i){return r[i]="number"==typeof e?e:e[i],t===i&&(r[i]="number"==typeof e?e+n:e[t]+n),r},r)}var q={isTouch:!1},F=0;function j(){q.isTouch||(q.isTouch=!0,window.performance&&document.addEventListener("mousemove",_))}function _(){var t=performance.now();t-F<20&&(q.isTouch=!1,document.removeEventListener("mousemove",_)),F=t}function W(){var t=document.activeElement;if(g(t)){var e=t._tippy;t.blur&&!e.state.isVisible&&t.blur()}}var X="undefined"!=typeof window&&"undefined"!=typeof document,Y=X?navigator.userAgent:"",J=/MSIE |Trident\//.test(Y),G=/UCBrowser\//.test(Y),K=X&&/iPhone|iPad|iPod/.test(navigator.platform);function Q(t){var e=t&&K&&q.isTouch;document.body.classList[e?"add":"remove"](r)}var Z=e({allowHTML:!0,animation:"fade",appendTo:function(){return document.body},aria:"describedby",arrow:!0,boundary:"scrollParent",content:"",delay:0,distance:10,duration:[300,250],flip:!0,flipBehavior:"flip",flipOnUpdate:!1,hideOnClick:!0,ignoreAttributes:!1,inertia:!1,interactive:!1,interactiveBorder:2,interactiveDebounce:0,lazy:!0,maxWidth:350,multiple:!1,offset:0,onAfterUpdate:function(){},onBeforeUpdate:function(){},onCreate:function(){},onDestroy:function(){},onHidden:function(){},onHide:function(){},onMount:function(){},onShow:function(){},onShown:function(){},onTrigger:function(){},onUntrigger:function(){},placement:"top",plugins:[],popperOptions:{},role:"tooltip",showOnCreate:!1,theme:"",touch:!0,trigger:"mouseenter focus",triggerTarget:null,updateDuration:0,zIndex:9999},{animateFill:!1,followCursor:!1,inlinePositioning:!1,sticky:!1}),$=Object.keys(Z),tt=["arrow","boundary","distance","flip","flipBehavior","flipOnUpdate","offset","placement","popperOptions"];function et(t){var n=(t.plugins||[]).reduce(function(e,n){var r=n.name,i=n.defaultValue;return r&&(e[r]=void 0!==t[r]?t[r]:i),e},{});return e({},t,{},n)}function nt(t,n){var r=e({},n,{content:x(n.content,[t])},n.ignoreAttributes?{}:function(t,n){return(n?Object.keys(et(e({},Z,{plugins:n}))):$).reduce(function(e,n){var r=(t.getAttribute("data-tippy-"+n)||"").trim();if(!r)return e;if("content"===n)e[n]=r;else try{e[n]=JSON.parse(r)}catch(t){e[n]=r}return e},{})}(t,n.plugins));return r.interactive&&(r.aria=null),r}function rt(t){return t.split("-")[0]}function it(t){t.setAttribute("data-inertia","")}function ot(t){t.setAttribute("data-interactive","")}function at(t,e){if(A(e.content))m(t,""),t.appendChild(e.content);else if("function"!=typeof e.content){t[e.allowHTML?"innerHTML":"textContent"]=e.content}}function pt(t){return{tooltip:t.querySelector(l),content:t.querySelector(f),arrow:t.querySelector(d)||t.querySelector(v)}}function ut(t){var e=I();return!0===t?e.className=u:(e.className=s,A(t)?e.appendChild(t):m(e,t)),e}function st(t,e){var n=I();n.className=i,n.style.position="absolute",n.style.top="0",n.style.left="0";var r=I();r.className=o,r.id="tippy-"+t,r.setAttribute("data-state","hidden"),r.setAttribute("tabindex","-1"),ft(r,"add",e.theme);var p=I();return p.className=a,p.setAttribute("data-state","hidden"),e.interactive&&ot(r),e.arrow&&(r.setAttribute("data-arrow",""),r.appendChild(ut(e.arrow))),e.inertia&&it(r),at(p,e),r.appendChild(p),n.appendChild(r),ct(n,e,e),n}function ct(t,e,n){var r,i=pt(t),o=i.tooltip,a=i.content,p=i.arrow;t.style.zIndex=""+n.zIndex,o.setAttribute("data-animation",n.animation),o.style.maxWidth="number"==typeof(r=n.maxWidth)?r+"px":r,n.role?o.setAttribute("role",n.role):o.removeAttribute("role"),e.content!==n.content&&at(a,n),!e.arrow&&n.arrow?(o.appendChild(ut(n.arrow)),o.setAttribute("data-arrow","")):e.arrow&&!n.arrow?(o.removeChild(p),o.removeAttribute("data-arrow")):e.arrow!==n.arrow&&(o.removeChild(p),o.appendChild(ut(n.arrow))),!e.interactive&&n.interactive?ot(o):e.interactive&&!n.interactive&&function(t){t.removeAttribute("data-interactive")}(o),!e.inertia&&n.inertia?it(o):e.inertia&&!n.inertia&&function(t){t.removeAttribute("data-inertia")}(o),e.theme!==n.theme&&(ft(o,"remove",e.theme),ft(o,"add",n.theme))}function lt(t,e,n){var r=G&&void 0!==document.body.style.webkitTransition?"webkitTransitionEnd":"transitionend";t[e+"EventListener"](r,n)}function ft(t,e,n){V(n).forEach(function(n){t.classList[e](n+"-theme")})}var dt=1,vt=[],mt=[];function gt(r,i){var o,a,p,u=nt(r,e({},Z,{},et(i)));if(!u.multiple&&r._tippy)return null;var s,l,f,d,v,m=!1,g=!1,b=!1,E=0,A=[],I=L(Lt,u.interactiveDebounce),F=H(u.triggerTarget||r),j=dt++,_=st(j,u),W=pt(_),X=(v=u.plugins).filter(function(t,e){return v.indexOf(t)===e}),Y=W.tooltip,G=W.content,K=[Y,G],$={id:j,reference:r,popper:_,popperChildren:W,popperInstance:null,props:u,state:{currentPlacement:null,isEnabled:!0,isVisible:!1,isDestroyed:!1,isMounted:!1,isShown:!1},plugins:X,clearDelayTimeouts:function(){clearTimeout(o),clearTimeout(a),cancelAnimationFrame(p)},setProps:function(t){if($.state.isDestroyed)return;ht("onBeforeUpdate",[$,t]),Ot();var n=$.props,i=nt(r,e({},$.props,{},t,{ignoreAttributes:!0}));i.ignoreAttributes=B(t.ignoreAttributes,n.ignoreAttributes),$.props=i,It(),n.interactiveDebounce!==i.interactiveDebounce&&(wt(),I=L(Lt,i.interactiveDebounce));ct(_,n,i),$.popperChildren=pt(_),n.triggerTarget&&!i.triggerTarget?U(n.triggerTarget).forEach(function(t){t.removeAttribute("aria-expanded")}):i.triggerTarget&&r.removeAttribute("aria-expanded");if(yt(),$.popperInstance)if(tt.some(function(e){return h(t,e)&&t[e]!==n[e]})){var o=$.popperInstance.reference;$.popperInstance.destroy(),Pt(),$.popperInstance.reference=o,$.state.isVisible&&$.popperInstance.enableEventListeners()}else $.popperInstance.update();ht("onAfterUpdate",[$,t])},setContent:function(t){$.setProps({content:t})},show:function(t){void 0===t&&(t=y($.props.duration,0,Z.duration));var e=$.state.isVisible,n=$.state.isDestroyed,r=!$.state.isEnabled,i=q.isTouch&&!$.props.touch;if(e||n||r||i)return;if(ft().hasAttribute("disabled"))return;$.popperInstance||Pt();if(ht("onShow",[$],!1),!1===$.props.onShow($))return;At(),_.style.visibility="visible",$.state.isVisible=!0,$.state.isMounted||O(K.concat(_),0);l=function(){$.state.isVisible&&(O([_],$.props.updateDuration),O(K,t),D(K,"visible"),bt(),yt(),N(mt,$),Q(!0),$.state.isMounted=!0,ht("onMount",[$]),function(t,e){xt(t,e)}(t,function(){$.state.isShown=!0,ht("onShown",[$])}))},function(){E=0;var t,e=$.props.appendTo,n=ft();t=$.props.interactive&&e===Z.appendTo||"parent"===e?n.parentNode:x(e,[n]);t.contains(_)||t.appendChild(_);C($.popperInstance.modifiers,"flip","enabled",$.props.flip),$.popperInstance.enableEventListeners(),$.popperInstance.update()}()},hide:function(t){void 0===t&&(t=y($.props.duration,1,Z.duration));var e=!$.state.isVisible&&!m,n=$.state.isDestroyed,r=!$.state.isEnabled&&!m;if(e||n||r)return;if(ht("onHide",[$],!1),!1===$.props.onHide($)&&!m)return;Tt(),_.style.visibility="hidden",$.state.isVisible=!1,$.state.isShown=!1,O(K,t),D(K,"hidden"),bt(),yt(),function(t,e){xt(t,function(){!$.state.isVisible&&_.parentNode&&_.parentNode.contains(_)&&e()})}(t,function(){$.popperInstance.disableEventListeners(),$.popperInstance.options.placement=$.props.placement,_.parentNode.removeChild(_),0===(mt=mt.filter(function(t){return t!==$})).length&&Q(!1),$.state.isMounted=!1,ht("onHidden",[$])})},enable:function(){$.state.isEnabled=!0},disable:function(){$.hide(),$.state.isEnabled=!1},destroy:function(){if($.state.isDestroyed)return;m=!0,$.clearDelayTimeouts(),$.hide(0),Ot(),delete r._tippy,$.popperInstance&&$.popperInstance.destroy();m=!1,$.state.isDestroyed=!0,ht("onDestroy",[$])}};r._tippy=$,_._tippy=$;var it=X.map(function(t){return t.fn($)}),ot=r.hasAttribute("aria-expanded");return It(),yt(),u.lazy||Pt(),ht("onCreate",[$]),u.showOnCreate&&Bt(),_.addEventListener("mouseenter",function(){$.props.interactive&&$.state.isVisible&&$.clearDelayTimeouts()}),_.addEventListener("mouseleave",function(){$.props.interactive&&P($.props.trigger,"mouseenter")&&F.addEventListener("mousemove",I)}),$;function at(){var t=$.props.touch;return Array.isArray(t)?t:[t,0]}function ut(){return"hold"===at()[0]}function ft(){return d||r}function gt(t){return $.state.isMounted&&!$.state.isVisible||q.isTouch||s&&"focus"===s.type?0:y($.props.delay,t?0:1,Z.delay)}function ht(t,e,n){var r;(void 0===n&&(n=!0),it.forEach(function(n){h(n,t)&&n[t].apply(n,e)}),n)&&(r=$.props)[t].apply(r,e)}function bt(){var t=$.props.aria;if(t){var e="aria-"+t,n=Y.id;U($.props.triggerTarget||r).forEach(function(t){var r=t.getAttribute(e);if($.state.isVisible)t.setAttribute(e,r?r+" "+n:n);else{var i=r&&r.replace(n,"").trim();i?t.setAttribute(e,i):t.removeAttribute(e)}})}}function yt(){ot||U($.props.triggerTarget||r).forEach(function(t){$.props.interactive?t.setAttribute("aria-expanded",$.state.isVisible&&t===ft()?"true":"false"):t.removeAttribute("aria-expanded")})}function wt(){F.body.removeEventListener("mouseleave",Ut),F.removeEventListener("mousemove",I),vt=vt.filter(function(t){return t!==I})}function Et(t){if(!$.props.interactive||!_.contains(t.target)){if(ft().contains(t.target)){if(q.isTouch)return;if($.state.isVisible&&P($.props.trigger,"click"))return}!0===$.props.hideOnClick&&(g=!1,$.clearDelayTimeouts(),$.hide(),b=!0,setTimeout(function(){b=!1}),$.state.isMounted||Tt())}}function At(){F.addEventListener("mousedown",Et,!0)}function Tt(){F.removeEventListener("mousedown",Et,!0)}function xt(t,e){function n(t){t.target===Y&&(lt(Y,"remove",n),e())}if(0===t)return e();lt(Y,"remove",f),lt(Y,"add",n),f=n}function Ct(t,e,n){void 0===n&&(n=!1),U($.props.triggerTarget||r).forEach(function(r){r.addEventListener(t,e,n),A.push({node:r,eventType:t,handler:e,options:n})})}function It(){ut()&&(Ct("touchstart",Dt,n),Ct("touchend",kt,n)),V($.props.trigger).forEach(function(t){if("manual"!==t)switch(Ct(t,Dt),t){case"mouseenter":Ct("mouseleave",kt);break;case"focus":Ct(J?"focusout":"blur",Mt);break;case"focusin":Ct("focusout",Mt)}})}function Ot(){A.forEach(function(t){var e=t.node,n=t.eventType,r=t.handler,i=t.options;e.removeEventListener(n,r,i)}),A=[]}function Dt(t){var e=!1;if($.state.isEnabled&&!St(t)&&!b){if(s=t,d=t.currentTarget,yt(),!$.state.isVisible&&T(t)&&vt.forEach(function(e){return e(t)}),"click"!==t.type||P($.props.trigger,"mouseenter")&&!g||!1===$.props.hideOnClick||!$.state.isVisible){var n=at(),r=n[0],i=n[1];q.isTouch&&"hold"===r&&i?o=setTimeout(function(){Bt(t)},i):Bt(t)}else e=!0;"click"===t.type&&(g=!e),e&&Ut(t)}}function Lt(t){S(t.target,function(t){return t===r||t===_})||function(t,e){var n=e.clientX,r=e.clientY;return t.every(function(t){var e=t.popperRect,i=t.tooltipRect,o=t.interactiveBorder,a=Math.min(e.top,i.top),p=Math.max(e.right,i.right),u=Math.max(e.bottom,i.bottom),s=Math.min(e.left,i.left);return a-r>o||r-u>o||s-n>o||n-p>o})}(M(_.querySelectorAll(c)).concat(_).map(function(t){var e=t._tippy,n=e.popperChildren.tooltip,r=e.props.interactiveBorder;return{popperRect:t.getBoundingClientRect(),tooltipRect:n.getBoundingClientRect(),interactiveBorder:r}}),t)&&(wt(),Ut(t))}function kt(t){if(!(St(t)||P($.props.trigger,"click")&&g))return $.props.interactive?(F.body.addEventListener("mouseleave",Ut),F.addEventListener("mousemove",I),void N(vt,I)):void Ut(t)}function Mt(t){t.target===ft()&&($.props.interactive&&t.relatedTarget&&_.contains(t.relatedTarget)||Ut(t))}function St(t){var e="ontouchstart"in window,n=P(t.type,"touch"),r=ut();return e&&q.isTouch&&r&&!n||q.isTouch&&!r&&n}function Pt(){var n,i=$.props.popperOptions,o=$.popperChildren.arrow,a=w(i,"flip"),p=w(i,"preventOverflow");function u(t){var e=$.state.currentPlacement;$.state.currentPlacement=t.placement,$.props.flip&&!$.props.flipOnUpdate&&(t.flipped&&($.popperInstance.options.placement=t.placement),C($.popperInstance.modifiers,"flip","enabled",!1)),Y.setAttribute("data-placement",t.placement),!1!==t.attributes["x-out-of-boundaries"]?Y.setAttribute("data-out-of-boundaries",""):Y.removeAttribute("data-out-of-boundaries");var r=rt(t.placement),i=P(["top","bottom"],r),o=P(["bottom","right"],r);Y.style.top="0",Y.style.left="0",Y.style[i?"top":"left"]=(o?1:-1)*n+"px",e&&e!==t.placement&&$.popperInstance.update()}var s=e({eventsEnabled:!1,placement:$.props.placement},i,{modifiers:e({},i&&i.modifiers,{tippyDistance:{enabled:!0,order:0,fn:function(t){n=function(t,e){var n="string"==typeof e&&P(e,"rem"),r=t.documentElement;return r&&n?parseFloat(getComputedStyle(r).fontSize||String(16))*z(e):z(e)}(F,$.props.distance);var e=rt(t.placement),r=R(e,p&&p.padding,n),i=R(e,a&&a.padding,n),o=$.popperInstance.modifiers;return C(o,"preventOverflow","padding",r),C(o,"flip","padding",i),t}},preventOverflow:e({boundariesElement:$.props.boundary},p),flip:e({enabled:$.props.flip,behavior:$.props.flipBehavior},a),arrow:e({element:o,enabled:!!o},w(i,"arrow")),offset:e({offset:$.props.offset},w(i,"offset"))}),onCreate:function(t){u(t),k(i&&i.onCreate,s.onCreate,[t]),Vt()},onUpdate:function(t){u(t),k(i&&i.onUpdate,s.onUpdate,[t]),Vt()}});$.popperInstance=new t(r,_,s)}function Vt(){0===E?(E++,$.popperInstance.update()):l&&1===E&&(E++,_.offsetHeight,l())}function Bt(t){$.clearDelayTimeouts(),$.popperInstance||Pt(),t&&ht("onTrigger",[$,t]),At();var e=gt(!0);e?o=setTimeout(function(){$.show()},e):$.show()}function Ut(t){if($.clearDelayTimeouts(),ht("onUntrigger",[$,t]),$.state.isVisible){if(!(P($.props.trigger,"mouseenter")&&P($.props.trigger,"click")&&P(["mouseleave","mousemove"],t.type)&&g)){var e=gt(!1);e?a=setTimeout(function(){$.state.isVisible&&$.hide()},e):p=requestAnimationFrame(function(){$.hide()})}}else Tt()}}function ht(t,r,i){void 0===r&&(r={}),void 0===i&&(i=[]),i=Z.plugins.concat(r.plugins||i),document.addEventListener("touchstart",j,e({},n,{capture:!0})),window.addEventListener("blur",W);var o=e({},r,{plugins:i}),a=b(t).reduce(function(t,e){var n=e&&gt(e,o);return n&&t.push(n),t},[]);return A(t)?a[0]:a}ht.version="5.2.0",ht.defaultProps=Z,ht.setDefaultProps=function(t){Object.keys(t).forEach(function(e){Z[e]=t[e]})},ht.currentInput=q;var bt={mouseover:"mouseenter",focusin:"focus",click:"click"};var yt={name:"animateFill",defaultValue:!1,fn:function(t){var e=t.popperChildren,n=e.tooltip,r=e.content,i=t.props.animateFill&&!G?function(){var t=I();return t.className=p,D([t],"hidden"),t}():null;function o(){t.popperChildren.backdrop=i}return{onCreate:function(){i&&(o(),n.insertBefore(i,n.firstElementChild),n.setAttribute("data-animatefill",""),n.style.overflow="hidden",t.setProps({animation:"shift-away",arrow:!1}))},onMount:function(){if(i){var t=n.style.transitionDuration,e=Number(t.replace("ms",""));r.style.transitionDelay=Math.round(e/10)+"ms",i.style.transitionDuration=t,D([i],"visible")}},onShow:function(){i&&(i.style.transitionDuration="0ms")},onHide:function(){i&&D([i],"hidden")},onAfterUpdate:function(){o()}}}};var wt={name:"followCursor",defaultValue:!1,fn:function(t){var e,n=t.reference,r=t.popper,i=null,o=H(t.props.triggerTarget||n),a=null,p=!1,u=t.props;function s(){return"manual"===t.props.trigger.trim()}function c(){var e=!!s()||null!==a&&!(0===a.clientX&&0===a.clientY);return t.props.followCursor&&e}function l(){return q.isTouch||"initial"===t.props.followCursor&&t.state.isVisible}function f(){t.popperInstance&&i&&(t.popperInstance.reference=i)}function d(){if(c()||t.props.placement!==u.placement){var e=u.placement,n=e.split("-")[1];p=!0,t.setProps({placement:c()&&n?e.replace(n,"start"===n?"end":"start"):e}),p=!1}}function v(){t.popperInstance&&c()&&(l()||!0!==t.props.followCursor)&&t.popperInstance.disableEventListeners()}function m(){c()?o.addEventListener("mousemove",b):f()}function g(){c()&&b(e)}function h(){o.removeEventListener("mousemove",b)}function b(o){var a=e=o,p=a.clientX,u=a.clientY;if(t.popperInstance&&t.state.currentPlacement){var s=S(o.target,function(t){return t===n}),c=n.getBoundingClientRect(),f=t.props.followCursor,d="horizontal"===f,v="vertical"===f,m=P(["top","bottom"],rt(t.state.currentPlacement)),g=function(t,e){var n=e?t.offsetWidth:t.offsetHeight;return{size:n,x:e?n:0,y:e?0:n}}(r,m),b=g.size,y=g.x,w=g.y;!s&&t.props.interactive||(null===i&&(i=t.popperInstance.reference),t.popperInstance.reference={referenceNode:n,clientWidth:0,clientHeight:0,getBoundingClientRect:function(){return{width:m?b:0,height:m?0:b,top:(d?c.top:u)-w,bottom:(d?c.bottom:u)+w,left:(v?c.left:p)-y,right:(v?c.right:p)+y}}},t.popperInstance.update()),l()&&h()}}return{onAfterUpdate:function(t,e){var n;p||(n=e,Object.keys(n).forEach(function(t){u[t]=B(n[t],u[t])}),e.placement&&d()),e.placement&&v(),requestAnimationFrame(g)},onMount:function(){g(),v()},onShow:function(){s()&&(e=a={clientX:0,clientY:0},d(),m())},onTrigger:function(t,n){a||(T(n)&&(a={clientX:n.clientX,clientY:n.clientY},e=n),d(),m())},onUntrigger:function(){t.state.isVisible||(h(),a=null)},onHidden:function(){h(),f(),a=null}}}};var Et={name:"inlinePositioning",defaultValue:!1,fn:function(t){var e=t.reference;function n(){return!!t.props.inlinePositioning}return{onHidden:function(){n()&&(t.popperInstance.reference=e)},onShow:function(){n()&&(t.popperInstance.reference={referenceNode:e,clientWidth:0,clientHeight:0,getBoundingClientRect:function(){return function(t,e,n){if(n.length<2||null===t)return e;switch(t){case"top":case"bottom":var r=n[0],i=n[n.length-1],o="top"===t,a=r.top,p=i.bottom,u=o?r.left:i.left,s=o?r.right:i.right;return{top:a,bottom:p,left:u,right:s,width:s-u,height:p-a};case"left":case"right":var c=Math.min.apply(Math,n.map(function(t){return t.left})),l=Math.max.apply(Math,n.map(function(t){return t.right})),f=n.filter(function(e){return"left"===t?e.left===c:e.right===l}),d=f[0].top,v=f[f.length-1].bottom;return{top:d,bottom:v,left:c,right:l,width:l-c,height:v-d};default:return e}}(t.state.currentPlacement&&rt(t.state.currentPlacement),e.getBoundingClientRect(),M(e.getClientRects()))}})}}}};var At={name:"sticky",defaultValue:!1,fn:function(t){var e=t.reference,n=t.popper;function r(e){return!0===t.props.sticky||t.props.sticky===e}var i=null,o=null;function a(){var p=r("reference")?(t.popperInstance?t.popperInstance.reference:e).getBoundingClientRect():null,u=r("popper")?n.getBoundingClientRect():null;(p&&Tt(i,p)||u&&Tt(o,u))&&t.popperInstance.update(),i=p,o=u,t.state.isMounted&&requestAnimationFrame(a)}return{onMount:function(){t.props.sticky&&a()}}}};function Tt(t,e){return!t||!e||(t.top!==e.top||t.right!==e.right||t.bottom!==e.bottom||t.left!==e.left)}return X&&function(t){var e=document.createElement("style");e.textContent=t,e.setAttribute("data-tippy-stylesheet","");var n=document.head,r=document.querySelector("head>style,head>link");r?n.insertBefore(e,r):n.appendChild(e)}(".tippy-tooltip[data-animation=fade][data-state=hidden]{opacity:0}.tippy-iOS{cursor:pointer!important;-webkit-tap-highlight-color:transparent}.tippy-popper{pointer-events:none;max-width:calc(100vw - 10px);transition-timing-function:cubic-bezier(.165,.84,.44,1);transition-property:transform}.tippy-tooltip{position:relative;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;background-color:#333;transition-property:visibility,opacity,transform;outline:0}.tippy-tooltip[data-placement^=top]>.tippy-arrow{border-width:8px 8px 0;border-top-color:#333;margin:0 3px;transform-origin:50% 0;bottom:-7px}.tippy-tooltip[data-placement^=bottom]>.tippy-arrow{border-width:0 8px 8px;border-bottom-color:#333;margin:0 3px;transform-origin:50% 7px;top:-7px}.tippy-tooltip[data-placement^=left]>.tippy-arrow{border-width:8px 0 8px 8px;border-left-color:#333;margin:3px 0;transform-origin:0 50%;right:-7px}.tippy-tooltip[data-placement^=right]>.tippy-arrow{border-width:8px 8px 8px 0;border-right-color:#333;margin:3px 0;transform-origin:7px 50%;left:-7px}.tippy-tooltip[data-interactive][data-state=visible]{pointer-events:auto}.tippy-tooltip[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{position:absolute;border-color:transparent;border-style:solid}.tippy-content{padding:5px 9px}"),ht.setDefaultProps({plugins:[yt,wt,Et,At]}),ht.createSingleton=function(t,n,r){void 0===n&&(n={}),void 0===r&&(r=[]),r=n.plugins||r,t.forEach(function(t){t.disable()});var i,o,a=e({},Z,{},n).aria,p=!1,u=t.map(function(t){return t.reference}),s={fn:function(e){function n(t){if(i){var n="aria-"+i;t&&!e.props.interactive?o.setAttribute(n,e.popperChildren.tooltip.id):o.removeAttribute(n)}}return{onAfterUpdate:function(t,n){var r=n.aria;void 0!==r&&r!==a&&(p?(p=!0,e.setProps({aria:null}),p=!1):a=r)},onDestroy:function(){t.forEach(function(t){t.enable()})},onMount:function(){n(!0)},onUntrigger:function(){n(!1)},onTrigger:function(r,p){var s=p.currentTarget,c=u.indexOf(s);s!==o&&(o=s,i=a,e.state.isVisible&&n(!0),e.popperInstance.reference=s,e.setContent(t[c].props.content))}}}};return ht(I(),e({},n,{plugins:[s].concat(r),aria:null,triggerTarget:u}))},ht.delegate=function(t,n,r){void 0===r&&(r=[]),r=n.plugins||r;var i,o,a=[],p=[],u=n.target,s=(i=["target"],o=e({},n),i.forEach(function(t){delete o[t]}),o),c=e({},s,{plugins:r,trigger:"manual"}),l=e({},s,{plugins:r,showOnCreate:!0}),f=ht(t,c);function d(t){if(t.target){var e=t.target.closest(u);if(e)if(P(e.getAttribute("data-tippy-trigger")||n.trigger||Z.trigger,bt[t.type])){var r=ht(e,l);r&&(p=p.concat(r))}}}function v(t,e,n,r){void 0===r&&(r=!1),t.addEventListener(e,n,r),a.push({node:t,eventType:e,handler:n,options:r})}return U(f).forEach(function(t){var e=t.destroy;t.destroy=function(t){void 0===t&&(t=!0),t&&p.forEach(function(t){t.destroy()}),p=[],a.forEach(function(t){var e=t.node,n=t.eventType,r=t.handler,i=t.options;e.removeEventListener(n,r,i)}),a=[],e()},function(t){var e=t.reference;v(e,"mouseover",d),v(e,"focusin",d),v(e,"click",d)}(t)}),f},ht.hideAll=function(t){var e=void 0===t?{}:t,n=e.exclude,r=e.duration;mt.forEach(function(t){var e=!1;n&&(e=g(n)?t.reference===n:t.popper===n.popper),e||t.hide(r)})},ht.roundArrow='<svg viewBox="0 0 18 7" xmlns="http://www.w3.org/2000/svg"><path d="M0 7s2.021-.015 5.253-4.218C6.584 1.051 7.797.007 9 0c1.203-.007 2.416 1.035 3.761 2.782C16.012 7.005 18 7 18 7H0z"/></svg>',ht}(Popper);
        		//# sourceMappingURL=tippy-bundle.iife.min.js.map
        		Libraries.Tooltip = tippy;
        	})(Libraries.Popper);
        
        	/* Utilities */
        	var Utilities = {};
        	
        	Utilities.Dom = Functions.createClass(function() {
        	
        		var _this = this;
        	
        	
        	
        		_this.findParentTag = function(tagName, className, searchDepth) {
        	
        			searchDepth = Number.isInteger(searchDepth) ? searchDepth : 10;
        	
        			var selection = Utilities.Selection.get(),
        	
        				parentTag = null;
        	
        			/* if selection is missing or no anchorNode or focusNode were found then return null */
        	
        			if (!selection || !selection.anchorNode || !selection.focusNode) {
        	
        				return null;
        	
        			}
        	
        			/* define Nodes for start and end of selection */
        	
        			var boundNodes = [
        	
        				selection.anchorNode, /* the Node in which the selection begins */
        	
        				selection.focusNode /* the Node in which the selection ends */
        	
        			];
        	
        			/* for each selection parent Nodes we try to find target tag [with target class name]. It would be saved in parentTag variable */
        	
        			boundNodes.forEach(function(parent) {
        	
        				/* reset tags limit */
        	
        				var searchDepthIterable = searchDepth;
        	
        				while (searchDepthIterable > 0 && parent.parentNode) {
        	
        					/* check tag's name */
        	
        					if (parent.tagName === tagName.toUpperCase()) {
        	
        						/* save the result */
        	
        						parentTag = parent;
        	
        						/* optional additional check for class-name mismatching */
        	
        						if (className && parent.classList && !parent.classList.contains(className)) {
        	
        							parentTag = null;
        	
        						}
        	
        						/* if we have found required tag with class then go out from the cycle */
        	
        						if (parentTag) {
        	
        							break;
        	
        						}
        	
        					}
        	
        					/* target tag was not found. Go up to the parent and check it */
        	
        					parent = parent.parentNode;
        	
        					searchDepthIterable--;
        	
        				}
        	
        			});
        	
        			return parentTag;
        	
        		};
        	
        	
        	
        		_this.expandToTag = function(element) {
        	
        			var selection = Utilities.Selection.get(),
        	
        				range = document.createRange();
        	
        			selection.removeAllRanges();
        	
        			range.selectNodeContents(element);
        	
        			selection.addRange(range);
        	
        		};
        	
        	});
        	Utilities.Tooltip = Functions.createClass(function() {
        		var _this = this;
        	
        	});
        	Utilities.Selection = Functions.createClass(function() {
        		var _this = this;
        	
        		_this.get = function() {
        			return window.getSelection();
        		};
        	
        		_this.getAsString = function() {
        			return _this.get().toString();
        		};
        	
        		_this.getRange = function() {
        			var selection = _this.get();
        			return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
        		};
        	
        		_this.delete = function() {
        			var range = _this.getRange();
        			if (range) {
        				range.deleteContents();
        				return true;
        			}
        			return false;
        		};
        	
        		_this.getContentEditableElement = function() {
        			var anchorElement = _this.getAnchorElement(),
        				contentEditableElement = null;
        			if (anchorElement) {
        				if (anchorElement.contentEditable === true) {
        					contentEditableElement = anchorElement;
        				} else {
        					var t = anchorElement.closest('[contenteditable]');
        					if (t) {
        						contentEditableElement = t;
        					}
        				}
        			}
        			return contentEditableElement;
        		};
        	
        		_this.getAnchorElement = function() {
        			var selection = _this.get();
        			return (selection && selection.anchorNode ? (Functions.isElement(selection.anchorNode) ? selection.anchorNode : selection.anchorNode.parentElement) : null);
        		};
        	});
        	Utilities.Caret = Functions.createClass(function() {
        		var _this = this;
        	
        		var prepareArgs = function(args, array) {
        			args = args || {};
        			if (!Functions.isObject(args)) {
        				throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «args» must be an object.');
        			}
        			var obj = {};
        			if (array.indexOf('element') !== -1) {
        				obj.element = ('element' in args && Functions.isElement(args.element) ? args.element : Utilities.Selection.getContentEditableElement());
        				if (!Functions.isElement(obj.element)) {
        					throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «element» must be an instance of HTMLElement.');
        				}
        			}
        			if (array.indexOf('trim') !== -1) {
        				obj.trim = ('trim' in args && Functions.isBoolean(args.trim) ? args.trim : false);
        			}
        			if (array.indexOf('includeContent') !== -1) {
        				obj.includeContent = ('includeContent' in args && Functions.isBoolean(args.includeContent) ? args.includeContent : false);
        			}
        			if (array.indexOf('type') !== -1) {
        				if (!('type' in args) || ['BEFORE', 'AFTER'].indexOf(args.type) === -1) {
        					throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «type» must be a string BEFORE|AFTER.');
        				}
        				obj.type = args.type;
        			}
        			if (array.indexOf('position') !== -1) {
        				if (!('position' in args) || !Functions.isNumber(args.position) || args.position < 1) {
        					throw new Error('RPEditor: Utilities.Caret.prepareArgs(): «position» must be a number and at least 1.');
        				}
        				obj.position = args.position;
        			}
        			return obj;
        		};
        	
        		_this.getPosition = function(args) {
        			args = prepareArgs(args, ['element', 'trim', 'includeContent']);
        	
        			args.type = 'BEFORE';
        			var textContent,
        				range = getRange(args);
        			if (range) {
        				textContent = range.toString();
        				if (args.trim === true) {
        					textContent = textContent.trim();
        				}
        			}
        			return Functions.isString(textContent) ? textContent.length : null;
        		};
        	
        		_this.setPositionToStart = function(args) {
        			args = prepareArgs(args, ['element']);
        	
        			var range,
        				selection;
        			if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
        				range = document.createRange(); // create a range (a range is a like the selection but invisible)
        				range.selectNodeContents(args.element); // select the entire contents of the element with the range
        				range.collapse(true); // collapse the range to the end point. true means collapse to start rather than the end
        				selection = Utilities.Selection.get(); // get the selection object (allows you to change selection)
        				selection.removeAllRanges(); // remove any selections already made
        				selection.addRange(range); // make the range you have just created the visible selection
        			} else if (document.selection) { // IE 8 and lower
        				range = document.body.createTextRange(); // create a range (a range is a like the selection but invisible)
        				range.moveToElementText(args.element); // select the entire contents of the element with the range
        				range.collapse(true); // collapse the range to the end point. true means collapse to start rather than the end
        				range.select(); // select the range (make it the visible selection
        			}
        		};
        	
        		_this.setPositionToEnd = function(args) {
        			args = prepareArgs(args, ['element']);
        	
        			var range,
        				selection;
        			if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
        				range = document.createRange(); // create a range (a range is a like the selection but invisible)
        				range.selectNodeContents(args.element); // select the entire contents of the element with the range
        				range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
        				selection = Utilities.Selection.get(); // get the selection object (allows you to change selection)
        				selection.removeAllRanges(); // remove any selections already made
        				selection.addRange(range); // make the range you have just created the visible selection
        			} else if (document.selection) { // IE 8 and lower
        				range = document.body.createTextRange(); // create a range (a range is a like the selection but invisible)
        				range.moveToElementText(args.element); // select the entire contents of the element with the range
        				range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
        				range.select(); // select the range (make it the visible selection
        			}
        		};
        	
        		_this.setPosition = function(args) {
        			args = prepareArgs(args, ['element', 'position']);
        	
        			if (args.position === 0) {
        				return;
        			}
        	
        			var selection = Utilities.Selection.get();
        			if (!selection) {
        				return;
        			}
        	
        			var createRange = function(node, position, range) {
        				if (!range) {
        					range = document.createRange()
        					range.selectNode(node);
        					range.setStart(node, 0);
        				}
        				if (position.count === 0) {
        					range.setEnd(node, position.count);
        				} else if (node && position.count > 0) {
        					if (node.nodeType === Node.TEXT_NODE) {
        						if (node.textContent.length < position.count) {
        							position.count -= node.textContent.length;
        						} else {
        							range.setEnd(node, position.count);
        							position.count = 0;
        						}
        					} else {
        						for (var lp = 0; lp < node.childNodes.length; lp++) {
        							range = createRange(node.childNodes[lp], position, range);
        	
        							if (position.count === 0) {
        								break;
        							}
        						}
        					}
        				} 
        				return range;
        			};
        	
        			var range = createRange(args.element, {count: args.position});
        			if (range) {
        				range.collapse(false);
        				selection.removeAllRanges();
        				selection.addRange(range);
        			}
        		};
        	
        		_this.isAtStart = function(args) {
        			args = prepareArgs(args, ['element', 'trim']);
        	
        			return _this.getPosition(args) === 0;
        		};
        	
        		_this.isAtEnd = function(args) {
        			args = prepareArgs(args, ['element', 'trim', 'includeContent']);
        	
        			var textContent = args.element.textContent;
        			if (args.trim === true) {
        				textContent = textContent.trim();
        			}
        			return _this.getPosition(args) === textContent.length;
        		};
        	
        		var getRange = function(args) {
        			args = prepareArgs(args, ['element', 'type', 'includeContent']);
        	
        			var range = Utilities.Selection.getRange();
        			if (range) {
        				var _ = [],
        					clonedRange = range.cloneRange();
        				clonedRange.selectNodeContents(args.element);
        				if (args.type === 'BEFORE') {
        					_.push('setEnd');
        					_.push(args.includeContent ? range.endContainer : range.startContainer);
        					_.push(args.includeContent ? 'endOffset' : 'startOffset');
        				}
        				else if (args.type === 'AFTER') {
        					_.push('setStart');
        					_.push(args.includeContent ? range.startContainer : range.endContainer);
        					_.push(args.includeContent ? 'startOffset' : 'endOffset');
        				}
        				clonedRange[_[0]](_[1], range[_[2]]);
        				return clonedRange;
        			}
        			return null;
        		};
        	
        		_this.getRangeToPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			args.type = 'BEFORE';
        			return getRange(args);
        		};
        	
        		_this.getRangeFromPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			args.type = 'AFTER';
        			return getRange(args);
        		};
        	
        		_this.getFragmentToPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			var range = _this.getRangeToPosition(args);
        			return range ? range.cloneContents() : null;
        		};
        	
        		_this.getFragmentFromPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			var range = _this.getRangeFromPosition(args);
        			return range ? range.cloneContents() : null;
        		};
        	
        		_this.extractFragmentToPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			var range = _this.getRangeToPosition(args);
        			return range ? range.extractContents() : null;
        		};
        	
        		_this.extractFragmentFromPosition = function(args) {
        			args = prepareArgs(args, ['element', 'includeContent']);
        	
        			var range = _this.getRangeFromPosition(args);
        			return range ? range.extractContents() : null;
        		};
        	
        		/*_this.extractTextFromPosition = function(element) {
        			if (!Functions.isInstanceOf(element, HTMLElement)) {
        				throw new Error('RPEditor: Utilities.Caret.isAtStart(): «element» must be an instance of HTMLElement.');
        			}
        	
        			var extractedFragment = Utilities.Caret.extractFragmentFromPosition(element);
        			if (extractedFragment) {
        				var wrapper = UI.createElement('div');
        				wrapper.appendChild(extractedFragment);
        				return wrapper.innerHTML;
        			}
        		};*/
        	
        		/*_this.splitTextsOnPosition = function(element) {
        			if (!Functions.isInstanceOf(element, HTMLElement)) {
        				throw new Error('RPEditor: Utilities.Caret.isAtStart(): «element» must be an instance of HTMLElement.');
        			}
        	
        			var splittedFragments = Utilities.Caret.splitFragmentsOnPosition(element);
        			if (splittedFragments) {
        				var wrapper = UI.createElement('div');
        	
        				wrapper.appendChild(splittedFragments[0]);
        				var before = wrapper.innerHTML;
        	
        				wrapper.innerHTML = '';
        				wrapper.appendChild(splittedFragments[1]);
        				var after = wrapper.innerHTML;
        	
        				return [before, after];
        			}
        		};*/
        	});
        	Utilities.Shortcut = Functions.createClass(function() {
        		var _this = this;
        	
        	});
        
        	/* UI */
        	var UI = Functions.createClass(function(_editor) {
        		var _this = this,
        			elements = {};
        	
        		/* Styles */
        		(function() {
        			var _ = (function(_this) {
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
        			})();
        			Object.defineProperty(_this, 'Styles', { get: function() { return _; } });
        		})();
        	
        		/* Form */
        		(function() {
        			var _ = (function(_this) {
        				return (function() {
        					var Elements = (function() {
        						return (function() {
        							var TextField = (function() {
        								return function TextField(field, name, labelText, placeholderText) {
        									var _this = this,
        										container,
        										value;
        								
        									/* constructor */
        									_this._constructor = function(_value) {
        										value = _value;
        									};
        								
        									/* render ui */
        									_this.render = function() {
        										container = api.Classes.UI.createElement('div');
        										// render label
        										if (labelText) {
        											container.appendChild(renderLabel());
        										}
        										// render field
        										container.appendChild(renderField());
        								
        										return container;
        									};
        								
        									var renderLabel = function() {
        										var container = api.Classes.UI.createElement('div'),
        											label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
        										container.appendChild(label);
        										return container;
        									};
        								
        									var renderField = function() {
        										var container = api.Classes.UI.createElement('div'),
        										element = api.Classes.UI.createElement('input', {className: 'field field-text', placeholder: (placeholderText || ''), name: _this.getName(), value: _this.getValue()});
        										element.style.width = '100%';
        										element.addEventListener('keyup', function(event) {
        											value = this.value;
        										});
        										container.appendChild(element);
        										return container;
        									};
        								
        									/* get name */
        									_this.getName = function() {
        										return name;
        									};
        								
        									/* get value */
        									_this.getValue = function() {
        										return value;
        									};
        								};
        							})();
        							var FileBrowserField = (function() {
        								return function FileBrowserField(field, name, labelText, placeholderText) {
        									var _this = this,
        										container,
        										hiddenField,
        										value;
        								
        									/* constructor */
        									_this._constructor = function(_value) {
        										value = _value;
        									};
        								
        									/* render ui */
        									_this.render = function() {
        										container = api.Classes.UI.createElement('div');
        										// render label
        										if (labelText) {
        											container.appendChild(renderLabel());
        										}
        										// render field
        										renderField();
        								
        										return container;
        									};
        								
        									var renderLabel = function() {
        										var container = api.Classes.UI.createElement('div'),
        											label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
        										container.appendChild(label);
        										return container;
        									};
        								
        									var renderField = function() {
        										api.Functions.ajax({
        											url: '/api/v1/files/templates/widget.html?widget_id={{WIDGET_ID}}&id={{ID}}&settings[types][]=image&settings[preview]=true&settings[prefix]=false',
        											onSuccess: function(data, xhr) {
        												data = data.replace(new RegExp('{{WIDGET_ID}}', 'g'), name).replace(new RegExp('{{ID}}', 'g'), name);
        												var wrapper = api.Classes.UI.createElement('div', {innerHTML: data});
        												var children = wrapper.children;
        												for (var i = 0; i < children.length; i++) {
        													container.appendChild(children[i]);
        												}
        								
        												hiddenField = container.querySelector('#' + name);
        												hiddenField.value = (api.Functions.isObject(value) ? JSON.stringify(value) : value);
        								
        												(function(scriptTag) {
        													if (scriptTag) {
        														eval(scriptTag[0].replace('<script>', '').replace('</script>', ''));
        													}
        												})(data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi));
        											},
        											onFailure: function(status, xhr) {
        												response.status = 'FALSE';
        												// callback
        												if (api.Functions.isFunction(callback)) {
        													callback(response);
        												}
        											}
        										});
        									};
        								
        									/* get name */
        									_this.getName = function() {
        										return name;
        									};
        								
        									/* get value */
        									_this.getValue = function() {
        										return (hiddenField && hiddenField.value && api.Functions.isJSON(hiddenField.value) ? JSON.parse(hiddenField.value) : {});
        									};
        								};
        							})();
        							var ImageGalleryBrowserField = (function() {
        								return function ImageGalleryBrowserField(field, name, labelText, placeholderText) {
        									var _this = this,
        										container,
        										hiddenField,
        										value;
        								
        									/* constructor */
        									_this._constructor = function(_value) {
        										value = _value;
        									};
        								
        									/* render ui */
        									_this.render = function() {
        										container = api.Classes.UI.createElement('div');
        										// render label
        										if (labelText) {
        											container.appendChild(renderLabel());
        										}
        										// render field
        										renderField();
        								
        										return container;
        									};
        								
        									var renderLabel = function() {
        										var container = api.Classes.UI.createElement('div'),
        											label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
        										container.appendChild(label);
        										return container;
        									};
        								
        									var renderField = function() {
        										api.Functions.ajax({
        											url: '/api/v1/galleries/templates/widget.html?widget_id={{WIDGET_ID}}&id={{ID}}&settings[types][]=image&settings[preview]=true',
        											onSuccess: function(data, xhr) {
        												data = data.replace(new RegExp('{{WIDGET_ID}}', 'g'), name).replace(new RegExp('{{ID}}', 'g'), name);
        												var wrapper = api.Classes.UI.createElement('div', {innerHTML: data});
        												var children = wrapper.children;
        												for (var i = 0; i < children.length; i++) {
        													container.appendChild(children[i]);
        												}
        								
        												hiddenField = container.querySelector('#' + name);
        												hiddenField.value = value;
        								
        												(function(scriptTag) {
        													if (scriptTag) {
        														eval(scriptTag[0].replace('<script>', '').replace('</script>', ''));
        													}
        												})(data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi));
        											},
        											onFailure: function(status, xhr) {
        												response.status = 'FALSE';
        												// callback
        												if (api.Functions.isFunction(callback)) {
        													callback(response);
        												}
        											}
        										});
        									};
        								
        									/* get name */
        									_this.getName = function() {
        										return name;
        									};
        								
        									/* get value */
        									_this.getValue = function() {
        										return hiddenField && hiddenField.value ? JSON.parse(hiddenField.value) : '';
        									};
        								};
        							})();
        							var BoxBrowserField = (function() {
        								return function BoxBrowserField(field, name, labelText, placeholderText) {
        									var _this = this,
        										container,
        										hiddenField,
        										value;
        								
        									/* constructor */
        									_this._constructor = function(_value) {
        										value = _value;
        									};
        								
        									/* render ui */
        									_this.render = function() {
        										container = api.Classes.UI.createElement('div');
        										// render label
        										if (labelText) {
        											container.appendChild(renderLabel());
        										}
        										// render field
        										renderField();
        								
        										return container;
        									};
        								
        									var renderLabel = function() {
        										var container = api.Classes.UI.createElement('div'),
        											label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
        										container.appendChild(label);
        										return container;
        									};
        								
        									var renderField = function() {
        										api.Functions.ajax({
        											url: '/api/v1/boxes/templates/widget.html?widget_id={{WIDGET_ID}}&id={{ID}}',
        											onSuccess: function(data, xhr) {
        												data = data.replace(new RegExp('{{WIDGET_ID}}', 'g'), name).replace(new RegExp('{{ID}}', 'g'), name);
        												var wrapper = api.Classes.UI.createElement('div', {innerHTML: data});
        												var children = wrapper.children;
        												for (var i = 0; i < children.length; i++) {
        													container.appendChild(children[i]);
        												}
        								
        												hiddenField = container.querySelector('#' + name);
        												hiddenField.value = value;
        								
        												(function(scriptTag) {
        													if (scriptTag) {
        														eval(scriptTag[0].replace('<script>', '').replace('</script>', ''));
        													}
        												})(data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi));
        											},
        											onFailure: function(status, xhr) {
        												response.status = 'FALSE';
        												// callback
        												if (api.Functions.isFunction(callback)) {
        													callback(response);
        												}
        											}
        										});
        									};
        								
        									/* get name */
        									_this.getName = function() {
        										return name;
        									};
        								
        									/* get value */
        									_this.getValue = function() {
        										return hiddenField && hiddenField.value ? JSON.parse(hiddenField.value) : '';
        									};
        								};
        							})();
        							var FactboxBrowserField = (function() {
        								return function FactboxBrowserField(field, name, labelText, placeholderText) {
        									var _this = this,
        										container,
        										hiddenField,
        										value;
        								
        									/* constructor */
        									_this._constructor = function(_value) {
        										value = _value;
        									};
        								
        									/* render ui */
        									_this.render = function() {
        										container = api.Classes.UI.createElement('div');
        										// render label
        										if (labelText) {
        											container.appendChild(renderLabel());
        										}
        										// render field
        										renderField();
        								
        										return container;
        									};
        								
        									var renderLabel = function() {
        										var container = api.Classes.UI.createElement('div'),
        											label = api.Classes.UI.createElement('label', {textContent: (labelText || '')});
        										container.appendChild(label);
        										return container;
        									};
        								
        									var renderField = function() {
        										api.Functions.ajax({
        											url: '/api/v1/factboxes/templates/widget.html?widget_id={{WIDGET_ID}}&id={{ID}}&settings[types][]=image&settings[preview]=true',
        											onSuccess: function(data, xhr) {
        												data = data.replace(new RegExp('{{WIDGET_ID}}', 'g'), name).replace(new RegExp('{{ID}}', 'g'), name);
        												var wrapper = api.Classes.UI.createElement('div', {innerHTML: data});
        												var children = wrapper.children;
        												for (var i = 0; i < children.length; i++) {
        													container.appendChild(children[i]);
        												}
        								
        												hiddenField = container.querySelector('#' + name);
        												hiddenField.value = value;
        								
        												(function(scriptTag) {
        													if (scriptTag) {
        														eval(scriptTag[0].replace('<script>', '').replace('</script>', ''));
        													}
        												})(data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi));
        											},
        											onFailure: function(status, xhr) {
        												response.status = 'FALSE';
        												// callback
        												if (api.Functions.isFunction(callback)) {
        													callback(response);
        												}
        											}
        										});
        									};
        								
        									/* get name */
        									_this.getName = function() {
        										return name;
        									};
        								
        									/* get value */
        									_this.getValue = function() {
        										return hiddenField && hiddenField.value ? JSON.parse(hiddenField.value) : '';
        									};
        								};
        							})();
        							return {
        								get TextField() { return TextField; },
        								get FileBrowserField() { return FileBrowserField; },
        								get ImageGalleryBrowserField() { return ImageGalleryBrowserField; },
        								get BoxBrowserField() { return BoxBrowserField; },
        								get FactboxBrowserField() { return FactboxBrowserField; }
        							};
        						})();
        					})();
        					return {
        						get Elements() { return Elements; }
        					};
        				})();
        			})();
        			Object.defineProperty(_this, 'Form', { get: function() { return _; } });
        		})();
        	
        		/* render ui */
        		_this.render = function() {
        			// create editor element
        			elements.editor = _this.createElement(COMPONENT_TAG_NAME + '-wrapper');
        			// add editor element
        			Core.Config.webcomponent.appendChild(elements.editor);
        		};
        	
        		/* create toolbar element */
        		_this.createToolbarElement = function(type) {
        			var element = _this.createElement(COMPONENT_TAG_NAME + '-toolbar');
        			if (element.setType(type)) {
        				return element;
        			}
        			return null;
        		};
        	
        		/* create toolbar section element */
        		_this.createToolbarSectionElement = function() {
        			return _this.createElement(COMPONENT_TAG_NAME + '-toolbar-section');
        		};
        	
        		/* create toolbar element */
        		_this.createToolbarButtonElement = function(type) {
        			var element = _this.createElement(COMPONENT_TAG_NAME + '-toolbar-button');
        			if (element.setType(type)) {
        				return element;
        			}
        			return null;
        		};
        	
        		/* get an element */
        		_this.getElement = function(name) {
        			return name in elements ? elements[name] : null;
        		};
        	
        		_this.createElement = function(tagName, opts) {
        			opts = opts || {};
        			var element = document.createElement(tagName);
        			for (var opt in opts) {
        				element[opt] = opts[opt];
        			};
        			return element;
        		};
        	
        		_this.createEditableElement = function(opts) {
        			return _this.createElement(COMPONENT_TAG_NAME + '-editable', opts);
        		};
        	
        		/* create tooltip for an element */
        		_this.createTooltip = function(element, content) {
        			return Libraries.Tooltip(element, {
        				content: content,
        				delay: [350, 0]
        			});
        		};
        	
        		/* create modal */
        		_this.createModal = function() {
        			var modal = new Libraries.Modal();
        			// add created listener
        			modal.addEventListener('created', function() {
        				// set z-index
        				modal.getElement('overlay').style.zIndex = Libraries.Counter.increase();
        			});
        	
        			var disabledListener = function() {
        				Core.Config.webcomponent.removeEventListener('disabled', disabledListener);
        				// close modal
        				modal.close();
        			};
        			Core.Config.webcomponent.addEventListener('disabled', disabledListener);
        	
        			return modal;
        		};
        	
        		/* set editor disabled */
        		_this.setEditorDisabled = function(status) {
        			if (Functions.isBoolean(status)) {
        				elements.editor.classList.toggle('is-disabled', status);
        				if (status) {
        					elements.editor.querySelectorAll('[contenteditable]').forEach(function(element) {
        						element.contentEditable = false;
        						element.classList.add('is-disabled');
        					});
        				} else {
        					elements.editor.querySelectorAll('.is-disabled').forEach(function(element) {
        						element.classList.remove('is-disabled');
        						element.contentEditable = true;
        					});
        				}
        				return true;
        			}
        			return false;
        		};
        	
        		/* set editor focus */
        		_this.setEditorFocus = function(status) {
        			if (Functions.isBoolean(status)) {
        				elements.editor.classList.toggle('is-focused', status);
        				return true;
        			}
        			return false;
        		};
        	
        		_this.getAllContentEditableElements = function() {
        			// return Array.from(elements.editor.querySelectorAll('[contenteditable]'));
        			return elements.editor.querySelectorAll('[contenteditable]');
        		};
        	}, [], [Editor]);
        
        	/* block */
        	var Block = function(key, data, properties) {
        		var _this = this,
        			instance,
        			blockList,
        			container,
        			SettingsUI,
        			fieldList,
        			fieldAutoFocus,
        			toolbar,
        			settings,
        			data = Functions.isArray(data) ? data : [],
        			properties = Functions.isObject(properties) ? properties : {};
        	
        		/* constructor */
        		_this._constructor = function() {
        			// create instance
        			createInstance();
        	
        			// parse and set settings
        			settings = Functions.parseObject(
        				Functions.trigger(instance.settings),
        				[
        					{
        						name: 'name',
        						validate: Functions.isString,
        						defaultValue: ''
        					},
        					{
        						name: 'icon',
        						validate: Functions.isString,
        						defaultValue: ''
        					}
        				]
        			);
        	
        			// create toolbar
        			toolbar = Functions.createClass(BlockToolbar, [], [_this]);
        	
        			// create settings ui
        			SettingsUI = Functions.createClass(SettingsUI, [_this, toolbar]);
        			Functions.trigger(SettingsUI.initialize);
        		};
        	
        		/* create instance */
        		var createInstance = function() {
        			var block = Blocks.getByKey(key);
        			if (!block) {
        				throw new Error('RPEditor: Block.createInstance(): block «' + key + '» not found.');
        			}
        			instance = Functions.createClass(block, [], [_this, api]);
        		};
        	
        		/* initialize */
        		_this.initialize = function(_blockList) {
        			blockList = _blockList || Functions.createClass(BlockList);
        	
        			// create field container
        			fieldList = Functions.createClass(FieldList, [], [_this]);
        	
        			// call instance method
        			Functions.trigger(instance.initialize, false, [data]);
        	
        			// render ui
        			render();
        	
        			// call toolbar instance method
        			Functions.trigger(toolbar.initialize);
        	
        			// create block chooser
        			var blockChooser = Functions.createClass(BlockChooser, [], [_this.getList(), _this]);
        			Functions.trigger(blockChooser.render, true);
        	
        			// bind events
        			bindEvents();
        		};
        	
        		_this.getKey = function() {
        			return key;
        		};
        	
        		_this.getName = function() {
        			if (settings.name) {
        				return settings.name;
        			}
        			return 'nicht definierter Block';
        		};
        	
        		_this.getIcon = function() {
        			if (settings.icon) {
        				return settings.icon;
        			}
        			return '<i class="fa fa-exclamation-triangle"></i>';
        		};
        	
        		/* render ui */
        		var render = function() {
        			// load css
        			loadCss();
        	
        			container = UI.createElement(COMPONENT_TAG_NAME + '-block');
        			container.setAttribute('type', Functions.escapeText(key));
        			container.setAttribute('name', Functions.escapeText(_this.getName()));
        			blockList.getContainer().insertBefore(container, blockList.getContainer().children[_this.getPosition()]);
        	
        			// render toolbar
        			renderToolbar();
        	
        			// call instance method
        			Functions.trigger(instance.render);
        		};
        	
        		/* load css */
        		var loadCss = function() {
        			// call instance method
        			var css = Functions.trigger(instance.css);
        			if (Functions.isObject(css)) {
        				UI.Styles.add('block/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block[type="' + Functions.escapeText(key) + '"]');
        			}
        		};
        	
        		/* settings ui */
        		SettingsUI = function() {
        			var _this = this,
        				Block,
        				Toolbar,
        				modal;
        	
        			/* constructor */
        			_this._constructor = function(_Block, _Toolbar) {
        				Block = _Block;
        				Toolbar = _Toolbar;
        			};
        	
        			var createModal = function() {
        				// create modal
        				var modal = UI.createModal();
        				// set title
        				modal.setTitle('Blockeinstellungen');
        				// set body
        				modal.clearBody();
        				var fields = Functions.trigger(instance.modalSettings, true);
        				if (Functions.isArray(fields)) {
        					fields.forEach(function(field) {
        						Functions.trigger(field.initialize, true, [Block.getFieldList().getByKey(field.getKey())]);
        						modal.appendBody(Functions.trigger(field.render));
        					});
        				}
        				// set buttons
        				modal.setButtons([
        					{
        						label: 'Übernehmen',
        						onClick: function(event) {
        							instance.updateSettings(fields);
        							_this.close();
        						}
        					},
        					{
        						label: 'Abbrechen',
        						onClick: function(event) {
        							_this.close();
        						}
        					}
        				]);
        				return modal;
        			};
        	
        			/* open */
        			_this.open = function() {
        				if (!Block.hasBlockSettings()) {
        					return;
        				}
        				// create modal
        				modal = createModal();
        				// open modal
        				modal.open(function() {
        					// unfocus block
        					Block.unfocus();
        				});
        			};
        	
        			/* close */
        			_this.close = function() {
        				if (!modal || !Block.hasBlockSettings()) {
        					return;
        				}
        				// close modal
        				modal.close(function() {
        					// focus block
        					Block.focus();
        					// reset modal variable
        					modal = undefined;
        				});
        			};
        		};
        	
        		/* render toolbar ui */
        		var renderToolbar = function() {
        			// call instance method
        			return Functions.trigger(instance.renderToolbar, false, [_this]);
        		};
        	
        		/* bind events */
        		var bindEvents = function() {
        			// editor disabled
        			Core.Config.webcomponent.addEventListener('disabled', function(event) {
        				// if editor is disabled
        				if (event.detail) {
        					// unfocus
        					_this.unfocus();
        				}
        			});
        			// mouse enter
        			container.addEventListener('mouseenter', function(event) {
        				this.classList.add('is-hovered');
        			});
        			// mouse leave
        			container.addEventListener('mouseleave', function(event) {
        				this.classList.remove('is-hovered');
        			});
        			// click
        			container.addEventListener('click', function(event) {
        				event.stopPropagation();
        				// focus block
        				if (_this.getContainer().contains(event.target) && !toolbar.getElement().contains(event.target)) {
        					_this.focus();
        				}
        			}, false);
        		};
        	
        		_this.triggerEvent = function(obj) {
        			// custom event "change"
        			Core.dispatchEvent('change', {
        				detail: Object.assign({blockData: null}, obj, {blockData: fieldList.getBlock().getJson()}),
        				bubbles: true,
        				cancelable: true
        			});
        			// trigger update
        			fieldList.getBlock().getList().triggerEvent('update');
        		};
        	
        		_this.focus = function() {
        			// if editor is disabled, abort
        			if (Core.isDisabled()) {
        				return;
        			}
        			// unfocus old block
        			if (selectedBlock && selectedBlock !== _this) {
        				selectedBlock.unfocus();
        			}
        			// focus
        			selectedBlock = _this;
        			container.classList.add('is-focused');
        			// show toolbar
        			toolbar.show();
        		};
        	
        		_this.unfocus = function() {
        			selectedBlock = null;
        			container.classList.remove('is-focused');
        			// remove hovered
        			container.classList.remove('is-hovered');
        			// hide toolbar
        			toolbar.hide();
        			// unfocus field
        			if (selectedField) {
        				selectedField.unfocus();
        			}
        		};
        	
        		_this.getList = function() {
        			return blockList;
        		};
        	
        		_this.getFieldList = function() {
        			return fieldList;
        		};
        	
        		_this.getPosition = function() {
        			return blockList.getAll().indexOf(_this);
        		};
        	
        		_this.getSetting = function(key, defaultValue) {
        			return key in settings && settings[key] ? settings[key] : defaultValue ? defaultValue : null;
        		};
        	
        		_this.getSettings = function(key) {
        			return settings;
        		};
        	
        		_this.hasBlockSettings = function() {
        			return Functions.isFunction(instance.modalSettings);
        		};
        	
        		_this.getSettingsUI = function() {
        			return SettingsUI;
        		};
        	
        		_this.getContainer = function() {
        			return container;
        		};
        	
        		_this.getToolbar = function() {
        			return toolbar;
        		};
        	
        		_this.getInstance = function() {
        			return instance;
        		};
        	
        		/*
        		{
        			type: 'text',
        			name: 'title',
        			autofocus: true|false,
        			label: 'Titel',
        			settings: {
        				inlineTools: true|false,
        				enableLineBreaks: true|false
        			}
        		}
        		*/
        		_this.createField = function(opts) {
        			var options = {
        					type: ('type' in opts && Functions.isString(opts.type) ? opts.type : null),
        					name: ('name' in opts && Functions.isString(opts.name) ? opts.name : null),
        					autofocus: ('autofocus' in opts && Functions.isBoolean(opts.autofocus) ? opts.autofocus : false),
        					label: ('label' in opts && Functions.isString(opts.label) ? opts.label : null),
        					settings: ('settings' in opts && Functions.isObject(opts.settings) ? opts.settings : null)
        				},
        				_settings = {},
        				_data = null;
        	
        			for (var i in data) {
        				if (Functions.isObject(data[i]) && data[i].type === options.type && data[i].name === options.name) {
        					_settings = Functions.isObject(data[i].settings) ? data[i].settings : {};
        					//_data = Functions.isObject(data[i].data) ? data[i].data : {};
        					_data = data[i].data || _data;
        					break;
        				}
        			}
        	
        			var field = Functions.createClass(Field, [options], [_settings, _data, _this]);
        	
        			if (options.autofocus === true) {
        				fieldAutoFocus = field;
        			}
        	
        			return fieldList.add(options.name, field);
        		};
        	
        		_this.getAutoFocusField = function() {
        			return fieldAutoFocus;
        		};
        	
        		_this.moveUp = function() {
        			var oldPosition = _this.getPosition(),
        				newPosition = oldPosition - 1;
        			if (newPosition >= 0 && _this.getContainer().previousElementSibling) {
        				// move ui
        				_this.getContainer().parentNode.insertBefore(_this.getContainer(), _this.getContainer().previousElementSibling);
        				// move block in block list
        				blockList.setPosition(_this, newPosition);
        				// custom event "block-moved"
        				Core.dispatchEvent('block-moved', {
        					detail: {
        						data: _this.getJson(),
        						oldPosition: oldPosition,
        						newPosition: newPosition
        					},
        					bubbles: true,
        					cancelable: true
        				});
        				// trigger update
        				blockList.triggerEvent('update');
        			}
        		};
        	
        		_this.moveDown = function() {
        			var oldPosition = _this.getPosition(),
        				newPosition = oldPosition + 1;
        			if (newPosition < blockList.length() && _this.getContainer().nextElementSibling) {
        				// move ui
        				_this.getContainer().parentNode.insertBefore(_this.getContainer().nextElementSibling, _this.getContainer());
        				// move block in block list
        				blockList.setPosition(_this, newPosition);
        				// custom event "block-moved"
        				Core.dispatchEvent('block-moved', {
        					detail: {
        						data: _this.getJson(),
        						oldPosition: oldPosition,
        						newPosition: newPosition
        					},
        					bubbles: true,
        					cancelable: true
        				});
        				// trigger update
        				blockList.triggerEvent('update');
        			}
        		};
        	
        		_this.delete = function() {
        			var position = _this.getPosition();
        			// remove ui
        			container.remove();
        			// delete block from block list
        			blockList.delete(_this);
        			// custom event "block-deleted"
        			Core.dispatchEvent('block-deleted', {
        				detail: {
        					data: _this.getJson(),
        					position: position + 1
        				},
        				bubbles: true,
        				cancelable: true
        			});
        			// trigger update
        			blockList.triggerEvent('update');
        		};
        	
        		_this.getAllProperties = function() {
        			return properties;
        		};
        	
        		_this.getProperty = function(key, defaultValue) {
        			return key in properties ? properties[key] : defaultValue;
        		};
        	
        		_this.setProperty = function(key, value, triggerEvent) {
        			if ((!(key in properties) && value === '') || (key in properties && properties[key] === value)) {
        				return;
        			}
        	
        			var oldValue = key in properties ? properties[key] : null;
        	
        			if (value === '') {
        				delete properties[key];
        			} else {
        				properties[key] = value;
        			}
        	
        			if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
        				_this.triggerEvent({type: 'PROPERTY', key: key, oldValue: oldValue, newValue: value});
        			}
        		};
        	
        		_this.getJson = function() {
        			var json = {
        				type: key,
        				fields: fieldList.getJson()
        			};
        	
        			(function(properties, prefix) {
        				for (var key in properties) {
        					json[prefix + key] = properties[key];
        				}
        			})(_this.getAllProperties(), Core.getBlockPropertyPrefix());
        	
        			return json;
        		};
        	
        		_this.clone = function() {
        			return Functions.createClass(Block, [], [_this.getKey(), _this.getJson().fields]);
        		};
        	
        		_this.getPrevious = function() {
        			return _this.getList().getPreviousByBlock(_this);
        		};
        	
        		_this.getNext = function() {
        			return _this.getList().getNextByBlock(_this);
        		};
        	};
        
        		/* block tunes */
        		var BlockTunes = Functions.createClass(function() {
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
        		
        			_this.add = function(key, tool) {
        				if (!(key in list)) {
        					list[key] = tool;
        					return tool;
        				}
        				return false;
        			};
        		
        			_this.length = function() {
        				return Object.keys(list).length;
        			};
        		});
        
        		/* block tune */
        		var BlockTune = function(key, _Toolbar) {
        			var _this = this,
        				blockTune,
        				instance,
        				container,
        				settings;
        		
        			/* constructor */
        			_this._constructor = function(_blockTune) {
        				if (Functions.isFunction(_blockTune)) {
        					blockTune = _blockTune;
        				}
        				// create instance
        				createInstance();
        		
        				// parse and set settings
        				settings = Functions.parseObject(
        					Functions.trigger(instance.settings),
        					[
        						{
        							name: 'name',
        							validate: Functions.isString,
        							defaultValue: ''
        						},
        						{
        							name: 'icon',
        							validate: Functions.isString,
        							defaultValue: ''
        						}
        					]
        				);
        			};
        		
        			/* create instance */
        			var createInstance = function() {
        				if (!blockTune) {
        					blockTune = BlockTunes.getByKey(_this.getKey());
        				}
        				if (!blockTune) {
        					throw new Error('RPEditor: BlockTune.createInstance(): block tool «' + _this.getKey() + '» not found.');
        				}
        				instance = Functions.createClass(blockTune, [], [_this, api]);
        			};
        		
        			/* initialize */
        			_this.initialize = function() {
        				// call instance method
        				Functions.trigger(instance.initialize, false, [_Toolbar]);
        		
        				// render ui
        				render();
        		
        				// bind events
        				bindEvents();
        			};
        		
        			_this.getKey = function() {
        				return key;
        			};
        		
        			_this.getName = function() {
        				if (settings.name) {
        					return settings.name;
        				}
        				return 'nicht definiertes Tool';
        			};
        		
        			_this.getIcon = function() {
        				if (settings.icon) {
        					return settings.icon;
        				}
        				return '<i class="fa fa-exclamation-triangle"></i>';
        			};
        		
        			/* render ui */
        			var render = function() {
        				// load css
        				loadCss();
        		
        				container = UI.createElement(COMPONENT_TAG_NAME + '-toolbar-button', {innerHTML: _this.getIcon()});
        				container.setAttribute('tune', key);
        				UI.createTooltip(container, _this.getName());
        			};
        		
        			/* load css */
        			var loadCss = function() {
        				// call instance method
        				var css = Functions.trigger(instance.css);
        				if (Functions.isObject(css)) {
        					UI.Styles.add('block-tune/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-toolbar[type="block"] ' + COMPONENT_TAG_NAME + '-toolbar-section ' + COMPONENT_TAG_NAME + '-toolbar-button[tune="' + key + '"]');
        				}
        			};
        		
        			/* bind events */
        			var bindEvents = function() {
        				// mouse enter
        				container.addEventListener('mouseenter', function(event) {
        					this.classList.add('is-hovered');
        				});
        				// mouse leave
        				container.addEventListener('mouseleave', function(event) {
        					this.classList.remove('is-hovered');
        				});
        				// instance on click
        				container.addEventListener('click', function(event) {
        					// call instance method
        					Functions.trigger(instance.onClick, false, [event]);
        				});
        				// instance on opened
        				_Toolbar.getElement().addEventListener('toolbar-opened', function(event) {
        					// call instance method
        					Functions.trigger(instance.onOpen, false, [event]);
        				});
        				// instance on closed
        				_Toolbar.getElement().addEventListener('toolbar-closed', function(event) {
        					// call instance method
        					Functions.trigger(instance.onClose, false, [event]);
        				});
        			};
        		
        			_this.getContainer = function() {
        				return container;
        			};
        		
        			_this.getInstance = function() {
        				return instance;
        			};
        		};
        
        		/* block chooser */
        		var BlockChooser = function(_BlockList, _Block) {
        			var _this = this,
        				blocks,
        				container,
        				containerPoint,
        				Modal;
        		
        			_this._constructor = function() {
        				blocks = Blocks.getAll();
        		
        				// create modal
        				Modal = Functions.createClass(Modal, [_this]);
        				Functions.trigger(Modal.initialize);
        			};
        		
        			/* render ui */
        			_this.render = function() {
        				// create container
        				container = UI.createElement('div', {className: 'block-chooser-wrapper-insertion'});
        				containerPoint = UI.createElement('div', {className: 'block-chooser-wrapper-insertion-point', innerHTML: '<i class="fa fa-plus-circle"></i>'});
        				container.appendChild(containerPoint);
        				// add block chooser ui
        				getParentElement().appendChild(container);
        				// bind events
        				bindEvents();
        			};
        		
        			/* bind events */
        			var bindEvents = function() {
        				var mouseleaveListener = function(event) {
        					container.classList.remove('is-hovered');
        				};
        		
        				// editor disabled
        				Core.Config.webcomponent.addEventListener('disabled', function(event) {
        					// if editor is disabled
        					if (event.detail) {
        						// close modal
        						Modal.close();
        						// mouseleave
        						mouseleaveListener();
        					}
        				});
        				// mouse enter
        				container.addEventListener('mouseenter', function(event) {
        					// if editor is disabled, abort
        					if (Core.isDisabled()) {
        						return;
        					}
        					this.classList.add('is-hovered');
        				});
        				// mouse leave
        				container.addEventListener('mouseleave', mouseleaveListener);
        				// click
        				containerPoint.addEventListener('click', function(event) {
        					event.stopPropagation();
        					// if editor is disabled, abort
        					if (Core.isDisabled()) {
        						return;
        					}
        					// open
        					Modal.open();
        				});
        			};
        		
        			/* modal */
        			Modal = function() {
        				var _this = this,
        					BlockChooser,
        					container,
        					containerInner,
        					containerInnerContainer,
        					ul,
        					position = 'auto',
        					isOpened = false;
        		
        				/* constructor */
        				_this._constructor = function(_BlockChooser) {
        					BlockChooser = _BlockChooser;
        				};
        		
        				// render block item function
        				var renderBlockItem = function(name) {
        					// create block instance
        					var instance = Functions.createClass(Block, [], [name]);
        					Functions.trigger(instance.initialize);
        					// build block ui
        					var container = UI.createElement('div', {className: 'block-chooser-item'});
        					var icon = UI.createElement('span', {className: 'block-chooser-item-icon', innerHTML: instance.getSetting('icon', 'kein Icon')});
        					container.appendChild(icon);
        					var title = UI.createElement('span', {className: 'block-chooser-item-title', innerHTML: instance.getSetting('name', 'nicht definierter Block')});
        					container.appendChild(title);
        					// click
        					container.addEventListener('click', function(event) {
        						var block = Functions.createClass(Block, [], [name]);
        						_BlockList.add(block, _Block ? _Block.getPosition() + 1 : _BlockList.length());
        						Functions.trigger(block.initialize, false, [_BlockList]);
        						// custom event "block-added"
        						Core.dispatchEvent('block-added', {
        							detail: {
        								data: block.getJson(),
        								position: block.getPosition()
        							},
        							bubbles: true,
        							cancelable: true
        						});
        						// focus block
        						setTimeout(function() {
        							// call instance method
        							Functions.trigger(block.focus, true);
        							// focus auto focus field
        							(function(field) {
        								if (field) {
        									field.autofocus();
        								}
        							})(block.getAutoFocusField());
        							// close me
        							_this.close();
        						}, 1);
        						// scroll to new block
        						//Functions.scrollToBlock(block);
        					});
        					return container;
        				};
        		
        				var renderPosition = function() {
        					switch (position) {
        						case 'auto':
        							if ((Functions.viewport().top + container.getBoundingClientRect().top + containerInner.offsetHeight) < Functions.viewport().bottom) {
        								container.classList.add('position-down');
        								container.classList.remove('position-up');
        							} else {
        								container.classList.add('position-up');
        								container.classList.remove('position-down');
        							}
        							break;
        						case 'up':
        							container.classList.add('position-up');
        							container.classList.remove('position-down');
        							break;
        						case 'down':
        							container.classList.add('position-down');
        							container.classList.remove('position-up');
        							break;
        					}
        				};
        		
        				/* open */
        				_this.open = function() {
        					// if opened, abort
        					if (isOpened) {
        						return;
        					}
        					// set flag
        					isOpened = true;
        					// create container
        					container = UI.createElement('div', {className: 'block-chooser-wrapper'});
        					containerInner = UI.createElement('div', {className: 'block-chooser-wrapper-inner'});
        					containerInnerContainer = UI.createElement('div', {className: 'block-chooser-wrapper-container'});
        					ul = UI.createElement('ul', {className: 'block-chooser-list'});
        					// render items
        					for (var name in blocks) {
        						var item = renderBlockItem(name);
        						var li = UI.createElement('li', {className: 'block-chooser-list-item'});
        						li.appendChild(item);
        						ul.appendChild(li);
        					}
        					containerInnerContainer.appendChild(ul);
        					containerInner.appendChild(containerInnerContainer);
        					container.appendChild(containerInner);
        					// add block chooser ui
        					getParentElement().appendChild(container);
        					// bind events
        					bindEvents();
        					// render position
        					renderPosition();
        				};
        		
        				var clickListener = function(event) {
        					if (container) {
        						// clicked inside
        						if (container.contains(event.target)) {
        							// nothing
        						}
        						// clicked outside
        						else {
        							// remove click event
        							document.removeEventListener('click', clickListener, true);
        							/* remove scroll event (render position) */
        							window.removeEventListener('scroll', renderPosition);
        							/* remove resize event (render position) */
        							window.removeEventListener('resize', renderPosition);
        							// close
        							_this.close();
        						}
        					}
        				};
        		
        				/* bind events */
        				var bindEvents = function() {
        					/* click event */
        					document.addEventListener('click', clickListener, true);
        					/* scroll event (render position) */
        					window.addEventListener('scroll', renderPosition);
        					/* resize event (render position) */
        					window.addEventListener('resize', renderPosition);
        				};
        		
        				/* close */
        				_this.close = function() {
        					// if not opened, abort
        					if (!isOpened) {
        						return;
        					}
        					// set flag
        					isOpened = false;
        					// remove
        					container.remove();
        				};
        		
        				/* set position auto|up|down */
        				_this.setPosition = function(value) {
        					if (['auto', 'up', 'down'].indexOf(value) !== -1) {
        						// set position
        						position = value;
        						return true;
        					}
        					return false;
        				};
        		
        				_this.getContainer = function() {
        					return container;
        				};
        			};
        		
        			var getParentElement = function() {
        				return (_Block ? _Block : _BlockList).getContainer();
        			};
        		
        			_this.getModal = function() {
        				return Modal;
        			};
        		};
        
        		/* block list */
        		var BlockList = function() {
        			var _this = this,
        				list = [],
        				parentContainer,
        				events,
        				container;
        		
        			/* constructor */
        			_this._constructor = function(_parentContainer, _events) {
        				parentContainer = _parentContainer;
        				_events = Functions.isObject(_events) ? _events : {};
        				events = {
        					update: Functions.isFunction(_events.onUpdate) ? _events.onUpdate : function(){}
        				};
        		
        				// render ui
        				render();
        			};
        		
        			/* render ui */
        			var render = function() {
        				container = UI.createElement(COMPONENT_TAG_NAME + '-blocks');
        				if (parentContainer) {
        					parentContainer.appendChild(container);
        					// create block chooser
        					var blockChooser = Functions.createClass(BlockChooser, [], [_this]);
        					Functions.trigger(blockChooser.render, true);
        				}
        			};
        		
        			_this.getFirst = function() {
        				return _this.length() ? list[0] : null;
        			};
        		
        			_this.getLast = function() {
        				return _this.length() ? list[_this.length() - 1] : null;
        			};
        		
        			_this.getPreviousByBlock = function(block) {
        				var index = list.indexOf(block);
        				if (index > 0) {
        					return list[index - 1];
        				}
        				return null;
        			};
        		
        			_this.getNextByBlock = function(block) {
        				var index = list.indexOf(block) + 1;
        				if (index > 0 && index < _this.length()) {
        					return list[index];
        				}
        				return null;
        			};
        		
        			_this.getAll = function() {
        				return list;
        			};
        		
        			_this.add = function(block, position) {
        				if (list.indexOf(block) === -1) {
        					position = checkPositionParam(position);
        					list.splice(position, 0, block);
        					return block;
        				}
        				return false;
        			};
        		
        			_this.setPosition = function(block, newPosition) {
        				list.splice(newPosition, 0, list.splice(list.indexOf(block), 1)[0]);
        			};
        		
        			_this.delete = function(block) {
        				if (list.indexOf(block) !== -1) {
        					list = list.filter(function(_block) {
        						return _block !== block;
        					});
        					return true;
        				}
        				return false;
        			};
        		
        			_this.length = function() {
        				return list.length;
        			};
        		
        			_this.clear = function() {
        				list = [];
        			};
        		
        			_this.getContainer = function() {
        				return container;
        			};
        		
        			var checkPositionParam = function(position) {
        				if (!position || !Number.isInteger(position) || position > _this.length()) {
        					position = _this.length();
        				} else if (position < 0) {
        					position = 0;
        				}
        				return position;
        			};
        		
        			_this.triggerEvent = function(name) {
        				if (name in events) {
        					events[name]();
        				}
        			};
        		
        			_this.getJson = function() {
        				var data = [];
        				list.forEach(function(block) {
        					data.push(block.getJson());
        				});
        				return data;
        			};
        		};
        
        		/* toolbar */
        		var BlockToolbar = function(_Block) {
        			var _this = this,
        				container,
        				tunes = {},
        				isOpened = false;
        		
        			/* initialize */
        			_this.initialize = function() {
        				// render ui
        				render();
        			};
        		
        			/* render ui */
        			var render = function() {
        				container = UI.createToolbarElement('block');
        		
        				// block settings
        				(function(section) {
        					if (section) {
        						container.appendChild(section);
        					}
        				})(createSectionBlockSettings());
        		
        				// tunes
        				(function(section) {
        					if (section) {
        						container.appendChild(section);
        					}
        				})(createSectionTunes());
        			};
        		
        			var createSectionBlockSettings = function() {
        				var section = null;
        				if (_Block.hasBlockSettings()) {
        					// create element
        					section = UI.createToolbarSectionElement();
        					// create tune object
        					var name = 'settings';
        					var tune = Functions.createClass(BlockTune, [SettingsBlockTune], [name, _this]);
        					tunes[name] = tune;
        					Functions.trigger(tune.initialize);
        					section.appendChild(tune.getContainer());
        				}
        				return section;
        			};
        		
        			var createSectionTunes = function() {
        				var section = null,
        					blockTunes = BlockTunes.getAll();
        				if (Object.keys(blockTunes).length) {
        					// create element
        					section = UI.createToolbarSectionElement();
        					// create tune objects
        					for (var name in blockTunes) {
        						var tune = Functions.createClass(BlockTune, [], [name, _this]);
        						tunes[name] = tune;
        						Functions.trigger(tune.initialize);
        						section.appendChild(tune.getContainer());
        					};
        				}
        				return section;
        			};
        		
        			_this.show = function() {
        				// if editor is disabled, toolbar opened or no tunes exist, abort
        				if (Core.isDisabled() || isOpened || !hasTunes()) {
        					return;
        				}
        				// set flag
        				isOpened = true;
        				setTimeout(function() {
        					// show
        					_Block.getContainer().insertAdjacentElement('afterbegin', container);
        					// custom event "toolbar-opened"
        					Core.dispatchEvent('toolbar-opened', {
        						bubbles: true,
        						cancelable: true
        					}, _this.getElement());
        				}, 1);
        			};
        		
        			_this.hide = function() {
        				// if not opened or no tunes exist, abort
        				if (!isOpened || !hasTunes()) {
        					return;
        				}
        				// set flag
        				isOpened = false;
        				setTimeout(function() {
        					// hide
        					container.remove();
        					// custom event "toolbar-closed"
        					Core.dispatchEvent('toolbar-closed', {
        						bubbles: true,
        						cancelable: true
        					}, _this.getElement());
        				}, 1);
        			};
        		
        			_this.getElement = function() {
        				return container;
        			};
        		
        			_this.getBlock = function() {
        				return _Block;
        			};
        		
        			_this.isOpened = function() {
        				return isOpened;
        			};
        		
        			var hasTunes = function() {
        				return Object.keys(tunes).length ? true : false;
        			};
        		
        			_this.getTool = function(name) {
        				if (name in tunes) {
        					return tunes[name];
        				}
        				return null;
        			};
        		
        			_this.getAllTools = function() {
        				return tunes;
        			};
        		};
        
        	/* blocks */
        	var Blocks = Functions.createClass(function() {
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
        
        	/* field */
        	var Field = function(_settings, jsonData, Block) {
        		var _this = this,
        			options,
        			instance,
        			fieldList,
        			container,
        			element,
        			toolbar,
        			_initialized = false,
        			settings = Functions.isObject(_settings) ? _settings : {},
        			data;
        	
        		/* constructor */
        		_this._constructor = function(_options) {
        			options = _options;
        	
        			// create instance
        			createInstance();
        	
        			// parse and set field settings
        			options.settings = Functions.parseObject(
        				(function(defaultSettings) {
        					return (Functions.isObject(options.settings) ? Object.assign(defaultSettings, options.settings) : defaultSettings);
        				})(Functions.trigger(instance.settings)),
        				[
        					{
        						name: 'inlineTools',
        						validate: function(value) {
        							if (Functions.isBoolean(value) && value === true) {
        								return false;
        							}
        							if (Functions.isBoolean(value) && value === false) {
        								return true;
        							}
        							return true;
        						},
        						parse: function(value) {
        							if (Functions.isArray(value)) {
        								return Functions.arrayIntersection(InlineTools.getAllKeys(), value);
        							}
        							return [];
        						},
        						defaultValue: InlineTools.getAllKeys()
        					},
        					{
        						name: 'enableLineBreaks',
        						validate: Functions.isBoolean,
        						defaultValue: false
        					},
        					{
        						name: 'name',
        						validate: Functions.isString,
        						defaultValue: false
        					}
        				]
        			);
        	
        			// create toolbar
        			toolbar = Functions.createClass(FieldToolbar, [], [_this]);
        		};
        	
        		/* create instance */
        		var createInstance = function() {
        			var field = Fields.getByKey(options.type);
        			if (!field) {
        				throw new Error('RPEditor: Field.createInstance(): field «' + options.type + '» not found.');
        			}
        			instance = Functions.createClass(field, [], [_this, api]);
        		};
        	
        		/* initialize */
        		_this.initialize = function(_fieldList) {
        			fieldList = _fieldList;
        	
        			// create field element
        			element = createFieldElement();
        	
        			// call instance method
        			Functions.trigger(instance.initialize, false, [jsonData]);
        	
        			// render ui
        			render();
        	
        			// call toolbar instance method
        			Functions.trigger(toolbar.initialize);
        	
        			// bind events
        			bindEvents();
        	
        			// get data
        			if (Functions.isFunction(instance.getData)) {
        				data = Functions.trigger(instance.getData);
        			}
        	
        			_initialized = true;
        		};
        	
        		/* render ui */
        		var render = function() {
        			// load css
        			loadCss();
        	
        			container = UI.createElement(COMPONENT_TAG_NAME + '-field-wrapper');
        			container.setAttribute('name', options.name);
        			container.setAttribute('spellcheck', 'false');
        			container.setAttribute('type', Functions.escapeText(options.type));
        	
        			// call instance method
        			Functions.trigger(instance.render, false, [element]);
        	
        			if (options.label) {
        				container.appendChild(UI.createElement('label', {innerHTML: options.label}));
        			}
        	
        			// add field element
        			container.appendChild(element);
        		};
        	
        		/* load css */
        		var loadCss = function() {
        			// call instance method
        			var css = Functions.trigger(instance.css);
        			if (Functions.isObject(css)) {
        				UI.Styles.add('field/' + options.type, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-field-wrapper[type="' + Functions.escapeText(options.type) + '"] > ' + COMPONENT_TAG_NAME + '-field');
        			}
        		};
        	
        		_this.renderToolbar = function() {
        			// call instance method
        			return Functions.trigger(instance.renderToolbar, false, [_this]);
        		};
        	
        		/* bind events */
        		var bindEvents = function() {
        			// editor disabled
        			Core.Config.webcomponent.addEventListener('disabled', function(event) {
        				// if editor is disabled
        				if (event.detail) {
        					// unfocus
        					_this.unfocus();
        				}
        			});
        			// mouse enter
        			container.addEventListener('mouseenter', function(event) {
        				this.classList.add('is-hovered');
        			});
        			// mouse leave
        			container.addEventListener('mouseleave', function(event) {
        				this.classList.remove('is-hovered');
        			});
        			// click
        			container.addEventListener('click', function(event) {
        				// focus field
        				if (!selectedField || selectedField !== _this) {
        					_this.focus();
        				}
        			});
        			/* keydown */
        			element.addEventListener('keydown', function(event) {
        				var caretIsAtStart = Utilities.Caret.isAtStart({includeContent: true}),
        					caretIsAtEnd = Utilities.Caret.isAtEnd({includeContent: true});
        	
        				// enter pressed and line breaks are disabled
        				if (event.key === 'Enter' && !_this.getFieldSetting('enableLineBreaks')) {
        					event.preventDefault();
        				}
        				// tab pressed
        				if (event.key === 'Tab' && event.shiftKey === true) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventArrowLeftAndUpOrTab();
        				}
        				// shift and tab pressed
        				if (event.key === 'Tab' && event.shiftKey === false) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventArrowRightAndDownOrShiftAndTab();
        				}
        				// arrow up or left pressed
        				if ((event.key === 'ArrowUp' || event.key === 'ArrowLeft') && event.shiftKey === false && caretIsAtStart) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventArrowLeftAndUpOrTab();
        				}
        				// arrow down or right pressed
        				if ((event.key === 'ArrowDown' || event.key === 'ArrowRight') && event.shiftKey === false && caretIsAtEnd) {
        					event.stopPropagation();
        					event.preventDefault();
        					eventArrowRightAndDownOrShiftAndTab();
        				}
        			});
        		};
        	
        		_this.save = function(triggerEvent) {
        			if (Functions.isFunction(instance.getData)) {
        				var newData = Functions.trigger(instance.getData);
        				if (data === newData) {
        					return;
        				}
        	
        				var oldData = data;
        				data = newData;
        	
        				if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
        					if (_initialized === true) {
        						_this.triggerEvent({type: 'CONTENT', oldValue: oldData, newValue: newData});
        					}
        				}
        			}
        		};
        	
        		_this.getData = function() {
        			return data;
        		};
        	
        		_this.setData = function(data) {
        			// call instance method
        			Functions.trigger(instance.setData, true, [data]);
        		};
        	
        		_this.autofocus = function() {
        			_this.focus();
        			// call instance method
        			Functions.trigger(instance.onAutoFocus, false);
        		};
        	
        		_this.focus = function() {
        			// if editor is disabled, abort
        			if (Core.isDisabled()) {
        				return;
        			}
        			// unfocus old field
        			if (selectedField && selectedField !== _this) {
        				selectedField.unfocus();
        			}
        			// focus
        			selectedField = _this;
        			container.classList.add('is-focused');
        			// set focus
        			element.focus();
        			// call instance method
        			Functions.trigger(instance.onFocus, false);
        			// show toolbar
        			toolbar.show();
        		};
        	
        		_this.unfocus = function() {
        			selectedField = null;
        			container.classList.remove('is-focused');
        			// hide toolbar
        			toolbar.hide();
        		};
        	
        		_this.onPaste = function(data) {
        			// insert text
        			document.execCommand(/*'insertText'*/'insertHTML', false, data);
        			// call instance method
        			Functions.trigger(instance.onPaste, false, [data]);
        		};
        	
        		_this.getList = function() {
        			return fieldList;
        		};
        	
        		_this.getPosition = function() {
        			return fieldList.getAll().indexOf(_this);
        		};
        	
        		_this.getSetting = function(key, defaultValue) {
        			return key in settings ? settings[key] : defaultValue ? defaultValue : null;
        		};
        	
        		_this.getSettings = function() {
        			return settings;
        		};
        	
        		_this.setSetting = function(key, value, triggerEvent) {
        			if (key in settings && (settings[key] === value || Functions.objectEquals(settings[key], value))) {
        				return;
        			}
        	
        			var oldValue = settings[key];
        			settings[key] = value;
        	
        			if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
        				_this.triggerEvent({type: 'SETTINGS', key: key, oldValue: oldValue, newValue: settings[key]});
        			}
        		};
        	
        		_this.removeSetting = function(key, triggerEvent) {
        			var status = false;
        			if (key in settings) {
        				var oldValue = settings[key];
        				delete settings[key];
        				status = true;
        				if (Functions.isUndefined(triggerEvent) || triggerEvent === true) {
        					_this.triggerEvent({type: 'SETTINGS', key: key, oldValue: oldValue, newValue: null});
        				}
        			}
        			return status;
        		};
        	
        		_this.getFieldSetting = function(key, defaultValue) {
        			return key in options.settings ? options.settings[key] : defaultValue ? defaultValue : null;
        		};
        	
        		_this.getFieldSettings = function(key) {
        			return options.settings;
        		};
        	
        		_this.getElement = function() {
        			return element;
        		};
        	
        		_this.getContainer = function() {
        			return container;
        		};
        	
        		_this.getKey = function() {
        			return options.type;
        		};
        	
        		_this.getBlock = function() {
        			return Block;
        		};
        	
        		_this.getToolbar = function() {
        			return toolbar;
        		};
        	
        		_this.getInstance = function() {
        			return instance;
        		};
        	
        		var createFieldElement = function() {
        			var element = UI.createElement(COMPONENT_TAG_NAME + '-field');
        			element.setAttribute('name', options.name);
        			return element;
        		};
        	
        		_this.triggerEvent = function(obj) {
        			if (_initialized === true) {
        				// custom event "change"
        				Core.dispatchEvent('change', {
        					detail: Object.assign({blockData: null}, obj, {blockData: fieldList.getBlock().getJson()}),
        					bubbles: true,
        					cancelable: true
        				});
        				// trigger update
        				fieldList.getBlock().getList().triggerEvent('update');
        			}
        		};
        	
        		_this.getJson = function() {
        			var json = {
        					type: options.type,
        					name: options.name
        				};
        	
        			(function(settings) {
        				if (Object.keys(settings).length) {
        					json['settings'] = settings;
        				}
        			})(_this.getSettings());
        	
        			// QUICK FIX
        			if (_this.getKey() === 'container' && Functions.isFunction(instance.getData)) {
        				data = Functions.trigger(instance.getData);
        			}
        	
        			json['data'] = data;
        			return json;
        		};
        	
        	
        		var eventArrowLeftAndUpOrTab = function() {
        			var getFieldByFieldElement = function(element) {
        				var recBlockList = function(blockList) {
        					var blocks = blockList.getAll();
        					for (var i = 0; i < blocks.length; i++) {
        						var fields = blocks[i].getFieldList().getAll();
        						for (var key in fields) {
        							if (fields[key].getKey() === 'container') {
        								var _return = recBlockList(fields[key].getInstance().getBlockList());
        								if (_return) {
        									return _return;
        								}
        							} else {
        								if (fields[key].getElement() === element) {
        									return fields[key];
        								}
        							}
        						}
        					};
        				};
        				return recBlockList(Core.getBlocks());
        			};
        	
        			var inputs = Array.from(UI.getAllContentEditableElements()).reverse();
        			for (var i = 0; i < inputs.length; i++) {
        				if (inputs[i] === Utilities.Selection.getContentEditableElement()) {
        					var input = inputs[i + 1];
        					if (input) {
        						var prevFieldElement;
        						if (input.nodeName.toLowerCase() === COMPONENT_TAG_NAME + '-field') {
        							prevFieldElement = input;
        						} else {
        							var t = input.closest(COMPONENT_TAG_NAME + '-field');
        							if (t) {
        								prevFieldElement = t;
        							}
        						}
        	
        						var field = getFieldByFieldElement(prevFieldElement);
        						if (field) {
        							field.getBlock().focus();
        							field.focus();
        							Utilities.Caret.setPositionToEnd({element: input});
        						}
        					}
        					break;
        				}
        			};
        		};
        	
        		var eventArrowRightAndDownOrShiftAndTab = function() {
        			var getFieldByFieldElement = function(element) {
        				var recBlockList = function(blockList) {
        					var blocks = blockList.getAll();
        					for (var i = 0; i < blocks.length; i++) {
        						var fields = blocks[i].getFieldList().getAll();
        						for (var key in fields) {
        							if (fields[key].getKey() === 'container') {
        								var _return = recBlockList(fields[key].getInstance().getBlockList());
        								if (_return) {
        									return _return;
        								}
        							} else {
        								if (fields[key].getElement() === element) {
        									return fields[key];
        								}
        							}
        						}
        					};
        				};
        				return recBlockList(Core.getBlocks());
        			};
        	
        			var inputs = Array.from(UI.getAllContentEditableElements()).reverse();
        			for (var i = 0; i < inputs.length; i++) {
        				if (inputs[i] === Utilities.Selection.getContentEditableElement()) {
        					var input = inputs[i - 1];
        					if (input) {
        						var prevFieldElement;
        						if (input.nodeName.toLowerCase() === COMPONENT_TAG_NAME + '-field') {
        							prevFieldElement = input;
        						} else {
        							var t = input.closest(COMPONENT_TAG_NAME + '-field');
        							if (t) {
        								prevFieldElement = t;
        							}
        						}
        	
        						var field = getFieldByFieldElement(prevFieldElement);
        						if (field) {
        							field.getBlock().focus();
        							field.focus();
        							Utilities.Caret.setPositionToStart({element: input});
        						}
        					}
        					break;
        				}
        			};
        		};
        	
        		_this.getPrevious = function() {
        			return _this.getList().getPreviousByField(_this);
        		};
        	
        		_this.getNext = function() {
        			return _this.getList().getNextByField(_this);
        		};
        	
        		var getAllContentEditableElements = function() {
        			return Array.from(_this.getContainer().querySelectorAll('[contenteditable]'));
        		};
        	
        		_this.getFirstContentEditableElement = function() {
        			var list = getAllContentEditableElements();
        			return list.length ? list[0] : null;
        		};
        	
        		_this.getLastContentEditableElement = function() {
        			var list = getAllContentEditableElements();
        			return list.length ? list[list.length - 1] : null;
        		};
        	};
        
        		/* inline tools */
        		var InlineTools = Functions.createClass(function() {
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
        		
        			_this.add = function(key, tool) {
        				if (!(key in list)) {
        					list[key] = tool;
        					return tool;
        				}
        				return false;
        			};
        		
        			_this.length = function() {
        				return Object.keys(list).length;
        			};
        		});
        
        		/* inline tool */
        		var InlineTool = function(key, _Toolbar) {
        			var _this = this,
        				inlineTool,
        				instance,
        				container,
        				settings,
        				SettingsUI,
        				state = false,
        				anchorElement;
        		
        			/* constructor */
        			_this._constructor = function(_inlineTool) {
        				if (Functions.isFunction(_inlineTool)) {
        					inlineTool = _inlineTool;
        				}
        				// create instance
        				createInstance();
        		
        				// parse and set settings
        				settings = Functions.parseObject(
        					Functions.trigger(instance.settings),
        					[
        						{
        							name: 'name',
        							validate: Functions.isString,
        							defaultValue: ''
        						},
        						{
        							name: 'icon',
        							validate: Functions.isString,
        							defaultValue: ''
        						}
        					]
        				);
        		
        				// create settings ui
        				SettingsUI = Functions.createClass(SettingsUI, [_this, _Toolbar]);
        				Functions.trigger(SettingsUI.initialize);
        			};
        		
        			/* create instance */
        			var createInstance = function() {
        				if (!inlineTool) {
        					inlineTool = InlineTools.getByKey(key);
        				}
        				if (!inlineTool) {
        					throw new Error('RPEditor: InlineTool.createInstance(): inline tool «' + key + '» not found.');
        				}
        				instance = Functions.createClass(inlineTool, [], [_this, api]);
        			};
        		
        			/* initialize */
        			_this.initialize = function() {
        				// call instance method
        				Functions.trigger(instance.initialize, false, [_Toolbar]);
        		
        				// render ui
        				_this.render();
        		
        				// call instance method
        				Functions.trigger(instance.render);
        		
        				// bind events
        				bindEvents();
        			};
        		
        			_this.getName = function() {
        				if (settings.name) {
        					return settings.name;
        				}
        				return 'nicht definiertes Tool';
        			};
        		
        			_this.getIcon = function() {
        				if (settings.icon) {
        					return settings.icon;
        				}
        				return '<i class="fa fa-exclamation-triangle"></i>';
        			};
        		
        			/* render ui */
        			_this.render = function() {
        				// load css
        				loadCss();
        		
        				container = UI.createElement(COMPONENT_TAG_NAME + '-toolbar-button', {innerHTML: _this.getIcon()});
        				UI.createTooltip(container, _this.getName());
        			};
        		
        			/* load css */
        			var loadCss = function() {
        				// call instance method
        				var css = Functions.trigger(instance.css);
        				if (Functions.isObject(css)) {
        					UI.Styles.add('inline-tool/' + key, css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-blocks ' + COMPONENT_TAG_NAME + '-block ' + COMPONENT_TAG_NAME + '-field-wrapper');
        				}
        			};
        		
        			/* sanitize */
        			_this.sanitize = function() {
        				if (Functions.isFunction(instance.sanitize)) {
        					var data = Functions.trigger(instance.sanitize);
        					if (Functions.isObject(data)) {
        						return data;
        					}
        				}
        				return {};
        			};
        		
        			/* settings ui */
        			SettingsUI = function() {
        				var _this = this,
        					InlineTool,
        					Toolbar,
        					container,
        					containerInner;
        		
        				/* constructor */
        				_this._constructor = function(_InlineTool, _Toolbar) {
        					InlineTool = _InlineTool;
        					Toolbar = _Toolbar;
        				};
        		
        				/* initialize */
        				_this.initialize = function() {
        					if (!InlineTool.hasSettings()) {
        						return;
        					}
        					// create ui
        					createUI();
        				};
        		
        				/* create ui */
        				var createUI = function() {
        					container = UI.createElement('div', {className: 'toolbar-popover-wrapper'});
        					containerInner = UI.createElement('div', {className: 'toolbar-popover-wrapper-inner'});
        					container.appendChild(containerInner);
        				};
        		
        				/* remove ui */
        				var removeUI = function() {
        					container.remove();
        					// update container position
        					window.removeEventListener('resize', updateContainerPosition);
        				};
        		
        				var clickCallback = function(event) {
        					if (container) {
        						// clicked inside
        						if (container.contains(event.target)) {
        							// nothing
        						}
        						// clicked outside
        						else if (!InlineTool.getState()) {
        							// remove click event
        							document.removeEventListener('click', clickCallback, true);
        							// close
        							_this.close();
        						}
        					}
        				};
        		
        				/* render ui */
        				var render = function(isNew) {
        					isNew = Functions.isBoolean(isNew) ? isNew : false;
        					// render
        					(function() {
        						// clear container
        						containerInner.innerHTML = '';
        						// fill container
        						Functions.trigger(instance.renderSettings, true, [containerInner, isNew]);
        						// insert container after toolbar
        						Toolbar.getElement().parentNode.insertBefore(container, Toolbar.getElement().nextElementSibling);
        						// update container position
        						window.addEventListener('resize', updateContainerPosition);
        						updateContainerPosition();
        					})();
        					/* click event */
        					document.addEventListener('click', clickCallback, true);
        				};
        		
        				/* update container position */
        				var updateContainerPosition = function() {
        					var selectionRect = Utilities.Selection.getAnchorElement().getBoundingClientRect(),
        						fieldRect = Toolbar.getField().getElement().getBoundingClientRect(),
        						posX = selectionRect.left + ((selectionRect.right - selectionRect.left) / 2) - fieldRect.left,
        						posY = selectionRect.top + selectionRect.bottom - selectionRect.top - fieldRect.top + 10;
        					container.style.left = posX + 'px';
        					container.style.top = posY + 'px';
        				};
        		
        				/* open */
        				_this.open = function(isNew) {
        					if (!InlineTool.hasSettings()) {
        						return;
        					}
        					isNew = Functions.isBoolean(isNew) ? isNew : false;
        					// render
        					render(isNew);
        				};
        		
        		
        				/* close */
        				_this.close = function() {
        					if (!InlineTool.hasSettings()) {
        						return;
        					}
        					// remove ui
        					removeUI();
        				};
        			};
        		
        			/* bind events */
        			var bindEvents = function() {
        				// mouse enter
        				container.addEventListener('mouseenter', function(event) {
        					this.classList.add('is-hovered');
        				});
        				// mouse leave
        				container.addEventListener('mouseleave', function(event) {
        					this.classList.remove('is-hovered');
        				});
        				// instance on click
        				container.addEventListener('click', function(event) {
        					// call instance method
        					Functions.trigger(instance.onClick, false, [event]);
        					// call toolbar instance method
        					Functions.trigger(_this.checkState, true, [true]);
        				});
        				// instance on opened
        				_Toolbar.getElement().addEventListener('toolbar-opened', function(event) {
        					// call instance method
        					Functions.trigger(instance.onOpen, false, [event]);
        				});
        				// instance on closed
        				_Toolbar.getElement().addEventListener('toolbar-closed', function(event) {
        					// call instance method
        					Functions.trigger(instance.onClose, false, [event]);
        				});
        			};
        		
        			/* check state */
        			_this.checkState = function(isNew) {
        				isNew = Functions.isBoolean(isNew) ? isNew : false;
        				// call instance method
        				var _state = Functions.trigger(instance.checkState),
        					_anchorElement = Utilities.Selection.getAnchorElement();
        				if (Functions.isBoolean(_state)) {
        					// update button
        					container.classList.toggle('is-active', _state);
        					// open settings
        					if (_state && anchorElement !== _anchorElement) {
        						SettingsUI.open(isNew);
        					}
        					// set state
        					state = _state;
        					// set anchor element
        					anchorElement = _anchorElement;
        				}
        			};
        		
        			_this.hasSettings = function() {
        				return Functions.isFunction(instance.renderSettings);
        			};
        		
        			_this.getKey = function() {
        				return key;
        			};
        		
        			_this.getState = function() {
        				return state;
        			};
        		
        			_this.getContainer = function() {
        				return container;
        			};
        		
        			_this.getInstance = function() {
        				return instance;
        			};
        		
        			_this.getToolbar = function() {
        				return _Toolbar;
        			}
        		};
        
        		/* field list */
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
        
        		/* toolbar */
        		var FieldToolbar = function(_Field) {
        			var _this = this,
        				container,
        				tools = {},
        				isOpened = false,
        				eventListener = [];
        		
        			/* initialize */
        			_this.initialize = function() {
        				// render ui
        				render();
        			};
        		
        			/* render ui */
        			var render = function() {
        				container = UI.createToolbarElement('field');
        		
        				// field settings
        				(function(section) {
        					if (section) {
        						container.appendChild(section);
        					}
        				})(createSectionFieldSettings());
        				
        				// tools
        				(function(section) {
        					if (section) {
        						container.appendChild(section);
        					}
        				})(createSectionTools());
        			};
        		
        			var createSectionFieldSettings = function() {
        				var section = null,
        					inlineTools = _Field.renderToolbar();
        				if (Functions.isObject(inlineTools) && Object.keys(inlineTools).length) {
        					// create element
        					section = UI.createToolbarSectionElement();
        					// create tool objects
        					for (var name in inlineTools) {
        						var tool = Functions.createClass(InlineTool, [inlineTools[name]], [name, _this]);
        						tools[name] = tool;
        						Functions.trigger(tool.initialize);
        						section.appendChild(tool.getContainer());
        					};
        				}
        				return section;
        			};
        		
        			var createSectionTools = function() {
        				var section = null,
        					inlineTools = _Field.getFieldSetting('inlineTools');
        				if (inlineTools.length) {
        					// create element
        					section = UI.createToolbarSectionElement();
        					// create tool objects
        					inlineTools.forEach(function(name) {
        						var tool = Functions.createClass(InlineTool, [], [name, _this]);
        						tools[name] = tool;
        						Functions.trigger(tool.initialize);
        						section.appendChild(tool.getContainer());
        					});
        				}
        				return section;
        			};
        		
        			var ToolbarEventListener = function(Toolbar, event, handler) {
        				var _this = this;
        		
        				_this.activate = function() {
        					document.addEventListener(event, handler);
        				};
        		
        				_this.deactivate = function() {
        					document.removeEventListener(event, handler);
        				};
        			};
        		
        			_this.addEventListener = function(event, handler) {
        				eventListener.push(new ToolbarEventListener(_this, event, handler));
        			};
        		
        			var activateAllEventListener = function() {
        				for (var listener in eventListener) {
        					eventListener[listener].activate();
        				}
        			};
        		
        			var deactivateAllEventListener = function() {
        				for (var listener in eventListener) {
        					eventListener[listener].deactivate();
        				}
        			};
        		
        			_this.show = function() {
        				// if editor is disabled, toolbar opened or no tools exist, abort
        				if (Core.isDisabled() || isOpened || !hasTools()) {
        					return;
        				}
        				// set flag
        				isOpened = true;
        				setTimeout(function() {
        					// show
        					_Field.getContainer().insertAdjacentElement('afterbegin', container);
        					// check tool state
        					document.addEventListener('selectionchange', checkAllToolStates);
        					checkAllToolStates();
        					// activate event listener
        					activateAllEventListener();
        					// custom event "toolbar-opened"
        					Core.dispatchEvent('toolbar-opened', {
        						bubbles: true,
        						cancelable: true
        					}, _this.getElement());
        				}, 1);
        			};
        		
        			_this.hide = function() {
        				// if not opened no tools exist, abort
        				if (!isOpened || !hasTools()) {
        					return;
        				}
        				// set flag
        				isOpened = false;
        				setTimeout(function() {
        					// hide
        					container.remove();
        					document.removeEventListener('selectionchange', checkAllToolStates);
        					// activate event listener
        					deactivateAllEventListener();
        					// custom event "toolbar-closed"
        					Core.dispatchEvent('toolbar-closed', {
        						bubbles: true,
        						cancelable: true
        					}, _this.getElement());
        				}, 1);
        			};
        		
        			_this.checkToolState = function(name) {
        				if (!arguments.length) {
        					return;
        				}
        				Array.from(arguments).forEach(function(argument) {
        					if (argument in tools) {
        						// call instance method
        						Functions.trigger(tools[argument].checkState);
        					}
        				});
        			};
        		
        			var checkAllToolStates = function() {
        				for (var name in tools) {
        					// call instance method
        					Functions.trigger(tools[name].checkState);
        				};
        			};
        		
        			_this.getElement = function() {
        				return container;
        			}
        		
        			_this.getField = function() {
        				return _Field;
        			};
        		
        			_this.isOpened = function() {
        				return isOpened;
        			};
        		
        			var hasTools = function() {
        				return Object.keys(tools).length ? true : false;
        			};
        		
        			_this.getTool = function(name) {
        				if (name in tools) {
        					return tools[name];
        				}
        				return null;
        			};
        		
        			_this.getAllTools = function() {
        				return tools;
        			};
        		};
        
        	/* fields */
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
        
        	/* local storage */
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
        
        	/* core */
        	var Core = Functions.createClass(function(_super) {
        		var _this = this,
        			isDisabled,
        			isFocused = false,
        			toolbar,
        			blockList,
        			blockPropertyPrefix = '_';
        	
        		/* check if we're using a touch screen */
        		_this.isTouchSupported = function() {
        			return ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        		};
        	
        		/* initialize */
        		_this.initialize = function(config) {
        			// prepare config
        			_this.Config = prepareConfig(config);
        	
        			// initialize editor tools
        			initializeComponents('editor-tool', EditorTools, _this.Config.components.core.editorTools); // core
        			initializeComponents('editor-tool', EditorTools, _this.Config.components.custom.editorTools); // custom
        	
        			// initialize blocks
        			initializeComponents('block', Blocks, _this.Config.components.core.blocks); // core
        			initializeComponents('block', Blocks, _this.Config.components.custom.blocks); // custom
        	
        			// initialize block tunes
        			initializeComponents('block-tune', BlockTunes, _this.Config.components.core.blockTunes); // core
        			initializeComponents('block-tune', BlockTunes, _this.Config.components.custom.blockTunes); // custom
        	
        			// initialize fields
        			initializeComponents('field', Fields, _this.Config.components.core.fields); // core
        			initializeComponents('field', Fields, _this.Config.components.custom.fields); // custom
        	
        			// initialize inline tools
        			initializeComponents('inline-tool', InlineTools, _this.Config.components.core.inlineTools); // core
        			initializeComponents('inline-tool', InlineTools, _this.Config.components.custom.inlineTools); // custom
        	
        			// initialize local storage
        			Functions.trigger(LocalStorage.initialize);
        	
        			// create editor toolbar
        			toolbar = Functions.createClass(EditorToolbar);
        	
        			// render ui
        			UI.render();
        	
        			// call editor toolbar instance method
        			Functions.trigger(toolbar.initialize);
        	
        			// bind events
        			bindEvents();
        	
        			// create root block container
        			blockList = Functions.createClass(BlockList, [UI.getElement('editor')]);
        	
        			// initialize blocks
        			initializeBlocks();
        	
        			// set disabled
        			_this.disabled(_this.Config.webcomponent.disabled);
        	
        			// custom event "ready"
        			_this.dispatchEvent('ready', {
        				detail: {
        					data: _super.getData()
        				},
        				bubbles: true,
        				cancelable: true
        			});
        		};
        	
        		/* prepare config */
        		var prepareConfig = function(config) {
        			var defaultCoreComponents = {
        				editorTools: {
        					//'add-block': AddBlockEditorTool,
        					'local-storage': LocaleStorageEditorTool
        				},
        				blocks: {
        					'paragraph': ParagraphBlock,
        					'heading': HeadingBlock,
        					'list': ListBlock,
        					'table': TableBlock,
        					'code': CodeBlock,
        					'anchor': AnchorBlock
        				},
        				blockTunes: {
        					'move-up': MoveUpBlockTune,
        					'move-down': MoveDownBlockTune,
        					'delete': DeleteBlockTune,
        					'duplicate': DuplicateBlockTune,
        					'notes': NotesBlockTune
        				},
        				fields: {
        					'container': ContainerField,
        					'text': TextField,
        					'heading': HeadingField,
        					'list': ListField,
        					'table': TableField,
        					'code': CodeField
        				},
        				inlineTools: {
        					'text-alignment-left': TextAlignmentLeftInlineTool,
        					'text-alignment-center': TextAlignmentCenterInlineTool,
        					'text-alignment-right': TextAlignmentRightInlineTool,
        					'strong': StrongInlineTool,
        					'italic': ItalicInlineTool,
        					'underline': UnderlineInlineTool,
        					'link': LinkInlineTool,
        					'sub': SubInlineTool,
        					'sup': SupInlineTool,
        					'shy': ShyInlineTool,
        					'nbsp': NbspInlineTool
        				}
        			};
        			// config
        			config = (function(config) {
        				return {
        					webcomponent: config.webcomponent || null,
        					data: config.data || [],
        					components: (function(components) {
        						return {
        							core: (function(components) {
        								var get = function(key) {
        									if (Functions.isArray(components[key])) {
        										var obj = {};
        										components[key].forEach(function(name) {
        											if (name in defaultCoreComponents[key]) {
        												obj[name] = defaultCoreComponents[key][name];
        											}
        										});
        										return obj;
        									}
        									return defaultCoreComponents[key];
        								};
        								return {
        									editorTools: get('editorTools'),
        									blocks: get('blocks'),
        									blockTunes: get('blockTunes'),
        									fields: defaultCoreComponents['fields'], // fields: get('fields'),
        									inlineTools: get('inlineTools'),
        								};
        							})(Functions.isObject(components.core) ? components.core : {}),
        							custom: (function(components) {
        								var get = function(key, customComponents) {
        									if (Functions.isArray(components[key])) {
        										var obj = {};
        										components[key].forEach(function(name) {
        											if (name in customComponents) {
        												obj[name] = customComponents[name];
        											}
        										});
        										return obj;
        									}
        									return customComponents;
        								};
        								return {
        									editorTools: get('editorTools', RPEditorComponents.EditorTools.getAll()),
        									blocks: get('blocks', RPEditorComponents.Blocks.getAll()),
        									blockTunes: get('blockTunes', RPEditorComponents.BlockTunes.getAll()),
        									fields: RPEditorComponents.Fields.getAll(),
        									inlineTools: get('inlineTools', RPEditorComponents.InlineTools.getAll()),
        								};
        							})(Functions.isObject(components.custom) ? components.custom : {}),
        						};
        					})(Functions.isObject(config.components) ? config.components : {})
        				};
        			})(Functions.isObject(config) ? config : {});
        	
        			if (!config.webcomponent) {
        				throw new Error('RPEditor: «webcomponent» not found.');
        			}
        	
        			if (!Functions.isArray(config.data)) {
        				throw new Error('RPEditor: «data» must be an array.');
        			}
        	
        			return config;
        		};
        	
        		/* initialize components */
        		var initializeComponents = function(type, instance, obj) {
        			for (var name in obj) {
        				if (!instance.add(name, obj[name])) {
        					throw new Error('RPEditor: «' + type + '»-component «' + name + '» already exist.');
        				}
        			}
        		};
        	
        		/* initialize blocks */
        		var initializeBlocks = function() {
        			_this.Config.data.forEach(function(blockData) {
        				try {
        					var block = Functions.createClass(Block, [], [blockData.type, blockData.fields, _this.extractBlockProperties(blockData)]);
        				} catch (error) {
        					console.error(error.message);
        				}
        				if (block) {
        					blockList.add(block);
        					Functions.trigger(block.initialize, false, [blockList]);
        				}
        			});
        		};
        	
        		/* bind events */
        		var bindEvents = function() {
        			// document click listener
        			document.addEventListener('click', function(event) {
        				// editor focus/unfocus
        				(function(isFocusedOld, element) {
        					isFocused = element === event.target || element.contains(event.target);
        					if (!isFocusedOld && isFocused) {
        						UI.setEditorFocus(isFocused);
        					}
        					else if (isFocusedOld && !isFocused) {
        						UI.setEditorFocus(isFocused);
        					}
        				})(isFocused, UI.getElement('editor'));
        				// unfocus block
        				if (selectedBlock && !selectedBlock.getContainer().contains(event.target)) {
        					selectedBlock.unfocus();
        				}
        				// unfocus field
        				if (selectedField && !selectedField.getContainer().contains(event.target)) {
        					selectedField.unfocus();
        				}
        			}, true);
        	
        			// paste event
        			Core.Config.webcomponent.addEventListener('__________paste', function(event) {
        				event.preventDefault();
        				if (selectedField) {
        					var clipboardData = '';
        					if (event.clipboardData && event.clipboardData.getData) {
        						clipboardData = event.clipboardData.getData('text/plain');
        					} else if (window.clipboardData && window.clipboardData.getData) {
        						clipboardData = window.clipboardData.getData('Text');
        					}
        					if (clipboardData) {
        						Functions.trigger(selectedField.onPaste, false, [clipboardData]);
        					}
        				}
        			});
        	
        			// new paste event
        			(function() {
        				Core.Config.webcomponent.addEventListener('paste', function(event) {
        					event.preventDefault();
        					if (!selectedField) {
        						return;
        					}
        	
        					var clipboardData = event.clipboardData || window.clipboardData;
        	
        					// get text as html or plain
        					var text = (function() {
        						for (var i = 0; i < arguments.length; i++) {
        							var data = clipboardData.getData(arguments[i]);
        							if (data) {
        								return data;
        							}
        						}
        					})('text/html', 'text/plain');
        	
        					// Sanitizer config
        					var sanitizeConfig = (function(tools) {
        						var obj = {};
        						for (var name in tools) {
        							obj = Object.assign(obj, tools[name].sanitize());
        						};
        						return obj;
        					})(selectedField.getToolbar().getAllTools());
        	
        					// clean text
        					var text = Libraries.Sanitizer.clean(text, sanitizeConfig).trim();
        	
        					// call (selected)Field onPaste method
        					if (text) {
        						Functions.trigger(selectedField.onPaste, false, [text]);
        					}
        				});
        			})();
        		};
        	
        		/* set data */
        		_this.setData = function(data) {
        			if (Functions.isArray(data)) {
        				_this.Config.data = data;
        	
        				// create root block container
        				blockList.clear();
        				blockList.getContainer().innerHTML = '';
        	
        				// initialize blocks
        				initializeBlocks();
        			}
        		};
        	
        		/* get block property prefix */
        		_this.getBlockPropertyPrefix = function() {
        			return blockPropertyPrefix;
        		};
        	
        		/* extract block properties by block data */
        		_this.extractBlockProperties = function(data) {
        			if (!Functions.isObject(data)) {
        				throw new Error('RPEditor: Core.extractBlockProperties(): data must be an object.');
        			}
        			var obj = {};
        			for (var key in data) {
        				if (key.substr(0, blockPropertyPrefix.length) === blockPropertyPrefix) {
        					obj[key.substr(blockPropertyPrefix.length)] = data[key];
        				}
        			}
        			return Object.keys(obj).length ? obj : undefined;
        		};
        	
        		/* get block list */
        		_this.getBlocks = function() {
        			return blockList;
        		};
        	
        		/* get editor toolbar */
        		_this.getEditorToolbar = function() {
        			return toolbar;
        		};
        	
        		/* get true|false if the editor is disabled */
        		_this.isDisabled = function() {
        			return isDisabled;
        		};
        	
        		/* set true|false to enable/disabled the editor */
        		_this.disabled = function(value) {
        			if (Functions.isBoolean(value) && isDisabled !== value) {
        				isDisabled = value;
        				UI.setEditorDisabled(isDisabled);
        				// custom event "disabled"
        				Core.dispatchEvent('disabled', {
        					detail: isDisabled,
        					bubbles: false,
        					cancelable: true
        				});
        			}
        		};
        	
        		/* get true|false if the editor is in focus */
        		_this.isFocused = function() {
        			return isFocused;
        		};
        	
        		/* get true|false if the editor is in debug mode or not */
        		_this.isDebug = function() {
        			return Core.Config.webcomponent.hasAttribute('debug');
        		};
        	
        		/* dispatch event */
        		_this.dispatchEvent = function(typeArg, customEventInit, target) {
        			return (target || _this.Config.webcomponent).dispatchEvent(new CustomEvent(typeArg, customEventInit));
        		};
        	}, [], [Editor]);
        
        	/* editor toolbar */
        	var EditorToolbar = function() {
        		var _this = this,
        			container,
        			tools = {},
        			isOpened = false;
        	
        		/* initialize */
        		_this.initialize = function() {
        			// render ui
        			render();
        			// bind events
        			bindEvents();
        		};
        	
        		/* render ui */
        		var render = function() {
        			var createSection = function() {
        				var section = null,
        					editorTools = EditorTools.getAll();
        				if (Object.keys(editorTools).length) {
        					// create element
        					section = UI.createToolbarSectionElement();
        					// create tool objects
        					for (var name in editorTools) {
        						var tool = Functions.createClass(EditorTool, [], [name, _this]);
        						tools[name] = tool;
        						Functions.trigger(tool.initialize);
        						section.appendChild(tool.getContainer());
        					};
        				}
        				return section;
        			};
        	
        			container = UI.createToolbarElement('editor');
        			_this.hide();
        	
        			// settings
        			(function(section) {
        				if (section) {
        					container.appendChild(section);
        				}
        			})(createSection());
        		};
        	
        		var bindEvents = function() {
        			// editor disabled
        			Core.Config.webcomponent.addEventListener('disabled', function(event) {
        				// show or hide
        				_this[(event.detail === true ? 'hide' : 'show')]();
        			});
        		};
        	
        		_this.show = function() {
        			// if editor is disabled, toolbar opened or no tools exist, abort
        			if (Core.isDisabled() || isOpened || !hasTools()) {
        				return;
        			}
        			// set flag
        			isOpened = true;
        			setTimeout(function() {
        				// show
        				UI.getElement('editor').insertAdjacentElement('afterbegin', container);
        				// custom event "toolbar-opened"
        				Core.dispatchEvent('toolbar-opened', {
        					bubbles: true,
        					cancelable: true
        				}, _this.getElement());
        			}, 1);
        		};
        	
        		_this.hide = function() {
        			// if not opened no tools exist, abort
        			if (!isOpened || !hasTools()) {
        				return;
        			}
        			// set flag
        			isOpened = false;
        			setTimeout(function() {
        				// hide
        				container.remove();
        				// custom event "toolbar-closed"
        				Core.dispatchEvent('toolbar-closed', {
        					bubbles: true,
        					cancelable: true
        				}, _this.getElement());
        			}, 1);
        		};
        	
        		_this.getElement = function() {
        			return container;
        		}
        	
        		_this.get = function(name) {
        			return (name in tools) ? tools[name] : null;
        		};
        	
        		_this.isOpened = function() {
        			return isOpened;
        		};
        	
        		var hasTools = function() {
        			return Object.keys(tools).length ? true : false;
        		};
        	
        		_this.getTool = function(name) {
        			if (name in tools) {
        				return tools[name];
        			}
        			return null;
        		};
        	
        		_this.getAllTools = function() {
        			return tools;
        		};
        	};
        
        	/* editor tool */
        	var EditorTool = function(key, _Toolbar) {
        		var _this = this,
        			editorTool,
        			instance,
        			container,
        			settings;
        	
        		/* constructor */
        		_this._constructor = function(_editorTool) {
        			if (Functions.isFunction(_editorTool)) {
        				editorTool = _editorTool;
        			}
        			// create instance
        			createInstance();
        	
        			// parse and set settings
        			settings = Functions.parseObject(
        				Functions.trigger(instance.settings),
        				[
        					{
        						name: 'name',
        						validate: Functions.isString,
        						defaultValue: ''
        					},
        					{
        						name: 'icon',
        						validate: Functions.isString,
        						defaultValue: ''
        					}
        				]
        			);
        		};
        	
        		/* create instance */
        		var createInstance = function() {
        			if (!editorTool) {
        				editorTool = EditorTools.getByKey(_this.getKey());
        			}
        			if (!editorTool) {
        				throw new Error('RPEditor: EditorTool.createInstance(): editor tool «' + _this.getKey() + '» not found.');
        			}
        			instance = Functions.createClass(editorTool, [], [_this, api]);
        		};
        	
        		/* initialize */
        		_this.initialize = function() {
        			// call instance method
        			Functions.trigger(instance.initialize, false, [_Toolbar]);
        	
        			// render ui
        			render();
        	
        			// bind events
        			bindEvents();
        		};
        	
        		_this.getKey = function() {
        			return key;
        		};
        	
        		_this.getName = function() {
        			if (settings.name) {
        				return settings.name;
        			}
        			return 'nicht definiertes Tool';
        		};
        	
        		_this.getIcon = function() {
        			if (settings.icon) {
        				return settings.icon;
        			}
        			return '<i class="fa fa-exclamation-triangle"></i>';
        		};
        	
        		/* render ui */
        		var render = function() {
        			// load css
        			loadCss();
        	
        			container = UI.createElement(COMPONENT_TAG_NAME + '-toolbar-button', {innerHTML: _this.getIcon()});
        			UI.createTooltip(container, _this.getName());
        		};
        	
        		/* load css */
        		var loadCss = function() {
        			// call instance method
        			var css = Functions.trigger(instance.css);
        			if (Functions.isObject(css)) {
        				UI.Styles.add('editor-tool/' + _this.getKey(), css, COMPONENT_TAG_NAME + '-wrapper ' + COMPONENT_TAG_NAME + '-toolbar[type="editor"]');
        			}
        		};
        	
        		/* bind events */
        		var bindEvents = function() {
        			// mouse enter
        			container.addEventListener('mouseenter', function(event) {
        				this.classList.add('is-hovered');
        			});
        			// mouse leave
        			container.addEventListener('mouseleave', function(event) {
        				this.classList.remove('is-hovered');
        			});
        			// instance on click
        			container.addEventListener('click', function(event) {
        				// call instance method
        				Functions.trigger(instance.onClick, false, [event]);
        			});
        			// instance on opened
        			_Toolbar.getElement().addEventListener('toolbar-opened', function(event) {
        				// call instance method
        				Functions.trigger(instance.onOpen, false, [event]);
        			});
        			// instance on closed
        			_Toolbar.getElement().addEventListener('toolbar-closed', function(event) {
        				// call instance method
        				Functions.trigger(instance.onClose, false, [event]);
        			});
        		};
        	
        		_this.getContainer = function() {
        			return container;
        		};
        	
        		_this.getInstance = function() {
        			return instance;
        		};
        	};
        
        	/* editor tools */
        	var EditorTools = Functions.createClass(function() {
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
        	
        		_this.add = function(key, tool) {
        			if (!(key in list)) {
        				list[key] = tool;
        				return tool;
        			}
        			return false;
        		};
        	
        		_this.length = function() {
        			return Object.keys(list).length;
        		};
        	});
        
        	/* api */
        	var api = Functions.createClass(function() {
        		return {
        			get Functions() { return Functions; },
        			get Utilities() { return Utilities; },
        			get Classes() {
        				return {
        					get Editor() { return Editor; },
        					get Core() { return Core; },
        					get LocalStorage() { return LocalStorage; },
        					get UI() { return UI; },
        					get BlockList() { return BlockList; },
        					get Block() { return Block; },
        					get BlockChooser() { return BlockChooser; }
        				};
        			}
        		};
        	});
        
        	var selectedField,
        		selectedBlock,
        		activeBlockChooser;
        
        	// enable or disable editor
        	Editor.disabled = function disabled(value) {
        		Core.disabled(value);
        	};
        
        	// get data
        	Editor.getData = function getData() {
        		return Core.getBlocks().getJson();
        	};
        
        	// set data
        	Editor.setData = function setData(data) {
        		return Core.setData(data);
        	};
        
        	// initialize core
        	Functions.trigger(Core.initialize, true, [config]);
        	config = undefined;
        };
    })('rp-editor', window, document);
    RPEditorComponents.Blocks.add('columns-2', function(_super, api) {
    	var _this = this,
    		data;
    
    	/* settings */
    	_this.settings = function() {
    		return {
    			name: '2 Spalten',
    			icon: '<i class="fa fa-th"></i>'
    		};
    	};
    
    	/* initialize */
    	_this.initialize = function(_data) {
    		data = _data;
    		// create fields
    		_super.createField({type: 'container', name: 'column1'});
    		_super.createField({type: 'container', name: 'column2'});
    	};
    
    	/* render ui */
    	_this.render = function() {
    		var container = api.Classes.UI.createElement('div', {className: 'flexbox-column-2-container'});
    		_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
    			var fieldContainer = fieldArray.getInstance().getContainer();
    			fieldContainer.classList.add('col');
    			container.appendChild(fieldContainer);
    		});
    		_super.getContainer().appendChild(container);
    	};
    
    	/* css styles */
    	_this.css = function() {
    		return {
    			'.flexbox-column-2-container': {
    				'display': 'flex'
    			},
    			'.flexbox-column-2-container > .col': {
    				'width': '50%'
    			}
    		};
    	};
    });
        RPEditorComponents.Blocks.add('columns-3', function(_super, api) {
    	var _this = this,
    		data;
    
    	/* settings */
    	_this.settings = function() {
    		return {
    			name: '3 Spalten',
    			icon: '<i class="fa fa-th"></i>'
    		};
    	};
    
    	/* initialize */
    	_this.initialize = function(_data) {
    		data = _data;
    		// create fields
    		_super.createField({type: 'container', name: 'column1'});
    		_super.createField({type: 'container', name: 'column2'});
    		_super.createField({type: 'container', name: 'column3'});
    	};
    
    	/* render ui */
    	_this.render = function() {
    		var container = api.Classes.UI.createElement('div', {className: 'flexbox-column-3-container'});
    		_super.getFieldList().getAllAsArray().forEach(function(fieldArray) {
    			var fieldContainer = fieldArray.getInstance().getContainer();
    			fieldContainer.classList.add('col');
    			container.appendChild(fieldContainer);
    		});
    		_super.getContainer().appendChild(container);
    	};
    
    	/* css styles */
    	_this.css = function() {
    		return {
    			'.flexbox-column-3-container': {
    				'display': 'flex'
    			},
    			'.flexbox-column-3-container > .col': {
    				'width': '33%'
    			}
    		};
    	};
    });
})();