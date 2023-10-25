//=require polyfills.js
//=require functions.js

// plugins
	// jQuery
	//=require plugins/jquery/jquery.js

	// AdminLTE
	//=require plugins/adminlte/adminlte.min.js

	// Bootstrap
	//=require plugins/bootstrap/js/bootstrap.bundle.js

	// DataTables
	//=require plugins/datatables/jquery.dataTables.js
	//=require plugins/datatables-bs4/dataTables.bootstrap4.min.js
	//=require plugins/datatables-responsive/dataTables.responsive.min.js
	//=require plugins/datatables-responsive/responsive.bootstrap4.min.js

	// momentjs
	//=require plugins/moment/moment-with-locales.min.js

	// air-datepicker
	//=require plugins/air-datepicker/datepicker.min.js

	// rp-switch
	//=require plugins/rp-switch/rp-switch.js

// app
(function(window, document) {
	'use strict';

	window.app = {};

	// set settings
	window.app.settings = window.settings;
	delete window.settings;

	// Counter
	//=require counter.js
	window.app.Counter = window.Counter;
	delete window.Counter;

	// Modal
	//=require modal.js
	window.app.Modal = window.Modal;
	delete window.Modal;

	// ModalConfirm
	//=require modal-confirm.js
	window.app.ModalConfirm = window.ModalConfirm;
	delete window.ModalConfirm;

	// ModalAlert
	//=require modal-alert.js
	window.app.ModalAlert = window.ModalAlert;
	delete window.ModalAlert;

	// Sanitizer
	//=require sanitizer.js
	window.app.Sanitizer = window.Sanitizer;
	delete window.Sanitizer;

	// Form
	//=require form.js
	window.app.Form = window.Form;
	delete window.Form;

	// GetFormData
	//=require get-form-data.js
	window.app.FormData = window.GetFormData;
	delete window.GetFormData;

	// PluginManager
	//=require plugin-manager.js
	window.app.PluginManager = window.PluginManager;
	delete window.PluginManager;

	// delete
	//=require delete.js
	window.app.Delete = window.Delete;
	delete window.Delete;

	//=require init.js
})(window, document);