<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Core\Configure;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RegexIterator;

class PluginsController extends Controller
{

	public function javascript()
	{
		$this->response = $this->response->withType('javascript');
		return $this->response->withStringBody($this->__getFileContents('js'));
	}

	public function css()
	{
		$this->response = $this->response->withType('css');
		return $this->response->withStringBody($this->__getFileContents('css'));
	}

	private function __getFileContents($extension)
	{
		$getFiles = function($path) use ($extension) {
			$getFilesR = function($path, &$results = []) use (&$getFilesR, $extension) {
				$files = scandir($path);
				if (!in_array('.pluginsignore', $files)) {
					foreach ($files as $filename) {
						$filepath = realpath($path . DIRECTORY_SEPARATOR . $filename);
						if (!is_dir($filepath)) {
							$info = pathinfo($filepath);
							if ($info['extension'] === $extension) {
								$results[] = $filepath;
							}
						} else if (!in_array($filename, ['.', '..'])) {
							$getFilesR($filepath, $results);
						}
					}
				}
			
				return $results;
			};

			$files = [];
			if (!is_array($path)) {
				$path = [$path];
			}
			foreach ($path as $p) {
				$files = array_merge($files, $getFilesR($p));
			}

			return $files;
		};

		$files = [];
		$paths = Configure::read('App.paths.plugins');
		if ($paths) {
			$files = $getFiles($paths);
		}

		$contents = [];
		foreach ($files as $file) {
			$contents[] = file_get_contents($file);
		}

		return implode("\n", $contents);
	}
}