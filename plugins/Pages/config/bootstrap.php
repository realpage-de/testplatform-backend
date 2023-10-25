<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

// add menu entry
$level1 = $menu->add('Pages', [
	'label' => 'Seiten',
	'uri' => [
		'plugin' => 'Pages',
		'controller' => 'Pages',
		'action' => 'index'
	],
	'attributes' => [
		'icon' => 'far fa-file'
	]
]);