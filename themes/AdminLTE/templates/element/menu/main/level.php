<?php
$items = $data->getChildren();
$params = $this->request->getAttribute('params');
foreach ($items as $item) {
	$attrIcon = $item->getAttribute('icon');
	// get icon html
	$iconHtml = '<i class="nav-icon fa fa-circle-o"></i>';
	if (isset($attrIcon)) {
		if ($attrIcon === false) {
			$iconHtml = '';
		} else {
			$iconHtml = '<i class="nav-icon ' . $attrIcon . '"></i>';
		}
	}
	// build html
	if (!$item->hasChildren()) {
        ?>
        <li class="nav-item">
            <a class="nav-link<?php echo ($item->isActive($params) === true ? ' active' : ''); ?>" href="<?php echo $this->Url->build($item->getUri()); ?>">
				<?php echo $iconHtml; ?>
				<p><?php echo $item->getLabel(); ?></p>
			</a>
		</li>
        <?php 
    } else {
        ?>
        <li class="nav-item has-treeview<?php echo ($item->isChildActive($params) === true ? ' menu-open' : ''); ?>">
			<a class="nav-link<?php echo ($item->isChildActive($params) === true ? ' active' : ''); ?>" href="javascript:;">
				<?php echo $iconHtml; ?>
				<p><?php echo $item->getLabel(); ?><i class="right fas fa-angle-left"></i></p>
			</a>
            <ul class="nav nav-treeview">
				<?php echo $this->element('menu/main/level', ['data' => $item]); ?>
			</ul>
		</li>
        <?php
    }
}