<?php
namespace App\View\Cell;

use Cake\View\Cell;
use App\Utility\Menu\Store as MenuStore;

class MenuCell extends Cell
{

	public function main()
	{
		$data = MenuStore::get('main');
		$this->set('data', $data);
	}
}