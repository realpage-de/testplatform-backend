<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Categories', ['path' => '/categories'], function(RouteBuilder $routes) {
	// categories
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Categories', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Categories', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Categories', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
});

// api v1
$routes->prefix('api/v1', ['plugin' => 'Categories'], function(RouteBuilder $routes) {
	$routes->setExtensions(['json']);
	// categories
	$routes->scope('/', function(RouteBuilder $routes) {
		$routes->resources('Categories', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});
});