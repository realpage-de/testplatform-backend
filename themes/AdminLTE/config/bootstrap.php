<?php
use App\View\Widgets\Registry as WidgetRegistry;
use Cake\Database\Type;

// add datetime form widget
//WidgetRegistry::register('time', ['AdminLTE.DateTime']);
WidgetRegistry::register('date', ['AdminLTE.DateTime']);
WidgetRegistry::register('datetime', ['AdminLTE.DateTime']);
WidgetRegistry::register('rp-switch', ['AdminLTE.RPSwitch']);