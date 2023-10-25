<?php
use App\View\Widgets\Registry as WidgetRegistry;
use Cake\Database\Type;

// add editor form widget
WidgetRegistry::register('editor', ['Editor.Editor']);

// add content database type
Type::map('editor', 'Editor\Database\Type\EditorType');