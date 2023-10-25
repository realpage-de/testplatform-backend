(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(opts) {
			opts = is_object(opts) ? opts : {};

			// create modal
			var modal = new window.app.Modal({
				iconClose: false
			});
			// set title
			modal.setTitle(('title' in opts ? opts.title : 'Meldung'));
			// set body
			modal.setBody(('body' in opts ? opts.body : ''));
			// add buttons
			modal.addButton({
				label: 'OK',
				onClick: function(event) {
					// callback
					if ('onClose' in opts && {}.toString.call(opts.onClose) === '[object Function]') {
						opts.onClose(event);
					}
					// close modal
					modal.close();
				}
			});
			// open modal
			modal.open();
		};
	}
})(window, 'ModalAlert');