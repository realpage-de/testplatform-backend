<?php
use App\Utility\Menu\Store as MenuStore;

// get menu
$menu = MenuStore::get('main');

// add categories menu entry
$menu->add('Categories', [
	'label' => 'Kategorien',
	'uri' => [
		'plugin' => 'Categories',
		'controller' => 'Categories',
		'action' => 'index'
	],
	'attributes' => [
		'icon' => 'fas fa-stream'
	]
]);