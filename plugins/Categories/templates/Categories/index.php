<?php
// set html title
$this->assign('title', 'Kategorien');
?>
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Kategorien</h1>
			</div>
		</div>
	</div>
</section>

<section class="content">
	<div class="container-fluid">
		<p><a class="btn btn-primary" data-add-category href="<?php echo $this->Url->build(['plugin' => 'Categories', 'controller' => 'Categories', 'action' => 'add']); ?>">Kategorie anlegen</a></p>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Übersicht</h3>
			</div>
			<div class="card-body">
				<table data-table-categories class="table table-striped table-categories">
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

<?php $this->Html->scriptBlock("window.app.Plugins.get('Categories.Index{init}')();", ['block' => true]); ?>