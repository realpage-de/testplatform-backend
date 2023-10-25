<?php
namespace Editor\View\Helper;

use Cake\View\Helper\FormHelper;

class EditorHelper extends FormHelper
{

	public function editor($name, array $options = [])
	{
		return $this->_View->Form->input($name, ['type' => 'editor'] + $options);
	}
}