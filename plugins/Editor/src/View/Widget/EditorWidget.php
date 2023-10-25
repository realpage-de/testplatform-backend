<?php
namespace Editor\View\Widget;

use Cake\View\Widget\WidgetInterface;
use Cake\View\Widget\BasicWidget;
use Cake\View\StringTemplate;
use Cake\View\Form\ContextInterface;
use Cake\View\View;

class EditorWidget extends BasicWidget implements WidgetInterface
{

	protected $_templates;

	protected $_template = '
		<input type="hidden" style="display:none;" data-editor="{{id}}" name="{{name}}" value="{{value}}"/>
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
		$this->_templates->add(['editor' => $this->_template]);

		$data += [
			'name' => ''
		];

		// unique id
		$this->assetsVars = [
			'id' => str_replace('.', '', uniqid('', true)),
			'name' => $data['name'],
			'class' => (isset($data['class']) ? $data['class'] : ''),
			'components' => (isset($data['components']) && $data['components'] !== null ? json_encode($data['components']) : ''),
			'disabled' => (isset($data['disabled']))/*,
			'value' => $data['val']*/
		];

		return $this->_templates->format('editor', [
			'id' => h($this->assetsVars['id']),
            'name' => h($data['name']),
            'value' => h($data['val']),
		]);
	}

	public function secureFields(array $data): array
	{
		return [$data['name']];
	}

	public function assets(View $view)
	{
		$view->Html->scriptBlock("
			(function() {
				var input = document.querySelector('input[data-editor=\"" . $this->assetsVars['id'] . "\"]'),
					editor = document.createElement('rp-editor'),
					update = function() {
						var data = editor.getData();
						input.value = (data.length ? JSON.stringify(data) : '');
					};
				editor.setAttribute('name', 'editor-" . $this->assetsVars['name'] . "');
				" . (!empty($this->assetsVars['class']) ? "editor.setAttribute('class', '" . $this->assetsVars['class'] . "');" : '') . "
				" . (!empty($this->assetsVars['components']) ? "editor.setAttribute('components', '" . $this->assetsVars['components'] . "');" : '') . "
				" . ($this->assetsVars['disabled'] === true ? "editor.setAttribute('disabled', '');" : '') . "
				editor.addEventListener('change', update);
				editor.addEventListener('block-added', update);
				editor.addEventListener('block-moved', update);
				editor.addEventListener('block-deleted', update);
				input.parentNode.insertBefore(editor, input);
				try {
					editor.setData(JSON.parse(input.value));
				} catch (error) {}
			})();
		", ['block' => true]);
	}
}