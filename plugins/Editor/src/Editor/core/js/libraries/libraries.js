var Libraries = {};

/* Counter */
(function() {
	Libraries.Counter = window.app.ModalCounter;
})();

/* Modal */
(function() {
	Libraries.Modal = window.app.Modal;
})();

/* Sanitizer */
(function() {
	Libraries.Sanitizer = window.app.Sanitizer;
})();

/* Popper.js */
(function() {
	//=require ./../../../libraries/popperjs/popper.js
}).call(Libraries);

/* Tippy.js */
(function(Popper) {
	//=require ./../../../libraries/tippyjs/tippy-bundle.iife.min.js
	Libraries.Tooltip = tippy;
})(Libraries.Popper);