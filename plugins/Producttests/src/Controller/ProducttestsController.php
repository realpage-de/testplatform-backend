<?php
declare(strict_types=1);

namespace Producttests\Controller;

use Cake\Datasource\Exception\RecordNotFoundException;

class ProducttestsController extends Controller
{

    public function index()
    {
    }

	public function add()
	{
		// get table
		$table = $this->getTableLocator()->get('Producttests.Producttests');
		// create entity
		$entity = $table->newEntity([]);
		// get Category table
		$tableCategories = $this->getTableLocator()->get('Categories.Categories');
		// set Category tree list
		$this->set('category', $tableCategories->find('list')->toArray());
		// get Customer table
		$tableCustomers = $this->getTableLocator()->get('Customers.Customers');
		// set Customer tree list
		$this->set('customer', $tableCustomers->find('list')->toArray());
		// set entity
		$this->set('data', $entity);
	}

    public function edit($id)
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Producttests.Producttests');
			// get entity
			$entity = $table->get($id);
			// get Category table
			$tableCategories = $this->getTableLocator()->get('Categories.Categories');
			// set Category tree list
			$this->set('category', $tableCategories->find('list')->toArray());
			// get Customer table
			$tableCustomers = $this->getTableLocator()->get('Customers.Customers');
			// set Customer tree list
			$this->set('customer', $tableCustomers->find('list')->toArray());
			// set Article entity
			$this->set('data', $entity);
		}
		// entity not found
		catch (RecordNotFoundException $exception) {
			$this->_setExceptionResponse($exception);
		}
	}
}