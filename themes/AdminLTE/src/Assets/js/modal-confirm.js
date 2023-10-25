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
			modal.setTitle(('title' in opts ? opts.title : 'Hinweis'));
			// set body
			modal.setBody(('body' in opts ? opts.body : ''));
			// add buttons
			modal.addButton({
				label: 'OK',
				onClick: function(event) {
					// callback
					if ('onOkay' in opts && {}.toString.call(opts.onOkay) === '[object Function]') {
						opts.onOkay(event);
					}
					// close modal
					modal.close();
				}
			});
			modal.addButton({
				label: 'Abbrechen',
				onClick: function(event) {
					// callback
					if ('onAbort' in opts && {}.toString.call(opts.onAbort) === '[object Function]') {
						opts.onAbort(event);
					}
					// close modal
					modal.close();
				}
			});
			// open modal
			modal.open();
		};
	}
})(window, 'ModalConfirm');