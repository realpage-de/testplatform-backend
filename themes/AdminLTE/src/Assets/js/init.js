// moment.js defaults
moment.locale(window.app.settings.locale);

// DataTables defaults
$.extend(true, $.fn.dataTable.defaults, {
	pageLength: 25,
	language: {
		sEmptyTable: 'Keine Daten in der Tabelle vorhanden',
		sInfo: '_START_ bis _END_ von _TOTAL_ Einträgen',
		sInfoEmpty: '0 bis 0 von 0 Einträgen',
		sInfoFiltered: '(gefiltert von _MAX_ Einträgen)',
		sInfoPostFix: '',
		sInfoThousands: '.',
		sLengthMenu: '_MENU_ Einträge anzeigen',
		sLoadingRecords: 'Wird geladen...',
		sProcessing: 'Bitte warten...',
		sSearch: 'Suchen',
		sZeroRecords: 'Keine Einträge vorhanden.',
		oPaginate: {
			sFirst: 'Erste',
			sPrevious: 'Zurück',
			sNext: 'Nächste',
			sLast: 'Letzte'
		},
		oAria: {
			sSortAscending: ': aktivieren, um Spalte aufsteigend zu sortieren',
			sSortDescending: ': aktivieren, um Spalte absteigend zu sortieren'
		}
	}
});

// datepicker defaults
$.fn.datepicker.language['de'] = {
	days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
	daysShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
	daysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
	months: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
	monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
	today: 'Heute',
	clear: 'Aufräumen',
	dateFormat: 'DD, d. MM yyyy',
	timeFormat: 'hh:ii Uhr',
	firstDay: 1
};

// Plugins
window.app.Plugins = new window.app.PluginManager();

// ModalCounter
window.app.ModalCounter = window.app.Counter(2000);

// DataForm
window.app.DataForm = new window.app.Form('form[data-form]');
window.app.DataForm.addCallback(function(callbackString, form, data) {
	var callback = window.app.Plugins.get(callbackString);
	if (!(callback && {}.toString.call(callback) === '[object Function]')) {
		throw new Error('callbackString "' + callbackString + '" doesn\'t exist.');
	}
	callback(data, form);
});

// Delete
window.app.Delete = new window.app.Delete('[data-delete]');
window.app.Delete.addCallback(function(callbackString, response) {
	var callback = window.app.Plugins.get(callbackString);
	if (!(callback && {}.toString.call(callback) === '[object Function]')) {
		throw new Error('callbackString "' + callbackString + '" doesn\'t exist.');
	}
	callback(response);
});

// Modal: add modal created listener
document.addEventListener('rp.modal.created', function(event) {
	// set z-index
	event.detail.modal.getElement('overlay').style.zIndex = window.app.ModalCounter.increase();
});