<?php
// load Editor helper
$this->loadHelper('Editor.Editor');

echo $this->Form->create($data, ['ajax' => true, 'api' => '1/post/json', 'url' => ['action' => 'add']]);
?>
<ul class="nav nav-tabs nav-tabs-producttest" role="tablist" data-tabs>
	<li class="nav-item">
		<a class="nav-link active" role="tab" data-toggle="tab" href="#general">Allgemein</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" role="tab" data-toggle="tab" href="#phase1">Bewerbungsphase</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" role="tab" data-toggle="tab" href="#phase2">Testphase</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" role="tab" data-toggle="tab" href="#phase3">Ergebnisphase</a>
	</li>
</ul>

<div class="tab-content">
	<div class="tab-pane fade show active" role="tabpanel" id="general">
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
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('category_id', 'Kategorie', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('category_id', $category, ['empty' => '--- bitte auswählen ---', 'class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('customer_id', 'Kunde', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('customer_id', $customer, ['empty' => '--- bitte auswählen ---', 'class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('image', 'Bild', ['class' => 'col-form-label']); ?>
			<?php echo $this->Form->text('image', ['class' => 'form-control']); ?>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('seal_image', 'Siegelbild', ['class' => 'col-form-label']); ?>
			<?php echo $this->Form->text('seal_image', ['class' => 'form-control']); ?>
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

	<div class="tab-pane fade" role="tabpanel" id="phase1">
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_1_date_start', 'Datum Start', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_1_date_start', ['type' => 'date']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_1_date_end', 'Datum Ende', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_1_date_end', ['type' => 'date']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('phase_1_content', 'Inhalt', ['class' => 'col-form-label']); ?>
			<?php
			echo $this->Editor->editor('phase_1_content', [
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

	<div class="tab-pane fade" role="tabpanel" id="phase2">
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_2_date_start', 'Datum Start', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_2_date_start', ['type' => 'date']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_2_date_end', 'Datum Ende', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_2_date_end', ['type' => 'date']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('phase_2_content', 'Inhalt', ['class' => 'col-form-label']); ?>
			<?php
			echo $this->Editor->editor('phase_2_content', [
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

	<div class="tab-pane fade" role="tabpanel" id="phase3">
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_3_date_start', 'Datum Start', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_3_date_start', ['type' => 'date']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('phase_3_date_end', 'Datum Ende', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->input('phase_3_date_end', ['type' => 'date']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('phase_3_content', 'Inhalt', ['class' => 'col-form-label']); ?>
			<?php
			echo $this->Editor->editor('phase_3_content', [
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

<?php $this->Html->scriptBlock("window.app.Plugins.get('Producttests.Add{init}')();", ['block' => true]); ?>