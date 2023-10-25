<?php
// load Authentication Identity helper
$this->loadHelper('Authentication.Identity');
?>

<nav class="main-header navbar navbar-expand navbar-light">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
    </ul>

    <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown user-menu">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
                <?php echo $this->Html->image('avatar.svg', ['class' => 'user-image img-circle elevation-1']); ?>
                <span class="d-none d-md-inline"><?php echo $this->Identity->get('email'); ?></span>
            </a>
            <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <li class="user-header bg-primary">
                    <?php echo $this->Html->image('avatar.svg', ['class' => 'img-circle elevation-1']); ?>
                    <p><?php echo $this->Identity->get('email'); ?><small>registriert seit <?php echo $this->Time->i18nFormat($this->Identity->get('created')); ?> Uhr</small></p>
                </li>
                <!--
                <li class="user-body">
                    <div class="row">
                        <div class="col-4 text-center">
                            <a href="#">Link 1</a>
                        </div>
                        <div class="col-4 text-center">
                            <a href="#">Link 2</a>
                        </div>
                        <div class="col-4 text-center">
                            <a href="#">Link 3</a>
                        </div>
                    </div>
                </li>
                -->
                <li class="user-footer">
                    <a href="<?php echo $this->Url->build(['plugin' => false, 'controller' => 'Users', 'action' => 'edit', $this->Identity->getId()]); ?>" class="btn btn-default btn-flat">Account</a>
                    <a href="<?php echo $this->Url->build(['plugin' => false, 'controller' => 'Users', 'action' => 'logout']); ?>" class="btn btn-default btn-flat float-right">Logout</a>
                </li>
            </ul>
        </li>
    </ul>
</nav>