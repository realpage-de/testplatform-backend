<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Pages', ['path' => '/pages'], function(RouteBuilder $routes) {
	// pages
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Pages', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Pages', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
});

// api v1
$routes->prefix('api/v1', ['plugin' => 'Pages'], function(RouteBuilder $routes) {
	$routes->setExtensions(['json']);
	// pages
	$routes->scope('/', function(RouteBuilder $routes) {
		$routes->resources('Pages', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});

	$routes->scope('/pages', function(RouteBuilder $routes) {

	});
});