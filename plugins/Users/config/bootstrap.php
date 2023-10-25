<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

// add menu entry
$contents = $menu->add('Users', [
	'label' => 'Benutzer',
	'uri' => [
		'plugin' => 'Users',
		'controller' => 'Users',
		'action' => 'index'
	],
	'attributes' => [
		'icon' => 'far fa-user'
	]
]);