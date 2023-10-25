<?php
// set html title
$this->assign('title', 'Produkttests');
?>
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Produkttests</h1>
			</div>
		</div>
	</div>
</section>

<section class="content">
	<div class="container-fluid">
		<p><a class="btn btn-primary" data-add-producttest href="<?php echo $this->Url->build(['plugin' => 'Producttests', 'controller' => 'Producttests', 'action' => 'add']); ?>">Produkttest anlegen</a></p>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Übersicht</h3>
			</div>
			<div class="card-body">
				<table data-table-producttests class="table table-striped table-producttests">
					<thead>
						<tr>
							<th data-status>Status</th>
							<th class="col-date-start">Start</th>
							<th class="col-date-end">Ende</th>
							<th>Name</th>
							<th>Kategorie</th>
							<th>Bildvorschau</th>
							<th data-actions></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</section>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Producttests.Index{init}')();", ['block' => true]); ?>