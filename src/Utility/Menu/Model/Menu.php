<?php
namespace App\Utility\Menu\Model;

class Menu
{

	protected $_items = [];

	public function add($key, array $options)
	{
		// init Item model
		$item = new Item;
		// add options
			// label
			if (isset($options['label'])) {
				$item->setLabel($options['label']);
			}
			// uri
			if (isset($options['uri'])) {
				$item->setUri($options['uri']);
			}
			// uri
			if (isset($options['attributes'])) {
				$item->setAttributes($options['attributes']);
			}
		if (!strpos($key, '.')) {
			$this->_items[$key] = $item;
		} else {
			$keys = explode('.', $key);
			$last = array_pop($keys);
			$newItem = $this;
			foreach ($keys as $tempKey) {
				if (is_object($newItem) && $newItem instanceof Menu) {
					$newItem = $newItem->getChild($tempKey);
				}
			}
			$item = $newItem->_items[$last] = $item;
		}
		$this->__sort();
		return $item;
	}

	public function getChild($key)
	{
		return isset($this->_items[$key]) ? $this->_items[$key] : null;
	}

	public function hasChildren()
	{
		return !empty($this->_items) ? true : false;
	}

	public function getChildren()
	{
		return $this->_items;
	}

	private function __sort()
	{
		$tempStore = [];
		$menu = [];
		$items = $this->_items;

		foreach ($items as $key => $item) {
			$pos = $item->getAttribute('order');
			if ($pos !== null) {
				$tempStore[$pos] = $key;
			}
		}

		ksort($tempStore);

		foreach ($tempStore as $key) {
			$menu[$key] = $items[$key];
			unset($items[$key]);
		}

		$this->_items = array_merge($menu, $items);
	}
}