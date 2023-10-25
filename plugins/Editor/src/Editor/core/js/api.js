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