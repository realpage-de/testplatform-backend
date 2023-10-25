<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Producttests', ['path' => '/producttests'], function(RouteBuilder $routes) {
	// producttests
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Producttests', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Producttests', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Producttests', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
	/*
	// categories
	$routes->scope('/categories', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Categories', 'action' => 'index']);
		// add
		$routes->connect('/add', ['controller' => 'Categories', 'action' => 'add']);
		// edit
		$routes->connect('/{id}', ['controller' => 'Categories', 'action' => 'edit'], ['id' => '\d+', 'pass' => ['id']]);
	});
	*/
});

// api v1
$routes->prefix('api/v1', ['plugin' => 'Producttests'], function(RouteBuilder $routes) {
	$routes->setExtensions(['json']);
	// producttests
	$routes->scope('/', function(RouteBuilder $routes) {
		$routes->resources('Producttests', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});

	/*
	$routes->scope('/producttests', function(RouteBuilder $routes) {
		// categories
		$routes->resources('Categories', [
			'only' => ['index', 'create', 'update', 'delete']
		]);
	});
	*/
});