<?php
namespace App\Utility\Menu;

use App\Utility\Menu\Model\Menu;

class Store
{

	private static $__store = [];

	public static function create($key)
	{
		self::$__store[$key] = new Menu;
		return self::$__store[$key];
	}

	public static function get($key, $createIfNotExist = false)
	{
		return isset(self::$__store[$key]) ? self::$__store[$key] : ($createIfNotExist === true ? self::create($key) : null);
	}
}