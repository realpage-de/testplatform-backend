<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

// add menu entry
$level1 = $menu->add('Dashboard', [
	'label' => 'Dashboard',
	'uri' => [
		'plugin' => 'Dashboard',
		'controller' => 'Dashboard',
		'action' => 'index'
	],
	'attributes' => [
		'order'=> 1,
		'icon' => 'far fa-chart-bar'
	]
]);