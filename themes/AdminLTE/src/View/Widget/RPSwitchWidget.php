<?php
namespace AdminLTE\View\Widget;

use Cake\View\Widget\WidgetInterface;
use Cake\View\Widget\BasicWidget;
use Cake\View\StringTemplate;
use Cake\View\Form\ContextInterface;
use Cake\View\View;

class RPSwitchWidget extends BasicWidget implements WidgetInterface
{

	protected $_templates;

	protected $_template = '
		<rp-switch class="form-control" name="{{name}}" value="{{value}}"{{attrs}}></rp-switch>
	';

	public function __construct(StringTemplate $templates)
	{
		// set templates
		$this->_templates = $templates;
	}

	public function render(array $data, ContextInterface $context): string
	{
		if (isset($data['val']) && $data['val'] !== null) {
			$data['val'] = json_encode($data['val']);
		}

		// add editor template
		$this->_templates->add(['rp-switch' => $this->_template]);

		$data += [
			'name' => ''
		];

		return $this->_templates->format('rp-switch', [
            'name' => h($data['name']),
            'value' => h($data['val'])
		]);
	}

	public function secureFields(array $data): array
	{
		return [$data['name']];
	}
}