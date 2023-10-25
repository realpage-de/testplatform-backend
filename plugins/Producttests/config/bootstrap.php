<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

// add menu entry
$menu->add('Producttests', [
	'label' => 'Produkttests',
	'uri' => [
		'plugin' => 'Producttests',
		'controller' => 'Producttests',
		'action' => 'index'
	],
	'attributes' => [
		'icon' => 'far fa-file-alt'
	]
]);