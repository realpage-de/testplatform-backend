<?php
declare(strict_types=1);

namespace AdminLTE\View;

use App\View\AppView as BaseAppView;

class AppView extends BaseAppView
{

    public function initialize(): void
    {
        $this->loadHelper('AdminLTE.Form');
    }
}
