window.app.Plugins.add('Users.Add', function(pub) {
	'use strict';

	pub.set('init', function() {});

	pub.set('saveSuccess', function(response, form) {
		alert('SUCCESS');
		alert(JSON.stringify(response));
	});

	pub.set('saveValidationFailure', function(response, form) {
		alert('VALIDATION ERROR');
		alert(JSON.stringify(response));
	});

	pub.set('saveFailure', function(response, form) {
		alert('ERROR');
		alert(JSON.stringify(response));
	});
});