<?php
// load Authentication Identity helper
$this->loadHelper('Authentication.Identity');

// set html title
$this->assign('title', 'Benutzer: ' . $this->Identity->get('email'));
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
        <p><?php echo $this->Identity->get('email'); ?></p>
	</div>
</section>