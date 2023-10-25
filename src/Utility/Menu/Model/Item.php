<?php
namespace App\Utility\Menu\Model;

use Cake\Http\ServerRequest;

class Item extends Menu
{

	private $__label = '';

	private $__uri = [];

	private $__attributes = [];

	public function setLabel($val)
	{
		return $this->__label = $val;
	}

	public function getLabel()
	{
		return $this->__label;
	}

	public function setUri($val)
	{
		return $this->__uri = $val;
	}

	public function getUri()
	{
		$params = [
			'plugin' => '',
			'controller' => '',
			'action' => ''
		];
		return array_merge($params, $this->__uri);
	}

	public function setAttributes(array $attributes)
	{
		if (is_array($attributes) && count($attributes)) {
			$this->__attributes = array_merge($this->__attributes, $attributes);
		}
	}

	public function getAttribute($name, $default = null)
	{
		return isset($this->__attributes[$name]) ? $this->__attributes[$name] : $default;
	}

	public function isActive(array $requestURI = [])
	{
		if ($this->__uri) {
			return $this->isURImatch($requestURI, $this->__uri);
		} else {
			return false;
		}
	}
	
	public function isChildActive(array $requestURI = [])
	{
		$status = false;
		$children = $this->getChildren();
		foreach ($children as $child) {
			$obvar = get_object_vars($child);
			if (array_key_exists('__uri', $obvar)) {
				if ($this->isURImatch($requestURI, $obvar['__uri'])) {
					$status = true;
				}
			}
			if ($child->hasChildren()) {
				$subChildren = $child->getChildren();
				foreach ($subChildren as $subChild) {
					$subobvar = get_object_vars($subChild);
					if (array_key_exists('__uri', $subobvar)){
						if ($this->isURImatch($requestURI, $subobvar['__uri'])) {
							$status = true;
						}
					}					
				}
			}

		}
		return $status;
	}

	private function isURImatch($requestURI, $itemURI)
	{
		unset($requestURI['_matchedRoute']);
		unset($requestURI['_ext']);
		unset($requestURI['isAjax']);
		unset($requestURI['pass']);
		return !count(array_diff_assoc($requestURI, $itemURI));
	}
}