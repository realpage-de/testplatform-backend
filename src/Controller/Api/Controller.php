<?php
declare(strict_types=1);

namespace App\Controller\Api;

use Cake\Controller\Controller as CakeController;
use Exception;
use InvalidArgumentException;

class Controller extends CakeController
{

	public function initialize(): void
    {
		parent::initialize();

		// load components
		$this->loadComponent('RequestHandler');
		$this->loadComponent('Paginator', ['className' => 'Api/Paginator']);
	}

	public function getRequestData($mode = ['get', 'post'])
	{
		if (!is_array($mode)) {
			$mode = [(string)$mode];
		}
		switch (array_map('strtolower', $mode)) {
			case ['get']:
				$request = $this->request->getQuery();
				break;
			case ['post']:
				$request = $this->request->getData();
				break;
			case ['get', 'post']:
				$request = array_merge($this->request->getQuery(), $this->request->getData());
				break;
			case ['post', 'get']:
				$request = array_merge($this->request->getData(), $this->request->getQuery());
				break;
			default:
				$request = [];
		}
		return $request;
	}

	protected function _setResponse($statusCode, $data = null, array $errors = [])
	{
		try {
			$response = [];
			// set status code
			$this->setResponse($this->response->withStatus((int)$statusCode));
			switch (substr((string)$statusCode, 0, 1)) {
				case 2:
					if ($data === null) {
						$this->autoRender = false;
					} else {
						$response = $data;
						if (!is_array($response)) {
							$response = [(string)$response];
						}
					}
					break;
				case 4:
				case 5:
					if ($data === null) {
						// disable autorender
						$this->autoRender = false;
					} else {
						$response['code'] = (int)$statusCode;
						// set error code & message
						if (is_array($data)) {
							if (count($data) === 1) {
								$errorMessage = reset($data);
							} else if (count($data) > 1) {
								list($errorCode, $errorMessage) = $data;
							}
						} else {
							$errorMessage = (string)$data;
						}
						if (isset($errorCode)) {
							$response['errorCode'] = is_numeric($errorCode) ? (int)$errorCode : (string)$errorCode;
						}
						$response['message'] = (string)$errorMessage;
						// add errors
						if (!empty($errors)) {
							$response['errors'] = $errors;
						}
					}
					break;
			}
			$this->set('response', $response);
			$this->viewBuilder()->setOption('serialize', 'response');
		}
		catch (InvalidArgumentException $exception) {
			$this->_setExceptionResponse($exception, ['statusCode' => 500]);
		}
	}

	protected function _setExceptionResponse(Exception $exception, array $overrides = [])
	{
		// get status code
		$statusCode = (int)(isset($overrides['statusCode']) ? $overrides['statusCode'] : $exception->getCode());
		// get error code
		$errorCode = (isset($overrides['errorCode']) ? $overrides['errorCode'] : null);
		// get message
		$message = (string)(isset($overrides['message']) ? $overrides['message'] : $exception->getMessage());
		// build error
		if ($errorCode !== null) {
			$error = [$errorCode, $message];
		} else {
			$error = $message;
		}
		// set response
		$this->_setResponse($statusCode, $error);
	}

	protected function _setInvalidationResponse(array $errors, array $overrides = [])
	{
		// get status code
		$statusCode = (int)(isset($overrides['statusCode']) ? $overrides['statusCode'] : 400);
		// get error code
		$errorCode = (isset($overrides['errorCode']) ? $overrides['errorCode'] : null);
		// get message
		$message = (string)(isset($overrides['message']) ? $overrides['message'] : 'Validation error');
		// build error
		if ($errorCode !== null) {
			$error = [$errorCode, $message];
		} else {
			$error = $message;
		}
		// set response
		$this->_setResponse($statusCode, $error, $errors);
	}
}