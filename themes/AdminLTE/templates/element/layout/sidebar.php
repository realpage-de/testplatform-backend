<aside class="main-sidebar sidebar-light-primary elevation-1">
    <a href="<?php echo $this->Url->build(['plugin' => 'Dashboard', 'controller' => 'Dashboard', 'action' => 'index']); ?>" class="brand-link">
        <span class="brand-text">Mamas <strong>testen</strong></span>
    </a>
    <div class="sidebar">
        <nav class="mt-2">
            <?php echo $this->cell('Menu::main'); ?>
        </nav>
    </div>
</aside>