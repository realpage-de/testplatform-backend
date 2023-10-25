<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Controller\Controller as BaseController;
use Cake\Event\EventInterface;
use Cake\Core\Configure;
use Cake\Core\Plugin;
use Cake\Core\App;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 */
class Controller extends BaseController
{
    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('FormProtection');`
     *
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');
        $this->loadComponent('FormProtection');

        $this->loadComponent('Authentication.Authentication');
    }

	public function beforeRender(EventInterface $event)
	{
		// set theme
        $this->__setTheme();
		// set view class
		$this->__setViewClass();
	}

	private function __setTheme(): bool
	{
		$status = false;
		$theme = Configure::read('Theme');
		if (is_string($theme) && Plugin::isLoaded($theme)) {
            $this->viewBuilder()->setTheme($theme);
			$status = true;
		}
		return $status;
    }

	private function __setViewClass() // AdminLTE.App
	{
        $theme = $this->viewBuilder()->getTheme();
        $classname = $this->viewBuilder()->getClassName();

        $xView = $this->request->getHeaderLine('X-View');
		if (!empty($xView)) {
            $classname = $this->__getViewClassName($xView);
        }
        else if ($classname !== null) {
            $view = App::shortName($classname, 'View', 'View');
            $classname = $this->__getViewClassName($view);
        }
        else if ($classname === null) {
            $classname = $this->__getViewClassName('App');
        }

        if ($classname !== null) {
            $this->viewBuilder()->setClassName($classname);
        }
    }

    private function __getViewClassName($view)
    {
        $theme = $this->viewBuilder()->getTheme();
        $classname = App::className(($theme ? $theme . '.' : '') . $view, 'View', 'View');
        if ($classname === null) {
            $classname = App::className($view, 'View', 'View');
        }
        return $classname;
    }
}
