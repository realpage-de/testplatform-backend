<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

$menu->add('Customers', [
	'label' => 'Kunden',
	'uri' => [
		'plugin' => 'Customers',
		'controller' => 'Customers',
		'action' => 'index'
	],
	'attributes' => [
		'icon' => 'fas fa-user-tie'
	]
]);