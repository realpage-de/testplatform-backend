<?php
namespace App\Controller\Component\Api;

use Cake\Controller\Component\PaginatorComponent as CakePaginatorComponent;
use Cake\Datasource\ResultSetInterface;
use Cake\Datasource\QueryInterface;

class PaginatorComponent extends CakePaginatorComponent
{

	// get parameter value => method name
	private $__modes = [
		'normal' => 'Normal',
		'datatables' => 'DataTables' // DataTables (datatables.net)
	];

	public function paginate2(object $object, array $settings = []): array
	{
		$query = null;
		if ($object instanceof QueryInterface) {
			$query = $object;
			$object = $query->repository();
		}
		// set settings
		$pagSettings = $this->getSettingsByRequest($query, $object, true);
		// if settings given, merge with request settings
		if (!empty($settings)) {
			$pagSettings = $this->__mergeSettings($pagSettings, $settings);
		}
		//print_r($object->find()->contain($pagSettings['contain'])->select($pagSettings['fields'])->where($pagSettings['conditions']));
		//print_r($pagSettings);exit;
		// paginate
		$results = parent::paginate($object, $pagSettings);
		// return pading data
		return $this->__getPagingData($query, $object, $results);
	}

	public function nopaginate($object, array $settings = [])
	{
		$query = null;
		if ($object instanceof QueryInterface) {
			$query = $object;
			$object = $query->repository();
		}
		// finder
		$finder = 'all';
		if (isset($settings['finder'])) {
			// set finder name
			$finder = key($settings['finder']);
			// merge finder settings
			if (isset($settings['finder'][$finder])) {
				$settingsFinder = $settings['finder'][$finder];
				unset($settings['finder']);
				$settings = array_merge($settings, $settingsFinder);
			}
		}
		// set settings
		$pagSettings = $this->getSettingsByRequest($query, $object);
		// remove paginate settings
		unset($pagSettings['page']);
		unset($pagSettings['limit']);
		// if settings given, merge with request settings
		if (!empty($settings)) {
			$pagSettings = $this->__mergeSettings($pagSettings, $settings);
		}
		// get data
		return $object->find($finder, $pagSettings)->all()->toArray();
	}

	public function getSettingsByRequest($query, $object)
	{
		return $this->{__FUNCTION__ . $this->__getModeFromRequest('val')}($query, $object);
	}

	private function __mergeSettings(array $settings1, array $settings2)
	{
		// conditions must be merged separately: build conditions array
		$conditions = [];
		if (!empty($settings1['conditions'])) {
			$conditions[] = $settings1['conditions'];
			unset($settings1['conditions']);
		}
		if (!empty($settings2['conditions'])) {
			$conditions[] = $settings2['conditions'];
			unset($settings2['conditions']);
		}
		// merge settings
		$array = array_merge($settings1, $settings2);
		// add conditions to merged array
		if (!empty($conditions)) {
			$array['conditions'] = $conditions;
		}
		return $array;
	}

	public function getSettingsByRequestNormal($query, $object)
	{
		// init settings array
		$settings = [];
		// get request data
		$requestData = $this->_registry->getController()->getRequestData();
		// contain entities
		if (!empty($requestData['contain']) && is_array($requestData['contain'])) {
			$settings['contain'] = array_reverse((array)$requestData['contain']);
		}
		/*
		// fields
		if (!empty($requestData['fields']) && is_array($requestData['fields'])) {
			$settings['fields'] = (array)$requestData['fields'];
		}
		*/
		// conditions
		if (!empty($requestData['conditions']) && is_array($requestData['conditions'])) {
			//$settings['conditions'] = (array)$requestData['conditions'];
		}
		// order
		if (!empty($requestData['order'])) {
			$settings['order'] = $requestData['order'];
		}
		// pagination
		if (isset($requestData['paginate'])) {
			$pagRequestData = $requestData['paginate'];
			// page
			if (!empty($pagRequestData['page']) && is_numeric($pagRequestData['page'])) {
				$settings['page'] = (int)$pagRequestData['page'];
			}
			// limit
			if (!empty($pagRequestData['limit']) && is_numeric($pagRequestData['limit'])) {
				$settings['limit'] = (int)$pagRequestData['limit'];
			}
		}
		return $settings;
	}

