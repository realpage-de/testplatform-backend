<?php
$baseDir = dirname(dirname(__FILE__));
return [
    'plugins' => [
        'Authentication' => $baseDir . '/vendor/cakephp/authentication/',
        'Bake' => $baseDir . '/vendor/cakephp/bake/',
        'Cake/TwigView' => $baseDir . '/vendor/cakephp/twig-view/',
        'Categories' => $baseDir . '/plugins/Categories/',
        'Customers' => $baseDir . '/plugins/Customers/',
        'Dashboard' => $baseDir . '/plugins/Dashboard/',
        'DebugKit' => $baseDir . '/vendor/cakephp/debug_kit/',
        'Editor' => $baseDir . '/plugins/Editor/',
        'Migrations' => $baseDir . '/vendor/cakephp/migrations/',
        'Pages' => $baseDir . '/plugins/Pages/',
        'Producttests' => $baseDir . '/plugins/Producttests/',
        'Users' => $baseDir . '/plugins/Users/'
    ]
];