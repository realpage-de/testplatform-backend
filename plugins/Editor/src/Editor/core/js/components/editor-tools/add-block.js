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