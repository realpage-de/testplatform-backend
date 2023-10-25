<?php
declare(strict_types=1);

namespace Customers\Controller\Api\v1;

use Exception;
use Cake\Datasource\Exception\RecordNotFoundException;

class CustomersController extends Controller
{

    public function index()
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Customers.Customers');
			// get pagination data
			$paginationData = $this->Paginator->paginate2($table);
			// set response
			$this->_setResponse(200, $paginationData);
		}
		// exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}

	public function add()
	{
		try {
			// get  table
			$table = $this->getTableLocator()->get('Customers.Customers');
			// create entity
			$entity = $table->newEntity($this->getRequestData());
			// error check
			if (!$entity->getErrors()) {
				// save entity
				if ($table->save($entity)) {
					// get created entity
					$entity = $table->get($entity->id);
					// set response
					$this->_setResponse(200, ['data' => $entity]);
				} else {
					// set response
					$this->_setResponse(500, 'Creation failed');
				}
			} else {
				// set response
				$this->_setInvalidationResponse($entity->getErrors());
			}
		}
		// exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}

	public function edit($id)
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Customers.Customers');
			// set entity
			$entity = $table->patchEntity($table->get($id), $this->getRequestData());
			// error check
			if (!$entity->getErrors()) {
				// save entity
				if ($table->save($entity)) {
					// get updated entity
					$entity = $table->get($id);
					// set response
					$this->_setResponse(200, ['data' => $entity]);
				} else {
					// set response
					$this->_setResponse(500, 'Saving failed');
				}
			} else {
				// set response
				$this->_setInvalidationResponse($entity->getErrors());
			}
		}
		// entity not found
		catch (RecordNotFoundException $exception) {
			$this->_setResponse(404, 'Customer not found');
		}
		// all other exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}

	public function delete($id)
	{
		try {
			// get table
			$table = $this->getTableLocator()->get('Customers.Customers');
			// get entity
			$entity = $table->get($id);
			// delete entity
			if ($table->delete($entity)) {
				// set response
				$this->_setResponse(204);
			} else {
				// set response
				$this->_setResponse(500, 'Deletion failed');
			}
		}
		// entity not found
		catch (RecordNotFoundException $exception) {
			// set response
			$this->_setResponse(404, 'Customer not found');
		}
		// all other exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}
}