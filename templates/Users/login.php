<?php
// set html title
$this->assign('title', 'Login');
?>
<style>
.message.error {
    position: relative;
    margin-bottom: 1rem;
    padding: .5rem 1rem;
    color: #dc3545;
    text-align: center;
}
</style>

<div class="login-box">
    <div class="login-logo">
        <span style="color:#495057;">Mamas <strong>testen</strong></span>
    </div>
    <div class="card">
        <div class="card-body login-card-body">
            <?php echo $this->Flash->render(); ?>

            <?php echo $this->Form->create(); ?>
                <div class="input-group mb-3">
                    <?php echo $this->Form->email('email', ['required' => true, 'class' => 'form-control', 'placeholder' => 'E-Mailadresse', 'autofocus']); ?>
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <?php echo $this->Form->password('password', ['required' => true, 'class' => 'form-control', 'placeholder' => 'Passwort', 'value' => '']); ?>
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4 ml-auto">
                        <?php echo $this->Form->submit(__('Anmelden'), ['class' => 'btn btn-primary btn-block']); ?>
                    </div>
                </div>
            <?php echo $this->Form->end(); ?>
        </div>
    </div>
</div>