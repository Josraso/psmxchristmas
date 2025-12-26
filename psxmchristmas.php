<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class psmxchristmas extends Module
{
    public function __construct()
    {
        $this->name = 'psxmchristmas';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'AI Assistant';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Luces Navideñas');
        $this->description = $this->l('Añade luces navideñas animadas al inicio de tu tienda.');

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
            'module-psxmchristmas-style',
            'modules/'.$this->name.'/views/css/psxmchristmas.css'
        );

        $this->context->controller->registerJavascript(
            'module-psxmchristmas-script',
            'modules/'.$this->name.'/views/js/psxmchristmas.js',
            ['position' => 'bottom', 'priority' => 150]
        );
    }

    public function hookDisplayHome($params)
    {
        return $this->display(__FILE__, 'psxmchristmas.tpl');
    }
}
