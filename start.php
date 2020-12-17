<?php

/**
 * Plugin Name: Acowebs Table Rate Shipping Free
 * Version: 1.0.0
 * Description: Plugin  short description
 * Author: Acowebs
 * Author URI: http://acowebs.com
 * Requires at least: 4.4.0
 * Tested up to: 5.5.3
 * Text Domain: acowebs-tabel-rate-shipping
 * WC requires at least: 3.0.0
 * WC tested up to: 4.7.0
 */

define('ACOTRS_TOKEN', 'acotrs');
define('ACOTRS_VERSION', '1.0.0');
define('ACOTRS_FILE', __FILE__);
define('ACOTRS_PLUGIN_NAME', 'Acowebs Table Rate Shipping Free');

// Helpers.
require_once realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes/helpers.php';

// Init.
add_action('plugins_loaded', 'acotrs_init');
if (!function_exists('acotrs_init')) {
    /**
     * Load plugin text domain
     *
     * @return  void
     */
    function acotrs_init()
    {
        $plugin_rel_path = basename(dirname(__FILE__)) . '/languages'; /* Relative to WP_PLUGIN_DIR */
        load_plugin_textdomain('acowebs-tabel-rate-shipping', false, $plugin_rel_path);
    }
}

// Loading Classes.
if (!function_exists('ACOTRS_autoloader')) {

    function ACOTRS_autoloader($class_name)
    {
        if (0 === strpos($class_name, 'ACOTRS')) {
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = 'class-' . str_replace('_', '-', strtolower($class_name)) . '.php';
            require_once $classes_dir . $class_file;
        }
    }
}
spl_autoload_register('ACOTRS_autoloader');

// Backend UI.
if (!function_exists('ACOTRS_Backend')) {
    function ACOTRS_Backend()
    {
        return ACOTRS_Backend::instance(__FILE__);
    }
}
if (!function_exists('ACOTRS_Public')) {
    function ACOTRS_Public()
    {
        return ACOTRS_Public::instance(__FILE__);
    }
}
// Front end.
ACOTRS_Public();
if (is_admin()) {
    ACOTRS_Backend();
}
new ACOTRS_Api();
