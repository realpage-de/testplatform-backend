return (function() {
	var TextField = (function() {
		//=require ./elements/text-field.js
	})();
	var FileBrowserField = (function() {
		//=require ./elements/filebrowser-field.js
	})();
	var ImageGalleryBrowserField = (function() {
		//=require ./elements/imagegallerybrowser-field.js
	})();
	var BoxBrowserField = (function() {
		//=require ./elements/boxbrowser-field.js
	})();
	var FactboxBrowserField = (function() {
		//=require ./elements/factboxbrowser-field.js
	})();
	return {
		get TextField() { return TextField; },
		get FileBrowserField() { return FileBrowserField; },
		get ImageGalleryBrowserField() { return ImageGalleryBrowserField; },
		get BoxBrowserField() { return BoxBrowserField; },
		get FactboxBrowserField() { return FactboxBrowserField; }
	};
})();