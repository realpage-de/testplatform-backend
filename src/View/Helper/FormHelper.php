<?php
namespace App\View\Helper;

use Cake\View\Helper\FormHelper as BaseFormHelper;
use Cake\View\View;
use App\View\Widgets\Registry as WidgetRegistry;

class FormHelper extends BaseFormHelper
{

	public function __construct(View $View, array $config = [])
    {
		// parent constructor
		parent::__construct($View, $config);
		// add widgets
		$widgets = WidgetRegistry::get();
		if (!empty($widgets)) {
			foreach ($widgets as $name => $spec) {
				$this->addWidget($name, $spec);
			}
		}
	}

	public function create($context = null, array $options = []): string
	{
		// api
		if (isset($options['api'])) {
			list($version, $type, $ext) = explode('/', (string)$options['api']);
			// remove api attribute
			unset($options['api']);
			// set type
			$options['type'] = $type;
			// set prefix
			$options['url']['prefix'] = 'Api/v' . $version;
			// set _method
			$options['url']['_method'] = $type;
			// set _ext
			$options['url']['_ext'] = $ext;
		}
		// create html tag
		return parent::create($context, $options);
	}

	public function widget($name, array $data = []): string
	{
        // render widget
		$out = parent::widget($name, $data);
        // load assets
		$widget = $this->getWidgetLocator()->get($name);
		if (method_exists($widget, 'assets')) {
			$outAssets = $widget->assets($this->_View);
			if (!empty($outAssets) && is_string($outAssets)) {
				$out .= $outAssets;
			}
		}
        // return widget html
        return $out;
    }
}