(function(_parent, funcName) {
    'use strict';
	if (!(funcName in _parent)) {
		_parent[funcName] = function(opts) {
			opts.listContainer = opts.container.querySelector('[data-list]');
			opts.buttonAdd = opts.container.querySelector('[data-button-add]');
		
			var init = function() {
				opts.inputHasChildrenNo.addEventListener('change', inputHasChildrenChangeHandler);
				opts.inputHasChildrenYes.addEventListener('change', inputHasChildrenChangeHandler);

				opts.buttonAdd.addEventListener('click', function(event) {
					console.log(opts.listContainer.querySelectorAll('[data-row]').length, opts.listContainer.querySelectorAll('[data-row]'));
					var rowContainer = createRowUI(opts.listContainer.querySelectorAll('[data-row]').length);
					opts.listContainer.appendChild(rowContainer);
				});

				if (opts.data.length) {
					opts.inputHasChildrenYes.checked = true;
					opts.container.classList.add('opened');
					opts.data.forEach(function(item, index) {
						var rowContainer = createRowUI(index, item);
						opts.listContainer.appendChild(rowContainer);
					});
				}
			};
		
			var inputHasChildrenChangeHandler = function(event) {
				if (this.value === '1') {
					opts.container.classList.add('opened');
				} else {
					opts.container.classList.remove('opened');
				}
			};
		
			var createRowUI = function(index, item) {
				// container
				var container = document.createElement('div');
				container.setAttribute('data-row', '');
				container.classList.add('form-row');
		
				// hidden id
				var hiddenId = document.createElement('input');
				hiddenId.type = 'hidden';
				hiddenId.name = 'children[' + index + '][id]';
				if (item) {
					hiddenId.value = item.id;
				}
				container.appendChild(hiddenId);
		
				// hidden deleted
				var hiddenDeleted = document.createElement('input');
				hiddenDeleted.type = 'hidden';
				hiddenDeleted.name = 'children[' + index + '][deleted]';
				container.appendChild(hiddenDeleted);
		
				// column gender
				var genderContainer = createColGenderUI(index, item, container, hiddenId, hiddenDeleted);
				container.appendChild(genderContainer);
		
				// column month
				var monthContainer = createColMonthUI(index, item, container, hiddenId, hiddenDeleted);
				container.appendChild(monthContainer);
		
				// column year
				var yearContainer = createColYearUI(index, item, container, hiddenId, hiddenDeleted);
				container.appendChild(yearContainer);
		
				// column remove
				var removeContainer = createColRemoveUI(index, container, hiddenId, hiddenDeleted);
				container.appendChild(removeContainer);
		
				return container;
			};
		
			var createColGenderUI = function(index, item, rowContainer, hiddenId, hiddenDeleted) {
				// column
				var container = document.createElement('div');
				container.classList.add('form-group');
				container.classList.add('col-md-4');
		
				// select gender
				var select = document.createElement('select');
				select.name = 'children[' + index + '][gender_id]';
				select.setAttribute('data-gender', '');
				select.classList.add('form-control');
				container.appendChild(select);
				select.appendChild(createSelectOption('', '--- Geschlecht ---'));
				for (var i = 0; i < opts.genders.length; i++) {
					var option = createSelectOption(opts.genders[i].id, opts.genders[i].gender);
					select.appendChild(option);
				}
				if (item) {
					select.value = item.gender_id;
				}
		
				return container;
			};
		
			var createColMonthUI = function(index, item, rowContainer, hiddenId, hiddenDeleted) {
				// column
				var container = document.createElement('div');
				container.classList.add('form-group');
				container.classList.add('col-md-3');
		
				// select month
				var select = document.createElement('select');
				select.name = 'children[' + index + '][date_of_birth_month]';
				select.setAttribute('data-date-of-birth-month', '');
				select.classList.add('form-control');
				container.appendChild(select);
				select.appendChild(createSelectOption('', '--- Monat ---'));
				for (var i = 1; i <= 12; i++) {
					var option = createSelectOption(i, opts.months[i - 1]);
					select.appendChild(option);
				}
				if (item/* && isValidDate(item.date_of_birth)*/) {
					//var dobArray = item.date_of_birth.split('-');
					//select.value = parseInt(dobArray[1], 10);
					select.value = item.date_of_birth_month;
				}
		
				return container;
			};
		
			var createColYearUI = function(index, item, rowContainer, hiddenId, hiddenDeleted) {
				// column
				var container = document.createElement('div');
				container.classList.add('form-group');
				container.classList.add('col-md-3');
		
				// select month
				var select = document.createElement('select');
				select.name = 'children[' + index + '][date_of_birth_year]';
				select.setAttribute('data-date-of-birth-year', '');
				select.classList.add('form-control');
				container.appendChild(select);
				select.appendChild(createSelectOption('', '--- Jahr ---'));
				var current = new Date().getFullYear();
				for (var i = current; i >= 1950; i--) {
					var option = createSelectOption(i, i);
					select.appendChild(option);
				}
				if (item/* && isValidDate(item.date_of_birth)*/) {
					//var dobArray = item.date_of_birth.split('-');
					//select.value = parseInt(dobArray[0], 10);
					select.value = item.date_of_birth_year;
				}
		
				return container;
			};
		
			var createColRemoveUI = function(index, rowContainer, hiddenId, hiddenDeleted) {
				// column
				var container = document.createElement('div');
				container.classList.add('form-group');
				container.classList.add('col-md-2');
		
				// button remove
				var button = document.createElement('button');
				button.type = 'button';
				button.classList.add('btn');
				button.classList.add('btn-danger');
				button.innerHTML = '<i class="fas fa-times"></i>';
				button.addEventListener('click', function(event) {
					//if (hiddenId.value) {
						rowContainer.style.display = 'none';
						hiddenDeleted.value = '1';
					//} else {
						//rowContainer.remove();
					//}
				});
				container.appendChild(button);
		
				return container;
			};
		
			var createSelectOption = function(value, title) {
				var element = document.createElement('option');
				element.value = value;
				element.innerHTML = title;
				return element;
			};
		
			var isValidDate = function(dateString) {
				if (typeof dateString !== 'string') {
					return false;
				}
				var array = dateString.match(/^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/);
				return !(array === null || array[3] < 1 || array[3] > 12);
			};
		
			init();
		};
	}
})(window, 'UserChildrenFormWidget');