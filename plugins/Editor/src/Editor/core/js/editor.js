window.RPEditor = function RPEditor(config) {
	'use strict';
	var Editor = this;

	/* core editor tools */
	//=require ./components/editor-tools/add-block.js
	//=require ./components/editor-tools/local-storage.js

	/* core blocks */
	//=require ./components/blocks/paragraph.js
	//=require ./components/blocks/heading.js
	//=require ./components/blocks/list.js
	//=require ./components/blocks/table.js
	//=require ./components/blocks/code.js
	//=require ./components/blocks/anchor.js

	/* core block tunes */
	//=require ./components/block-tunes/settings.js
	//=require ./components/block-tunes/move-up.js
	//=require ./components/block-tunes/move-down.js
	//=require ./components/block-tunes/delete.js
	//=require ./components/block-tunes/duplicate.js
	//=require ./components/block-tunes/notes.js

	/* core fields */
	//=require ./components/fields/container.js
	//=require ./components/fields/text.js
	//=require ./components/fields/heading.js
	//=require ./components/fields/list.js
	//=require ./components/fields/table.js
	//=require ./components/fields/code.js

	/* core inline tools */
	//=require ./components/inline-tools/text-alignment-left.js
	//=require ./components/inline-tools/text-alignment-center.js
	//=require ./components/inline-tools/text-alignment-right.js
	//=require ./components/inline-tools/strong.js
	//=require ./components/inline-tools/italic.js
	//=require ./components/inline-tools/underline.js
	//=require ./components/inline-tools/link.js
	//=require ./components/inline-tools/sub.js
	//=require ./components/inline-tools/sup.js
	//=require ./components/inline-tools/shy.js
	//=require ./components/inline-tools/nbsp.js

	/* Libraries */
	//=require ./libraries/libraries.js

	/* Utilities */
	//=require ./utilities/utilities.js

	/* UI */
	//=require ./ui/ui.js

	/* block */
	//=require ./block/block.js

		/* block tunes */
		//=require ./block/block-tunes.js

		/* block tune */
		//=require ./block/block-tune.js

		/* block chooser */
		//=require ./block/block-chooser.js

		/* block list */
		//=require ./block/blocklist.js

		/* toolbar */
		//=require ./block/toolbar.js

	/* blocks */
	//=require ./blocks.js

	/* field */
	//=require ./field/field.js

		/* inline tools */
		//=require ./field/inline-tools.js

		/* inline tool */
		//=require ./field/inline-tool.js

		/* field list */
		//=require ./field/fieldlist.js

		/* toolbar */
		//=require ./field/toolbar.js

	/* fields */
	//=require ./fields.js

	/* local storage */
	//=require ./local-storage.js

	/* core */
	//=require ./core.js

	/* editor toolbar */
	//=require ./toolbar.js

	/* editor tool */
	//=require ./editor-tool.js

	/* editor tools */
	//=require ./editor-tools.js

	/* api */
	//=require ./api.js

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