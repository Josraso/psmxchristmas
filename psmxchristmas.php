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
        // Eliminar configuraciones
        Configuration::deleteByName('PSMX_LIGHTS_ENABLED');
        Configuration::deleteByName('PSMX_LIGHTS_COUNT');
        Configuration::deleteByName('PSMX_LIGHTS_SHOW_CABLE');
        Configuration::deleteByName('PSMX_SNOW_ENABLED');
        Configuration::deleteByName('PSMX_SNOW_TYPE');
        Configuration::deleteByName('PSMX_SNOW_COUNT');
        Configuration::deleteByName('PSMX_SNOW_SPEED');
        Configuration::deleteByName('PSMX_SNOW_SIZE');
        Configuration::deleteByName('PSMX_STARS_ENABLED');
        Configuration::deleteByName('PSMX_STARS_COUNT');
        Configuration::deleteByName('PSMX_CONFETTI_ENABLED');
        Configuration::deleteByName('PSMX_CONFETTI_COUNT');

        return parent::uninstall();
    }

    public function getContent()
    {
        $output = '';

        // Procesar el formulario si se envía
        if (Tools::isSubmit('submitPSMXChristmas')) {
            Configuration::updateValue('PSMX_LIGHTS_ENABLED', (int)Tools::getValue('PSMX_LIGHTS_ENABLED'));
            Configuration::updateValue('PSMX_LIGHTS_COUNT', (int)Tools::getValue('PSMX_LIGHTS_COUNT'));
            Configuration::updateValue('PSMX_LIGHTS_SHOW_CABLE', (int)Tools::getValue('PSMX_LIGHTS_SHOW_CABLE'));
            Configuration::updateValue('PSMX_SNOW_ENABLED', (int)Tools::getValue('PSMX_SNOW_ENABLED'));
            Configuration::updateValue('PSMX_SNOW_TYPE', pSQL(Tools::getValue('PSMX_SNOW_TYPE')));
            Configuration::updateValue('PSMX_SNOW_COUNT', (int)Tools::getValue('PSMX_SNOW_COUNT'));
            Configuration::updateValue('PSMX_SNOW_SPEED', (float)Tools::getValue('PSMX_SNOW_SPEED'));
            Configuration::updateValue('PSMX_SNOW_SIZE', pSQL(Tools::getValue('PSMX_SNOW_SIZE')));
            Configuration::updateValue('PSMX_STARS_ENABLED', (int)Tools::getValue('PSMX_STARS_ENABLED'));
            Configuration::updateValue('PSMX_STARS_COUNT', (int)Tools::getValue('PSMX_STARS_COUNT'));
            Configuration::updateValue('PSMX_CONFETTI_ENABLED', (int)Tools::getValue('PSMX_CONFETTI_ENABLED'));
            Configuration::updateValue('PSMX_CONFETTI_COUNT', (int)Tools::getValue('PSMX_CONFETTI_COUNT'));

            $output .= $this->displayConfirmation($this->l('Configuración guardada correctamente'));
        }

        return $output.$this->renderForm();
    }

    protected function renderForm()
    {
        $fields_form = array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Configuración de Decoraciones Navideñas'),
                    'icon' => 'icon-cogs'
                ),
                'input' => array(
                    // LUCES
                    array(
                        'type' => 'html',
                        'name' => '',
                        'html_content' => '<h4 style="margin-top:20px;">💡 Luces Navideñas</h4><hr>'
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Activar luces'),
                        'name' => 'PSMX_LIGHTS_ENABLED',
                        'is_bool' => true,
                        'values' => array(
                            array('id' => 'active_on', 'value' => 1, 'label' => $this->l('Sí')),
                            array('id' => 'active_off', 'value' => 0, 'label' => $this->l('No'))
                        )
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Cantidad de luces'),
                        'name' => 'PSMX_LIGHTS_COUNT',
                        'suffix' => 'luces',
                        'desc' => $this->l('Entre 10 y 50 luces')
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Mostrar cable'),
                        'name' => 'PSMX_LIGHTS_SHOW_CABLE',
                        'is_bool' => true,
                        'values' => array(
                            array('id' => 'cable_on', 'value' => 1, 'label' => $this->l('Sí')),
                            array('id' => 'cable_off', 'value' => 0, 'label' => $this->l('No'))
                        )
                    ),

                    // NIEVE
                    array(
                        'type' => 'html',
                        'name' => '',
                        'html_content' => '<h4 style="margin-top:30px;">❄️ Nieve</h4><hr>'
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Activar nieve'),
                        'name' => 'PSMX_SNOW_ENABLED',
                        'is_bool' => true,
                        'values' => array(
                            array('id' => 'snow_on', 'value' => 1, 'label' => $this->l('Sí')),
                            array('id' => 'snow_off', 'value' => 0, 'label' => $this->l('No'))
                        )
                    ),
                    array(
                        'type' => 'select',
                        'label' => $this->l('Tipo de copo'),
                        'name' => 'PSMX_SNOW_TYPE',
                        'options' => array(
                            'query' => array(
                                array('id' => 'classic', 'name' => $this->l('Clásica')),
                                array('id' => 'stars', 'name' => $this->l('Estrellas')),
                                array('id' => 'mixed', 'name' => $this->l('Mixta'))
                            ),
                            'id' => 'id',
                            'name' => 'name'
                        )
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Cantidad de copos'),
                        'name' => 'PSMX_SNOW_COUNT',
                        'suffix' => 'copos',
                        'desc' => $this->l('Entre 10 y 150 copos')
                    ),
                    array(
                        'type' => 'select',
                        'label' => $this->l('Velocidad'),
                        'name' => 'PSMX_SNOW_SPEED',
                        'options' => array(
                            'query' => array(
                                array('id' => '0.5', 'name' => '0.5x (Muy lenta)'),
                                array('id' => '1', 'name' => '1x (Normal)'),
                                array('id' => '1.5', 'name' => '1.5x (Rápida)'),
                                array('id' => '2', 'name' => '2x (Muy rápida)'),
                                array('id' => '3', 'name' => '3x (Ultra rápida)')
                            ),
                            'id' => 'id',
                            'name' => 'name'
                        )
                    ),
                    array(
                        'type' => 'select',
                        'label' => $this->l('Tamaño'),
                        'name' => 'PSMX_SNOW_SIZE',
                        'options' => array(
                            'query' => array(
                                array('id' => 'small', 'name' => $this->l('Pequeño')),
                                array('id' => 'medium', 'name' => $this->l('Mediano')),
                                array('id' => 'large', 'name' => $this->l('Grande'))
                            ),
                            'id' => 'id',
                            'name' => 'name'
                        )
                    ),

                    // ESTRELLAS
                    array(
                        'type' => 'html',
                        'name' => '',
                        'html_content' => '<h4 style="margin-top:30px;">⭐ Estrellas Brillantes</h4><hr>'
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Activar estrellas'),
                        'name' => 'PSMX_STARS_ENABLED',
                        'is_bool' => true,
                        'values' => array(
                            array('id' => 'stars_on', 'value' => 1, 'label' => $this->l('Sí')),
                            array('id' => 'stars_off', 'value' => 0, 'label' => $this->l('No'))
                        )
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Cantidad de estrellas'),
                        'name' => 'PSMX_STARS_COUNT',
                        'suffix' => 'estrellas',
                        'desc' => $this->l('Entre 5 y 50 estrellas')
                    ),

                    // CONFETI
                    array(
                        'type' => 'html',
                        'name' => '',
                        'html_content' => '<h4 style="margin-top:30px;">🎊 Confeti Navideño</h4><hr>'
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Activar confeti'),
                        'name' => 'PSMX_CONFETTI_ENABLED',
                        'is_bool' => true,
                        'values' => array(
                            array('id' => 'confetti_on', 'value' => 1, 'label' => $this->l('Sí')),
                            array('id' => 'confetti_off', 'value' => 0, 'label' => $this->l('No'))
                        )
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Cantidad de confeti'),
                        'name' => 'PSMX_CONFETTI_COUNT',
                        'suffix' => 'piezas',
                        'desc' => $this->l('Entre 10 y 100 piezas')
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Guardar'),
                    'class' => 'btn btn-default pull-right'
                )
            )
        );

        $helper = new HelperForm();
        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);
        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitPSMXChristmas';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getConfigFormValues(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm(array($fields_form));
    }

    protected function getConfigFormValues()
    {
        return array(
            'PSMX_LIGHTS_ENABLED' => Configuration::get('PSMX_LIGHTS_ENABLED', true),
            'PSMX_LIGHTS_COUNT' => Configuration::get('PSMX_LIGHTS_COUNT', 20),
            'PSMX_LIGHTS_SHOW_CABLE' => Configuration::get('PSMX_LIGHTS_SHOW_CABLE', true),
            'PSMX_SNOW_ENABLED' => Configuration::get('PSMX_SNOW_ENABLED', true),
            'PSMX_SNOW_TYPE' => Configuration::get('PSMX_SNOW_TYPE', 'classic'),
            'PSMX_SNOW_COUNT' => Configuration::get('PSMX_SNOW_COUNT', 50),
            'PSMX_SNOW_SPEED' => Configuration::get('PSMX_SNOW_SPEED', 1),
            'PSMX_SNOW_SIZE' => Configuration::get('PSMX_SNOW_SIZE', 'medium'),
            'PSMX_STARS_ENABLED' => Configuration::get('PSMX_STARS_ENABLED', true),
            'PSMX_STARS_COUNT' => Configuration::get('PSMX_STARS_COUNT', 20),
            'PSMX_CONFETTI_ENABLED' => Configuration::get('PSMX_CONFETTI_ENABLED', false),
            'PSMX_CONFETTI_COUNT' => Configuration::get('PSMX_CONFETTI_COUNT', 30),
        );
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

        // Pasar configuración de PHP a JavaScript
        $config = array(
            'lights' => array(
                'enabled' => (bool)Configuration::get('PSMX_LIGHTS_ENABLED', true),
                'count' => (int)Configuration::get('PSMX_LIGHTS_COUNT', 20),
                'showCable' => (bool)Configuration::get('PSMX_LIGHTS_SHOW_CABLE', true),
            ),
            'snow' => array(
                'enabled' => (bool)Configuration::get('PSMX_SNOW_ENABLED', true),
                'type' => Configuration::get('PSMX_SNOW_TYPE', 'classic'),
                'count' => (int)Configuration::get('PSMX_SNOW_COUNT', 50),
                'speed' => (float)Configuration::get('PSMX_SNOW_SPEED', 1),
                'size' => Configuration::get('PSMX_SNOW_SIZE', 'medium'),
            ),
            'stars' => array(
                'enabled' => (bool)Configuration::get('PSMX_STARS_ENABLED', true),
                'count' => (int)Configuration::get('PSMX_STARS_COUNT', 20),
            ),
            'confetti' => array(
                'enabled' => (bool)Configuration::get('PSMX_CONFETTI_ENABLED', false),
                'count' => (int)Configuration::get('PSMX_CONFETTI_COUNT', 30),
            ),
        );

        Media::addJsDef(array(
            'psmxChristmasConfig' => $config
        ));
    }

    public function hookDisplayHome($params)
    {
        // Las decoraciones se cargan automáticamente via JS
        return '';
    }
}
