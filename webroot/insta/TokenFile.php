<?php
class TokenFile
{

	private static $file = 'token.txt';
	
	static public function read()
	{
		return file_get_contents(self::$file);
	}

	static public function save($token)
	{
		file_put_contents(self::$file, $token);
		return self::read();
	}
}