<?php
// set html title
$this->assign('title', 'Benutzer');
?>
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Benutzer</h1>
			</div>
		</div>
	</div>
</section>

<section class="content">
	<div class="container-fluid">
		<p><a class="btn btn-primary" data-add-user href="<?php echo $this->Url->build(['plugin' => 'Users', 'controller' => 'Users', 'action' => 'add']); ?>">Benutzer anlegen</a></p>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Übersicht</h3>
			</div>
			<div class="card-body">
				<table data-table-users class="table table-striped table-users">
					<thead>
						<tr>
							<th data-status>Status</th>
							<th>Benutzername</th>
							<th>Geschlecht</th>
							<th>Vorname</th>
							<th>Nachname</th>
							<th>Geburtsdatum</th>
							<th data-actions></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</section>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Users.Index{init}')();", ['block' => true]); ?>