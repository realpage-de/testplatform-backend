<?php if ($data->hasChildren()) { ?>
	<ul class="nav nav-pills nav-sidebar flex-column nav-flat" data-widget="treeview" role="menu" data-accordion="false">
		<?php echo $this->element('menu/main/level'); ?>
	</ul>
<?php }