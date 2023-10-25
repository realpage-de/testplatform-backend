<?php
use Cake\Routing\RouteBuilder;

$routes->plugin('Dashboard', ['path' => '/'], function(RouteBuilder $routes) {
	// dashboard
	$routes->scope('/', function(RouteBuilder $routes) {
		// index
		$routes->connect('/', ['controller' => 'Dashboard', 'action' => 'index']);
	});
});