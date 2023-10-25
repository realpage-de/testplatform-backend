<?php
namespace AdminLTE\View\Helper;

use App\View\Helper\FormHelper as AppFormHelper;

class FormHelper extends AppFormHelper
{

	public function create($context = null, array $options = []): string
	{
		// set html5 novalidate attribute
		$options['novalidate'] = !isset($options['novalidate']) ? true : $options['novalidate'];
		// ajax options
		if (isset($options['ajax']) && $options['ajax'] === true) {
			// remove ajax attribute
			unset($options['ajax']);
			// set data-form attribute
			$options['data-form'] = 'true';
			// set callback before
			if (isset($options['callback-before'])) {
				$options['data-before'] = $options['callback-before'];
				unset($options['callback-before']);
			}
			// set callback validate
			if (isset($options['callback-validation-failure'])) {
				$options['data-validation-failure'] = $options['callback-validation-failure'];
				unset($options['callback-validation-failure']);
			}
			// set callback success
			if (isset($options['callback-success'])) {
				$options['data-success'] = $options['callback-success'];
				unset($options['callback-success']);
			}
			// set callback failure
			if (isset($options['callback-failure'])) {
				$options['data-failure'] = $options['callback-failure'];
				unset($options['callback-failure']);
			}
			// set callback after
			if (isset($options['callback-after'])) {
				$options['data-after'] = $options['callback-after'];
				unset($options['callback-after']);
			}
		}
        // create html tag

		return parent::create($context, $options);
	}
}