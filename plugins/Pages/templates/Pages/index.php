<?php
// set html title
$this->assign('title', 'Seiten');
?>
<style>
.table-pages .col-date-start,
.table-pages .col-date-end {
	width: 70px;
}
</style>

<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Seiten</h1>
			</div>
		</div>
	</div>
</section>

<section class="content">
	<div class="container-fluid">
		<p><a class="btn btn-primary" data-add-page href="<?php echo $this->Url->build(['plugin' => 'Pages', 'controller' => 'Pages', 'action' => 'add']); ?>">Seite anlegen</a></p>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Übersicht</h3>
			</div>
			<div class="card-body">
				<table data-table-pages class="table table-striped table-pages">
					<thead>
						<tr>
							<th data-status>Status</th>
							<th>Name</th>
							<th>Pfad</th>
							<th data-actions></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</section>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Pages.Index{init}')();", ['block' => true]); ?>