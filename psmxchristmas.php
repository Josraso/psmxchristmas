<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class psmxchristmas extends Module
{
    public function __construct()
    {
        $this->name = 'psmxchristmas';
        $this->tab = 'front_office_features';
        $this->version = '2.0.0';
        $this->author = 'PSMX';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Decoraciones Navideñas PSMX');
        $this->description = $this->l('Sistema profesional de decoraciones navideñas con luces, nieve, estrellas y confeti. Totalmente configurable.');

        $this->ps_versions_compliancy = array('min' => '8.0.0', 'max' => _PS_VERSION_);
    }

    public function install()
    {
        return parent::install()
            && $this->registerHook('displayHeader')
            && $this->registerHook('displayHome');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    public function hookDisplayHeader($params)
    {
        // Añadimos el CSS y JS necesario
        $this->context->controller->registerStylesheet(
            'module-psmxchristmas-style',
            'modules/'.$this->name.'/views/css/christmas.css'
        );

        $this->context->controller->registerJavascript(
            'module-psmxchristmas-script',
            'modules/'.$this->name.'/views/js/christmas.js',
            ['position' => 'bottom', 'priority' => 150]
        );
    }

    public function hookDisplayHome($params)
    {
        // Las decoraciones se cargan automáticamente via JS
        return '';
    }
}
