<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Users', ['path' => '/users'], function(RouteBuilder $routes) {
	// users
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Users', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Users', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Users', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
});

// api v1
$routes->prefix('api/v1', ['plugin' => 'Users'], function(RouteBuilder $routes) {
	$routes->setExtensions(['json']);
	// users
	$routes->scope('/', function(RouteBuilder $routes) {
		$routes->resources('Users', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});
});