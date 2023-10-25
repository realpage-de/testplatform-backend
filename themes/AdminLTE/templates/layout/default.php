<!DOCTYPE html>
<html lang="de">
<?php echo $this->element('layout/head'); ?>
<body class="hold-transition sidebar-mini text-sm">

<div class="wrapper">
    <?php echo $this->element('layout/header'); ?>

    <?php echo $this->element('layout/sidebar'); ?>

    <div class="content-wrapper">
        <?php echo $this->fetch('content'); ?>
    </div>
</div>
<?php echo $this->element('layout/foot'); ?>
</body>
</html>