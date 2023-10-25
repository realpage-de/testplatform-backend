<?php
declare(strict_types=1);

namespace Users\Controller;

use Cake\Datasource\Exception\RecordNotFoundException;

class UsersController extends Controller
{

    public function index()
    {
    }

	public function add()
	{
		// get table
		$table = $this->getTableLocator()->get('Users.Users');
		// create entity
		$entity = $table->newEntity([]);
		// get Genders table
		$tableGenders = $this->getTableLocator()->get('Users.Genders');
		// set Genders
		$this->set('genders', $tableGenders->find()->select(['id', 'title', 'gender'])->all()->toArray());
		// set Gender list
		$this->set('genderList', $tableGenders->find('list')->toArray());
		// get Countries table
		$tableCountries = $this->getTableLocator()->get('Users.Countries');
		// set Country list
		$this->set('countryList', $tableCountries->find('list')->toArray());
		// get Categories table
		$tableCategories = $this->getTableLocator()->get('Categories.Categories');
		// set Category list
		$this->set('categoryList', $tableCategories->find('list')->toArray());
		// set entity
		$this->set('data', $entity);
	}

    public function edit($id)
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Users.Users');
			// get entity
			$entity = $table->get($id, [
                'contain' => [
					'Profile',
					'Children',
					'Interests'
                ]
            ]);
            // get Genders table
            $tableGenders = $this->getTableLocator()->get('Users.Genders');
			// set Genders
			$this->set('genders', $tableGenders->find()->select(['id', 'title', 'gender'])->all()->toArray());
            // set Gender list
            $this->set('genderList', $tableGenders->find('list')->toArray());
            // get Countries table
            $tableCountries = $this->getTableLocator()->get('Users.Countries');
            // set Country list
			$this->set('countryList', $tableCountries->find('list')->toArray());
			// get Categories table
            $tableCategories = $this->getTableLocator()->get('Categories.Categories');
            // set Category list
			$this->set('categoryList', $tableCategories->find('list')->toArray());
			// set Article entity
			$this->set('data', $entity);
		}
		// entity not found
		catch (RecordNotFoundException $exception) {
			$this->_setExceptionResponse($exception);
		}
	}
}