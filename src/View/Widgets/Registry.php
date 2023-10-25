<?php
namespace App\View\Widgets;

class Registry
{

	private static $__widgets = [];

	public static function register($name, $spec)
	{
		self::$__widgets[$name] = $spec;
		return true;
	}

	public static function get()
	{
		return self::$__widgets;
	}
}