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