	public function getSettingsByRequestDataTables($query, $object)
	{
		// init settings array
		$settings = [];
		// get request data
		$requestData = $this->_registry->getController()->getRequestData();
		// contain entities
		if (!empty($requestData['contain']) && is_array($requestData['contain'])) {
			$settings['contain'] = array_reverse((array)$requestData['contain']);
		}
		// fields
		if (!empty($requestData['fields']) && is_array($requestData['fields'])) {
			$settings['fields'] = (array)$requestData['fields'];
		}
		// conditions (by search field)
		if (!empty($requestData['search']['value'])) {
			$query = (string)$requestData['search']['value'];
			$fields = [];
			if (!empty($requestData['searchableColumnFields']) && is_array($requestData['searchableColumnFields'])) {
				foreach ($requestData['searchableColumnFields'] as $searchableColumnField) {
					if (strpos($searchableColumnField, '.') === false) {
						$searchableColumnField = $object->getAlias() . '.' . $searchableColumnField;
					}
					$fields[] = $searchableColumnField;
				}
			}
			if (!empty($fields)) {
				$queryWords = explode(' ', $query);
				$conditions = [];
				foreach ($fields as $field) {
					foreach ($queryWords as $queryWord) {
						$conditions[]['LOWER(' . $field . ') LIKE'] = '%' . strtolower($queryWord) . '%';
					}
				}
				if (!empty($conditions)) {
					$settings['conditions']['OR'] = $conditions;
				}
			}
		}
		// order
		if (!empty($requestData['order']) && is_array($requestData['order']) && !empty($requestData['columnFields']) && is_array($requestData['columnFields'])) {
			foreach ($requestData['order'] as $i => $order) {
				if (isset($requestData['columnFields'][$i])) {
					$columnField = $requestData['columnFields'][$order['column']];
					if (strpos($columnField, '.') === false) {
						$columnField = $object->getAlias() . '.' . $columnField;
					}
					$settings['order'][] = $columnField . ' ' . $order['dir'];
				}
			}
		}
		// pagination
			// limit
			if (!empty($requestData['length']) && is_numeric($requestData['length'])) {
				$settings['limit'] = (int)$requestData['length'];
			}
			// page
			if (!empty($requestData['start']) && is_numeric($requestData['start'])) {
				$settings['page'] = ((int)$requestData['start'] + $settings['limit']) / $settings['limit'];
			}
		return $settings;
	}

	private function __getPagingData($query, $object, $entries)
	{
		return $this->{__FUNCTION__ . $this->__getModeFromRequest('val')}($query, $object, $entries);
	}

	private function __getPagingDataNormal($query, $object, $entries)
	{
		$request = $this->_registry->getController()->getRequest();
		$paging = $request->getAttribute('paging', []);
		$data = [];
		if (isset($paging[$object->getAlias()])) {
			$pagingData = $paging[$object->getAlias()];
			$data = [
				'page' => $pagingData['page'],
				'pages_total' => $pagingData['pageCount'],
				'records_per_page' => $pagingData['perPage'],
				'records' => $pagingData['current'],
				'records_total' => $pagingData['count'],
				'data' => $entries
			];
		}
		return $data;
	}

	private function __getPagingDataDataTables($query, $object, $entries)
	{
		$request = $this->_registry->getController()->getRequest();
		$paging = $request->getAttribute('paging', []);
		$data = [];
		if (isset($paging[$object->getAlias()])) {
			// get request data
			$requestData = $this->_registry->getController()->getRequestData();
			// get paging data
			$pagingData = $paging[$object->getAlias()];
			$data = [
				'draw' => (!empty($requestData['draw']) && is_numeric($requestData['draw']) ? (int)$requestData['draw'] : 0),
				'recordsTotal' => $pagingData['count'],
				'recordsFiltered' => $pagingData['count'],
				'data' => $entries
			];
		}
		return $data;
	}

	private function __getModeFromRequest($return = 'val')
	{
		reset($this->__modes);
		$mode = key($this->__modes);
		// get request data
		$requestData = $this->_registry->getController()->getRequestData();
		// if we are DataTables (datatables.net) mode
		if (isset($requestData['mode']) && isset($this->__modes[$requestData['mode']])) {
			$mode = $requestData['mode'];
		}
		if ($return !== 'key') {
			$mode = $this->__modes[$mode];
		}
		return $mode;
	}









































	public function paginateNew($object, array $settings = [])
	{
		return $this->__prepareOutput($object, parent::paginate($object, $settings));
	}

	private function __prepareOutput($object, $results)
	{
		$query = null;
		if ($object instanceof QueryInterface) {
			$query = $object;
			$object = $query->repository();
		}

		$pagingParams = $this->getPaginator()->getPagingParams();
		$pagingParams = isset($pagingParams[$object->getAlias()]) ? $pagingParams[$object->getAlias()] : null;

		$data = [];
		if ($pagingParams) {
			$data = [
				'page' => $pagingParams['page'],
				'pages_total' => $pagingParams['pageCount'],
				'records_per_page' => $pagingParams['perPage'],
				'records' => $pagingParams['current'],
				'records_total' => $pagingParams['count'],
				'data' => $results
			];
		}
		return $data;
	}
}