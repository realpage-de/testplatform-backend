(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(opts) {
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
					},
					isFunction: function(value) {
						return (value && {}.toString.call(value) === '[object Function]') ? true : false;
					},
					isElement: function(value) {
						return (typeof HTMLElement === 'object' ? value instanceof HTMLElement : value && typeof value === 'object' && value !== null && value.nodeType === 1 && typeof value.nodeName === 'string');
					},
					createElement: function(tagName, opts) {
						opts = opts || {};
						var element = document.createElement(tagName);
						for (var opt in opts) {
							element[opt] = opts[opt];
						};
						return element;
					},
					dispatchEvent: function(typeArg, customEventInit) {
						return document.dispatchEvent(new CustomEvent(typeArg, customEventInit));
					}
				},
				opts = Functions.isObject(opts) ? opts : {},
				elements = {
					wrapper: undefined,
					overlay: undefined,
					window: undefined,
					windowTitle: undefined,
					windowTitleText: undefined,
					windowTitleClose: undefined,
					windowBody: undefined,
					windowButtons: undefined
				},
				options = {},
				isOpened = false,
				eventListener = {},
				parentModalElement;

			/* constructor */
			var init = function() {
				// create
				create();
			};

			var create = function() {
				// create modal elements
				elements = {
					wrapper: Functions.createElement('div', {className: 'modal-wrapper'}),
					overlay: Functions.createElement('div', {className: 'modal-overlay'}),
					window: Functions.createElement('div', {className: 'modal-window'}),
					windowTitle: Functions.createElement('div', {className: 'modal-window-title'}),
					windowTitleText: Functions.createElement('span', {className: 'modal-window-title-text'}),
					windowTitleClose: Functions.createElement('a', {className: 'modal-window-title-close', innerHTML: '<svg viewBox="0 0 20 20"><path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path></svg>'}),
					windowBody: Functions.createElement('div', {className: 'modal-window-body'}),
					windowButtons: Functions.createElement('div', {className: 'modal-window-buttons'})
				};
				// set fullscreen
				(function() {
					if (!('mobileFullscreen' in opts) || opts.mobileFullscreen === true) {
						elements.wrapper.classList.add('modal-mobile-fullscreen');
					}
				})();
				// set size
				(function(sizes) {
					if (!('size' in opts) || sizes.indexOf(opts.size) === -1) {
						opts.size = sizes[0];
					}
					elements.window.classList.add('modal-window-' + opts.size);
				})(['medium', 'small', 'large', 'full']);
				// set full height
				(function() {
					if ('fullHeight' in opts && opts.fullHeight === true) {
						elements.window.classList.add('modal-window-full-height');
					}
				})();
				// add classes
				(function() {
					if ('className' in opts && Functions.isString(opts.className) && opts.className.trim() !== '') {
						var array = opts.className.trim().split(' ');
						for (var i = 0, length = array.length; i < length; i++) {
							elements.window.classList.add(array[i]);
						}
					}
				})();
				// build
					// overlay
					elements.wrapper.appendChild(elements.overlay);
					// window
					elements.overlay.appendChild(elements.window);
					// window title text
					elements.windowTitle.appendChild(elements.windowTitleText);
					// window title close button
					(function(status) {
						if (status) {
							elements.windowTitleClose.addEventListener('click', function(event) {
								event.stopPropagation();
								_this.close();
							});
							elements.windowTitle.appendChild(elements.windowTitleClose);
						}
					})((!('iconClose' in opts) || opts.iconClose !== false));
					// window title
					elements.window.appendChild(elements.windowTitle);
					// window body
					elements.window.appendChild(elements.windowBody);
			};

			/* render ui */
			var createUI = function(callback) {
				(function() {
					var timeout,
						open = function() {
							elements.wrapper.classList.remove('modal-opening');
							window.clearTimeout(timeout);
							// destroy me
							open = function(){};
							// callback
							if (Functions.isFunction(callback)) {
								callback();
							}
						};
					elements.wrapper.classList.add('modal-opening');
					elements.wrapper.addEventListener('animationend', open);
					timeout = window.setTimeout(open, 3000);
				})();
				// set parent modal element
				(function(_parentModalElement) {
					if (Functions.isElement(_parentModalElement)) {
						parentModalElement = _parentModalElement;
						parentModalElement.classList.remove('modal-active');
					}
				})(document.querySelector('.modal-wrapper.modal-active'));
				// set me as active
				elements.wrapper.classList.add('modal-active');
				// trigger event
				triggerEvent('created');
				Functions.dispatchEvent('rp.modal.created', {
					detail: {
						modal: _this
					},
					bubbles: true,
					cancelable: true
				});
				// insert container after toolbar
				document.body.appendChild(elements.wrapper);
			};

			/* remove ui */
			var removeUI = function(callback) {
				(function() {
					var timeout,
						remove = function() {
							elements.wrapper.remove();
							window.clearTimeout(timeout);
							// destroy me
							remove = function(){};
							// callback
							if (Functions.isFunction(callback)) {
								callback();
							}
						};
					elements.wrapper.classList.add('modal-closing');
					elements.wrapper.addEventListener('animationend', remove);
					timeout = window.setTimeout(remove, 3000);
				})();
				// set parent modal as active
				if (Functions.isElement(parentModalElement)) {
					parentModalElement.classList.add('modal-active');
				}
			};

			_this.addEventListener = function(eventName, handler) {
				if (!(eventName in eventListener)) {
					eventListener[eventName] = [];
				}
				eventListener[eventName].push(handler);
			};

			var triggerEvent = function(eventName) {
				if (!(eventName in eventListener)) {
					return;
				}
				var retArr = [];
				for (var index in eventListener[eventName]) {
					retArr.push(eventListener[eventName][index].call(_this)); 
				}
				return retArr;
			};

			/* set title */
			_this.setTitle = function(title) {
				elements.windowTitleText.textContent = title;
			};

			/* clear body */
			_this.clearBody = function() {
				elements.windowBody.innerHTML = '';
			};

			/* set body */
			_this.setBody = function(body) {
				// clear old
				_this.clearBody();
				// set new
				if (Functions.isElement(body)) {
					elements.windowBody.appendChild(body);
				} else {
					elements.windowBody.innerHTML = body;
				}
			};

			/* append body */
			_this.appendBody = function(body) {
				if (Functions.isElement(body)) {
					elements.windowBody.appendChild(body);
				} else {
					elements.windowBody.innerHTML += body;
				}
			};

			/* get element by namespace */
			_this.getElement = function(namespace) {
				var namespaces = namespace.split('.'),
					context = elements;
				for (var i = 0; i < namespaces.length; i++) {
					if (namespaces[i] in context) {
						context = context[namespaces[i]];
					} else {
						return null;
					}
				}
				return context;
			};

			/* set button */
			_this.setButton = function(opts) {
				_this.removeAllbuttons();
				return _this.addButton(opts);
			};

			/* set buttons */
			_this.setButtons = function(opts) {
				_this.removeAllbuttons();
				return _this.addButtons(opts);
			};

			/* add button */
			_this.addButton = function(opts) {
				opts = Functions.isObject(opts) ? opts : {};
				var button = Functions.createElement('button', {className: 'modal-button', textContent: ('label' in opts ? opts.label : '')});
				if ('onClick' in opts && Functions.isFunction(opts.onClick)) {
					button.addEventListener('click', function(event) {
						event.stopPropagation();
						opts.onClick(event);
					});
				}
				// append button
				elements.windowButtons.appendChild(button);
				// append window buttons
				if (elements.windowButtons.parentNode !== elements.window) {
					elements.window.appendChild(elements.windowButtons);
				}
				return button;
			};

			/* add buttons */
			_this.addButtons = function(opts) {
				var buttons = [];
				if (Functions.isArray(opts)) {
					opts.forEach(function(opts) {
						buttons.push(_this.addButton(opts));
					});
				}
				return buttons;
			};

			/* remove all Buttons */
			_this.removeAllbuttons = function() {
				// clear window buttons
				elements.windowButtons.innerHTML = '';
				// remove window buttons
				if (elements.windowButtons.parentNode) {
					elements.windowButtons.parentNode.removeChild(elements.windowButtons);
				}
			};

			var closeOnClickOutsideHandler = function(event) {
				if (elements.overlay === event.target) {
					event.stopPropagation();
					event.preventDefault();
					_this.close();
				}
			};

			var closeOnEscapeHandler = function(event) {
				// Escape pressed
				if (options.closeOnEscape && elements.wrapper.classList.contains('modal-active') && event.key === 'Escape') {
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();

					_this.close();
				}
			};

			/* open */
			_this.open = function(opts) {
				if (isOpened === true) {
					return;
				}

				opts = Functions.isObject(opts) ? opts : {};

				options = {
					closeOnEscape: ('closeOnEscape' in opts && Functions.isBoolean(opts.closeOnEscape) ? opts.closeOnEscape : false),
					closeOnClickOutside: ('closeOnClickOutside' in opts && Functions.isBoolean(opts.closeOnClickOutside) ? opts.closeOnClickOutside : false)
				};

				// create ui
				createUI();

				// close on click outside event
				if (options.closeOnClickOutside) {
					elements.overlay.addEventListener('click', closeOnClickOutsideHandler);
				}

				// close on escape event
				document.addEventListener('keydown', closeOnEscapeHandler, true);

				// trigger event
				triggerEvent('opened');
				Functions.dispatchEvent('rp.modal.opened', {
					detail: {
						modal: _this
					},
					bubbles: true,
					cancelable: true
				});

				isOpened = true;
			};

			/* close */
			_this.close = function() {
				if (isOpened === false) {
					return;
				}

				// close on click outside event
				if (options.closeOnClickOutside) {
					elements.overlay.removeEventListener('click', closeOnClickOutsideHandler);
				}

				// close on escape event
				document.removeEventListener('keydown', closeOnEscapeHandler, true);

				// remove ui
				removeUI();

				// trigger event
				triggerEvent('closed');
				Functions.dispatchEvent('rp.modal.closed', {
					detail: {
						modal: _this
					},
					bubbles: true,
					cancelable: true
				});

				isOpened = false;
			};

			_this.isOpened = function() {
				return isOpened;
			};

			init();
		};
	}
})(window, 'Modal');