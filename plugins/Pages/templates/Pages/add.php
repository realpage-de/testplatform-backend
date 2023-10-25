<?php
// load Editor helper
$this->loadHelper('Editor.Editor');

echo $this->Form->create($data, ['ajax' => true, 'api' => '1/post/json', 'url' => ['action' => 'add']]);
?>
<div class="card card-outline card-primary">
	<div class="card-header">
		<h3 class="card-title">Allgemein</h3>
	</div>
	<div class="card-body">
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
		<div class="form-group">
			<?php echo $this->Form->label('path', 'Pfad', ['class' => 'col-form-label']); ?>
			<?php echo $this->Form->text('path', ['class' => 'form-control']); ?>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('content', 'Inhalt', ['class' => 'col-form-label']); ?>
			<?php
			echo $this->Editor->editor('content', [
				'class' => 'narrow',
				'components' => [
					'core' => [
						'editorTools' => [],
						//'blocks' => ['paragraph']
					],
					'custom' => [
						//'blocks' => []
					]
				],
				'templates' => ['inputContainer' => '{{content}}']
			]);
			?>
		</div>
	</div>
</div>
<?php echo $this->Form->end(); ?>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Pages.Add{init}')();", ['block' => true]); ?>