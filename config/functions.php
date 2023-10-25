<?php
/**
 * Split an array in $row rows.
 * 
 * @param array $array
 * @param int $rows -> Number of rows
 * @return array
 */
if (!function_exists('split_array')) {
	function split_array(array $array, $rows) {
		$listlen = count($array);
		$partlen = floor($listlen / $rows);
		$partrem = $listlen % $rows;
		$partition = [];
		$mark = 0;
		for ($px = 0; $px < $rows; $px++) {
			$incr = ($px < $partrem) ? $partlen + 1 : $partlen;
			$partition[$px] = array_slice($array, $mark, $incr);
			$mark += $incr;
		}
		return $partition;
	}
}

if (!function_exists('implode_array')) {
	function implode_array(array $glue, array $pieces) {
		$array = [];
		$total = count($pieces);
		if ($total > 0) {
			$i = 0;
			foreach ($pieces as $piece) {
				$i++;
				$array[] = $piece;
				if ($i < $total) {
					$array[] = $glue;
				}
			}
		}
		return $array;
	}
}

/**
 * Same as php function implode, but recursively.
 * 
 * @param string $glue
 * @param array $array
 * @return string
 */
if (!function_exists('implode_recursive')) {
	function implode_recursive($glue, array $array)
	{
		$str = '';
		// recursively iterates array and adds key/value to glued string
		array_walk_recursive($array, function($value, $key) use ($glue, &$str) {
			$str .= $value . $glue;
		});
		// removes last $glue from string
		strlen($glue) > 0 and $str = substr($str, 0, -strlen($glue));
		return (string)$str;
	}
}

/**
 * Same as php function strip_tags, but removes inner text as well.
 * 
 * @param string $string
 * @param string $tags -> example: <b><a>
 * @return string
 */
if (!function_exists('strip_tags_inner')) {
	function strip_tags_inner($string, $tags = null) {
		preg_match_all('/<(.+?)[\s]*\/?[\s]*>/si', trim($tags), $tags);
		$tags = array_unique($tags[1]);
		if (is_array($tags) && count($tags)) {
			$string = preg_replace('@<(' . implode('|', $tags) . ')\b.*?>.*?</\1>@si', '', $string);
		}
		return $string;
	}
}

/**
 * Finds whether a variable is an associative array.
 * 
 * @param array $var
 * @return boolean
 */
if (!function_exists('is_assoc_array')) {
	function is_assoc_array($var) {
		$status = false;
		if (is_array($var) && [] !== $var) {
			$status = array_keys($var) !== range(0, count($var) - 1);
		}
		return $status;
	}
}

/**
 * Finds whether a variable is a json.
 * 
 * @param string $var
 * @return boolean
 */
if (!function_exists('is_json')) {
	function is_json($var) {
		$status = false;
		if (is_string($var)) {
			json_decode($var, true); // assoc is faster
			if (json_last_error() === JSON_ERROR_NONE) {
				$status = true;
			}
		}
		return $status;
	}
}

/**
 * Same as php function scandir, but recursively.
 * 
 * @param string $string
 * @param boolean $flatten
 * @param string $regexp
 * @return array
 */
if (!function_exists('scandir_recursive')) {
	function scandir_recursive($path, $flatten = false, $regexp = '') {
		$flatten = is_bool($flatten) ? $flatten : false;
		$regexp = is_string($regexp) && !empty($regexp) ? $regexp : null;
		$flat_array = [];
		$fn = function($path) use (&$fn, $flatten, &$regexp, &$flat_array) {
			$list = [];
			$files = array_slice(scandir($path), 2);
			foreach ($files as $file) {
				$filepath = $path . DIRECTORY_SEPARATOR . $file;
				if (is_file($filepath)) {
					if (is_null($regexp) || preg_match($regexp, $file)) {
						if ($flatten) {
							$flat_array[] = $filepath;
						} else {
							$list[] = $file;
						}
					}
				}
			}
			foreach ($files as $file) {
				$filepath = $path . DIRECTORY_SEPARATOR . $file;
				if (is_dir($filepath)) {
					if ($flatten) {
						$fn($filepath);
					} else {
						$list[$file] = $fn($filepath);
					}
				}
			}
			return $flatten ? $flat_array : $list;
		};
		return $fn($path);
	}
}

if (!function_exists('locale')) {
	function locale($msg, $args = null) {
		if (is_array($msg) && count($msg) === 2) {
			list($plugin, $msg) = $msg;
			$locale = __d($plugin, $msg, $args);
		} else {
			$locale = __($msg, $args);
		}
		return $locale;
	}
}

if (!function_exists('utf8_to_iso88591')) {
	function utf8_to_iso88591($s) {
		return (mb_detect_encoding($s , 'UTF-8', true) ? utf8_decode($s) : $s);
	}
}