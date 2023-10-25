<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Event\EventInterface;

class UsersController extends Controller
{

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
        // Configure the login action to not require authentication, preventing the infinite redirect loop issue
        $this->Authentication->addUnauthenticatedActions(['login']);
    }
    
    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();

        $this->viewBuilder()->setLayout('login');

        // regardless of POST or GET, redirect if user is logged in
        if ($result->isValid()) {
            // redirect to dashboard after login success
			$redirect = $this->request->getQuery('redirect', [
				'plugin' => 'Dashboard',
				'controller' => 'Dashboard',
				'action' => 'index'
			]);

			$prefix = $this->request->getAttribute('webroot');
			if (is_string($redirect) && substr($redirect, 0, strlen($prefix)) == $prefix) {
				$redirect = '/' . substr($redirect, strlen($prefix));
			}

            return $this->redirect($redirect);
        }
        // display error if user submitted and authentication failed
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Zugangsdaten sind ungültig!'));
        }
    }

    public function edit($id)
    {
		try {
			// get table
			$table = $this->getTableLocator()->get('Users');
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

	public function logout()
	{
		$result = $this->Authentication->getResult();
		// regardless of POST or GET, redirect if user is logged in
		if ($result->isValid()) {
			$this->Authentication->logout();
			return $this->redirect(['controller' => 'Users', 'action' => 'login']);
		}
	}
}