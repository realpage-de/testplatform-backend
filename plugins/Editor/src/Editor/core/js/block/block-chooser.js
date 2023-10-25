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