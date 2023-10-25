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