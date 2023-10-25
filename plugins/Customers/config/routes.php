<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Customers', ['path' => '/customers'], function(RouteBuilder $routes) {
	// customers
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Customers', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Customers', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Customers', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
});

// api v1
$routes->prefix('api/v1', ['plugin' => 'Customers'], function(RouteBuilder $routes) {
	$routes->setExtensions(['json']);
	// customers
	$routes->scope('/', function(RouteBuilder $routes) {
		$routes->resources('Customers', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});
});