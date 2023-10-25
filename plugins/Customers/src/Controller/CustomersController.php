<?php
declare(strict_types=1);

namespace Customers\Controller;

use Cake\Datasource\Exception\RecordNotFoundException;

class CustomersController extends Controller
{

    public function index()
    {
    }

	public function add()
	{
		// get table
		$table = $this->getTableLocator()->get('Customers.Customers');
		// create entity
		$entity = $table->newEntity([]);
		// set entity
		$this->set('data', $entity);
	}

    public function edit($id)
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Customers.Customers');
			// get entity
			$entity = $table->get($id);
			// set Article entity
			$this->set('data', $entity);
		}
		// entity not found
		catch (RecordNotFoundException $exception) {
			$this->_setExceptionResponse($exception);
		}
	}
}