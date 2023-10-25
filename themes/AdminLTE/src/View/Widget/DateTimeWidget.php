<?php
namespace AdminLTE\View\Widget;

use Cake\View\Widget\WidgetInterface;
use Cake\View\Widget\BasicWidget;
use Cake\View\Form\ContextInterface;
use Cake\View\StringTemplate;
use Cake\I18n\FrozenDate;
use Cake\I18n\FrozenTime;
use DateTime;
use Exception;
use Cake\View\View;

class DateTimeWidget extends BasicWidget implements WidgetInterface
{

	protected $_templates;

	protected $_template = '
		<div class="input-group date" data-datetimewidget="{{widget_id}}" data-type="{{type}}" data-date-time-separator="{{date_time_separator}}">
			<div class="input-group-prepend">
				<span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
			</div>
			<input type="text" class="form-control" readonly/>
			<input type="hidden" name="{{name}}" value="{{value}}" data-format="{{format_hidden}}" class="form-control" {{attrs}}/>																				
		</div>
	';

	protected $_formats = [
		'date' => [
			'i18n' => 'yyyy-MM-dd',
			'value' => 'Y-m-d',
			'hidden' => 'YYYY-MM-DD',
			'view' => 'DD, d. MM yyyy'
		],
		'time' => [
			'i18n' => 'HH:mm:ss',
			'value' => 'H:i:s',
			'hidden' => 'HH:mm:ss',
			'view' => 'hh:ii Uhr'
		],
		'datetime' => [
			'i18n' => 'yyyy-MM-dd HH:mm:ss',
			'value' => 'Y-m-d H:i:s',
			'hidden' => 'YYYY-MM-DD HH:mm:ss',
		]
	];

	protected $_id = null;

    public function __construct(StringTemplate $templates)
    {
		// set templates
		$this->_templates = $templates;
		// parent constructor
		parent::__construct($templates);
    }

	public function render(array $data, ContextInterface $context): string
	{
		if ($data['type'] === 'time') {
			return parent::render($data, $context);
		}

		// store old input template
		$this->__input = $this->_templates->get('input');
        // add browser template
		$this->_templates->add(['input' => $this->_template]);

		// unique id
		$this->_id = str_replace('.', '', uniqid('', true));
		if (isset($data['widget_id'])) {
			if (is_string($data['widget_id'])) {
				$this->_id = $data['widget_id'];
			}
			unset($data['widget_id']);
		}
		$data['templateVars']['widget_id'] = $this->_id;
		// set value
		if (!empty($data['val'])) {
			if ($data['val'] instanceof DateTime) {
				$datetime = $data['val'];
			} else if ($data['val'] instanceof FrozenDate) {
				$datetime = new DateTime((string)$data['val']->i18nFormat($this->_formats[$data['type']]['i18n']));
			} else if ($data['val'] instanceof FrozenTime) {
				$datetime = new DateTime((string)$data['val']->i18nFormat($this->_formats[$data['type']]['i18n']));
			} else {
				try {
					$datetime = new DateTime($data['val']);
				}
				catch (Exception $exception) {}
			}
			if (isset($datetime)) {
				$data['templateVars']['value'] = $data['val'] = $datetime->format($this->_formats[$data['type']]['value']);
			}
		}
		// set formats
		$data['templateVars']['format_hidden'] = h($this->_formats[$data['type']]['hidden']);
		$data['templateVars']['format_date'] = h($this->_formats['date']['view']);
		$data['templateVars']['format_time'] = h($this->_formats['time']['view']);
		$data['templateVars']['date_time_separator'] = h((isset($data['date_time_separator']) ? $data['date_time_separator'] : ', '));
		// parent render function (get widget html)
		$html = parent::render($data, $context);
		// set normal input template
		$this->_templates->add(['input' => $this->__input]);

		// return widget html
		return $html;
	}

	public function secureFields(array $data): array
	{
		return [$data['name']];
	}

	public function assets(View $view)
	{
		if (!isset($this->_id)) {
			return;
		}

		$view->Html->scriptBlock("
			(function() {
				var selector = '[data-datetimewidget=\"" . $this->_id . "\"]',
					wrapper = document.querySelector(selector),
					valueInput = wrapper.querySelector('input[type=\"text\"]'),
					hiddenInput = wrapper.querySelector('input[type=\"hidden\"]');
				if (!is_mobile()) {
					var picker = $(valueInput).datepicker({
						language: 'de',
						timepicker: (['datetime', 'time'].indexOf(wrapper.getAttribute('data-type')) !== -1),
						dateTimeSeparator: wrapper.getAttribute('data-date-time-separator'),
						onShow: function (instance, animationCompleted){
							if (!animationCompleted) {
								// set z-index
								instance.\$datepicker.get(0).style.zIndex = window.app.ModalCounter.increase();
							}
						},
						onSelect: function onSelect(formattedDate, date) {
							hiddenInput.value = (date ? moment(date).format(hiddenInput.getAttribute('data-format')) : '');
						}
					});
					if (hiddenInput.value) {
						picker.data('datepicker').selectDate(new Date(hiddenInput.value));
					}
				} else {
					valueInput.type = 'hidden';
					hiddenInput.type = 'date';
				}
			})();
		", ['block' => true]);
	}
}