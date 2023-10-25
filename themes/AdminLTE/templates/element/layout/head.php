<head>
    <?php echo $this->Html->charset(); ?>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no"/>
    <title><?php echo $this->fetch('title'); ?></title>
    <?php
    //echo $this->Html->meta('icon');

    echo $this->fetch('meta');

    echo $this->Html->css(['plugins/fontawesome/css/all.min.css']);
    echo $this->Html->css(['https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css']);
    echo $this->Html->css(['https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700']);

    echo $this->Html->css(['app']);
	echo $this->Html->css(['Editor.editor']);
	echo $this->Html->css(['plugins']);

    $this->fetch('css');

    // js settings
    echo $this->Html->scriptBlock('window.settings = ' . json_encode([
        'debug' => $this->Configure->read('debug'),
        'locale' => str_replace('_', '-', $this->Configure->read('App.defaultLocale')),
        'basePath' => $this->request->getAttribute('webroot'),
        'csrfToken' => $this->request->getCookie('csrfToken')
    ]) . ';');

    echo $this->Html->script(['https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js']);
    echo $this->Html->script(['app']);
    echo $this->Html->script(['Editor.editor']);
    echo $this->Html->script(['plugins']);
    ?>
</head>