<?php
echo $this->Form->create($data, ['ajax' => true, 'api' => '1/put/json', 'url' => ['action' => 'edit', $data->get('id')]]);
?>
<div class="form-row">
	<div class="form-group col-md-9">
		<?php echo $this->Form->label('name', 'Name', ['class' => 'col-form-label']); ?>
		<?php echo $this->Form->text('name', ['class' => 'form-control']); ?>
	</div>
	<div class="form-group col-md-3">
		<?php echo $this->Form->label('status', 'Status', ['class' => 'col-form-label']); ?>
		<?php echo $this->Form->select('status', [0 => 'inaktiv', 1 => 'aktiv'], ['empty' => false, 'class' => 'form-control']); ?>
	</div>
</div>
<?php echo $this->Form->end(); ?>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Categories.Edit{init}')();", ['block' => true]); ?>