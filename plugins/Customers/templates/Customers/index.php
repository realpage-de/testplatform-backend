<?php
// set html title
$this->assign('title', 'Kunden');
?>
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Kunden</h1>
			</div>
		</div>
	</div>
</section>

<section class="content">
	<div class="container-fluid">
		<p><a class="btn btn-primary" data-add-customer href="<?php echo $this->Url->build(['plugin' => 'Customers', 'controller' => 'Customers', 'action' => 'add']); ?>">Kunde anlegen</a></p>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Übersicht</h3>
			</div>
			<div class="card-body">
				<table data-table-customers class="table table-striped table-customers">
					<thead>
						<tr>
							<th data-status>Status</th>
							<th>Name</th>
							<th data-actions></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</section>

<?php $this->Html->scriptBlock("window.app.Plugins.get('Customers.Index{init}')();", ['block' => true]); ?>