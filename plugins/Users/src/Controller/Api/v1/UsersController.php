<?php
declare(strict_types=1);

namespace Users\Controller\Api\v1;

use Exception;
use Cake\Datasource\Exception\RecordNotFoundException;
use Cake\Auth\DefaultPasswordHasher;
use Cake\I18n\FrozenTime;

class UsersController extends Controller
{

    public function index()
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Users.Users');
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
			$table = $this->getTableLocator()->get('Users.Users');
			// create entity
			$associated = ['Profile', 'Profile.Gender', 'Profile.Country', 'Children', 'Interests'];
			$entity = $table->newEntity($this->getRequestData(), ['associated' => $associated]);
			// error check
			if (!$entity->getErrors()) {
				// set created
				$entity->set('created', FrozenTime::now());
				// set password
				$hasher = new DefaultPasswordHasher();
				$pass = $hasher->hash($entity->get('password'));
				$entity->set('password', $pass);
				// save entity
				if ($table->save($entity)) {
					// get created entity
					$entity = $table->get($entity->get('id'), ['contain' => $associated]);
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
			// get request
			$request = $this->getRequestData();
			// handle optional password
			if (isset($request['password']) && (!is_string($request['password']) || empty($request['password']))) {
				unset($request['password']);
			}
			// get table
			$table = $this->getTableLocator()->get('Users.Users');
			// set entity
			$associated = ['Profile', 'Profile.Gender', 'Profile.Country', 'Children', 'Interests'];
			$orginalEntity = $table->get($id, ['contain' => $associated]);
			$entity = $table->patchEntity($orginalEntity, $request, ['associated' => $associated]);
			// error check
			if (!$entity->getErrors()) {
				// set password if given
				if (isset($request['password'])) {
					$hasher = new DefaultPasswordHasher();
					$entity->set('password', $hasher->hash($request['password']));
				}
				// save entity
				if ($table->save($entity)) {
					// delete children
					$this->__handleChildrenFormDelete($request, $id);
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
			$this->_setResponse(404, 'User not found');
		}
		// all other exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}

	private function __handleChildrenFormDelete($request, $userId)
	{
		if (isset($request['has_children'])) {
			// get table
			$table = $this->getTableLocator()->get('Users.Children');
			if (in_array($request['has_children'], [true, 'true', 1, '1'])) {
				if (isset($request['children']) && is_array($request['children'])) {
					foreach ($request['children'] as $child) {
						if (isset($child['id']) && !empty($child['id']) && isset($child['deleted']) && in_array($child['deleted'], [true, 'true', 1, '1'])) {
							// get entity
							$entity = $table->findByIdAndUserId($child['id'], $userId);
							// delete entity
							if ($entity) {
								$table->delete($entity);
							}
						}
					}
				}
			} else {
				$table->deleteAll(['user_id' => $userId]);
			}
		}
	}

	public function delete($id)
	{
		try {
			// get table
			$table = $this->getTableLocator()->get('Users.Users');
			// get entity
			$associated = ['Profile', 'Profile.Gender', 'Profile.Country', 'Children', 'Interests'];
			$entity = $table->get($id, ['contain' => $associated]);
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
			$this->_setResponse(404, 'User not found');
		}
		// all other exceptions
		catch (Exception $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}
}