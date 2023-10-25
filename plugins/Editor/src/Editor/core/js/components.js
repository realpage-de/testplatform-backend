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