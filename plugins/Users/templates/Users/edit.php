<?php
echo $this->Form->create($data, ['ajax' => true, 'api' => '1/put/json', 'url' => ['action' => 'edit', $data->get('id')]]);
?>
<ul class="nav nav-tabs nav-tabs-user" role="tablist" data-tabs>
	<li class="nav-item">
		<a class="nav-link active" role="tab" data-toggle="tab" href="#account">Account</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" role="tab" data-toggle="tab" href="#profil">Profil</a>
	</li>
</ul>

<div class="tab-content">
	<div class="tab-pane fade show active" role="tabpanel" id="account">
		<div class="form-row">
			<div class="form-group col-md-9">
				<?php echo $this->Form->label('username', 'Benutzername', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('username', ['class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-3">
				<?php echo $this->Form->label('status', 'Status', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('status', [0 => 'inaktiv', 1 => 'aktiv'], ['empty' => false, 'class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('email', 'E-Mailadresse', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('email', ['class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('password', 'Passwort', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('password', ['value' => '', 'placeholder' => 'leer lassen, wenn es nicht geändert werden soll', 'class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-row">
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('newsletter', 'Newsletter', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('newsletter', [0 => 'nein', 1 => 'ja'], ['empty' => false, 'class' => 'form-control']); ?>
			</div>
		</div>
	</div>

	<div class="tab-pane fade" role="tabpanel" id="profil">
		<div class="form-row">
			<div class="form-group col-md-4">
				<?php echo $this->Form->label('profile.gender_id', 'Anrede', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('profile.gender_id', $genderList, ['empty' => '--- bitte auswählen ---', 'class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-4">
				<?php echo $this->Form->label('profile.first_name', 'Vorname', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.first_name', ['class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-4">
				<?php echo $this->Form->label('profile.last_name', 'Nachname', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.last_name', ['class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-row">
			<div class="form-group col-md-4">
				<?php echo $this->Form->label('profile.date_of_birth', 'Geburtsdatum', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.date_of_birth', ['type' => 'date']); ?>
			</div>
			<div class="form-group col-md-5">
				<?php echo $this->Form->label('profile.street', 'Straße', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.street', ['class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-3">
				<?php echo $this->Form->label('profile.street_number', 'Hausnummer', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.street_number', ['class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('profile.address_extra', 'Adresszusatz', ['class' => 'col-form-label']); ?>
			<?php echo $this->Form->text('profile.address_extra', ['class' => 'form-control']); ?>
		</div>
		<div class="form-row">
			<div class="form-group col-md-2">
				<?php echo $this->Form->label('profile.zip', 'PLZ', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.zip', ['inputmode' => 'numeric', 'class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-6">
				<?php echo $this->Form->label('profile.city', 'Stadt', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->text('profile.city', ['class' => 'form-control']); ?>
			</div>
			<div class="form-group col-md-4">
				<?php echo $this->Form->label('profile.country_id', 'Land', ['class' => 'col-form-label']); ?>
				<?php echo $this->Form->select('profile.country_id', $countryList, ['empty' => '--- bitte auswählen ---', 'class' => 'form-control']); ?>
			</div>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('children', 'Kinder', ['class' => 'col-form-label']); ?>
			<div class="form-radio form-radio-inline">
				<?php echo $this->Form->radio('has_children', ['nein', 'ja'], ['value' => 0, 'data-input-has-children']); ?>
			</div>
			<div data-widget-user-children>
				<div data-list></div>
				<?php echo $this->Form->button('Hinzufügen', ['type' => 'button', 'data-button-add', 'class' => 'btn btn-primary']); ?>
			</div>
			<script>
			UserChildrenFormWidget({
				container: document.querySelector('[data-widget-user-children]'),
				inputHasChildrenNo: document.querySelector('input[type="radio"][name="has_children"][value="0"]'),
				inputHasChildrenYes: document.querySelector('input[type="radio"][name="has_children"][value="1"]'),
				data: <?php echo json_encode($data->getChildrenAsArray()); ?>,
				genders: <?php echo json_encode($genders); ?>,
				months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
			});
			</script>
		</div>
		<div class="form-group">
			<?php echo $this->Form->label('interests', 'Interessen', ['class' => 'col-form-label']); ?>
			<div class="form-checkbox form-checkbox-inline">
				<?php echo $this->Form->select('interests._ids', $categoryList, ['multiple' => 'checkbox']); ?>
			</div>
		</div>
	</div>
</div>
<?php echo $this->Form->end(); ?>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Users.Edit{init}')();", ['block' => true]); ?>