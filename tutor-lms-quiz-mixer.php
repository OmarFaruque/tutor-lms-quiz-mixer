<?php

/**
 * Plugin Name: Tutor LMS Quiz Mixer
 * Version: 1.0.0
 * Description: Quiz mixer for Tutor LMS. Make a new quiz using old quiz or quiz category. 
 * Author: LaraSoft
 * Author URI: https://larasoftbd.net/
 * Requires at least: 4.4.0
 * Tested up to: 5.5.3
 * Text Domain: tutor-lms-quiz-mixer
 * Tutor LMS pro Require
 * Tutor LMS requird up to : 1.8.3
 */

define('TLQM_TOKEN', 'tlqm');
define('TLQM_VERSION', '1.0.0');
define('TLQM_FILE', __FILE__);
define('TLQM_PLUGIN_NAME', 'Tutor LMS Quiz Mixer');


// Helpers.
require_once realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes/helpers.php';

// Init.
add_action('plugins_loaded', 'tlqm_init');
if (!function_exists('tlqm_init')) {
    /**
     * Load plugin text domain
     *
     * @return  void
     */
    function tlqm_init()
    {
        $plugin_rel_path = basename(dirname(__FILE__)) . '/languages'; /* Relative to WP_PLUGIN_DIR */
        load_plugin_textdomain('tutor-lms-quiz-mixer', false, $plugin_rel_path);
    }
}

// Loading Classes.
if (!function_exists('tlqm_autoloader')) {

    function tlqm_autoloader($class_name)
    {
        if (0 === strpos($class_name, 'TLQM')) {
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = 'class-' . str_replace('_', '-', strtolower($class_name)) . '.php';
            require_once $classes_dir . $class_file;
        }
    }
}
spl_autoload_register('tlqm_autoloader');

// Backend UI.
if (!function_exists('TLQM_Backend')) {

    function TLQM_Backend()
    {
        return TLQM_Backend::instance(__FILE__);
    }
}


if (is_admin()) {
    TLQM_Backend();
}
new TLQM_Api();
