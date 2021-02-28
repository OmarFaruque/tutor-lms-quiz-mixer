<?php

if (!defined('ABSPATH')) {
    exit;
}

class ACOTRS_Public
{

    /**
     * @var    object
     * @access  private
     * @since    1.0.0
     */
    private static $instance = null;

    /**
     * The version number.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $version;

    /**
     * The main plugin file.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $file;

    /**
     * The token.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $token;

    /**
     * The plugin assets URL.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_url;

    /**
     * Constructor function.
     *
     * @access  public
     * @param string $file Plugin root file path.
     * @since   1.0.0
     */
    public function __construct($file = '')
    {
        $this->version = ACOTRS_VERSION;
        $this->token = ACOTRS_TOKEN;
        $this->file = $file;
        $this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));
        // Load frontend CSS.
        add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_styles'), 10);

        add_action('init', array($this, 'init'));
    }

    /** Handle Post Typ registration all here
     */
    public function init()
    {

    }

    /**
     * Ensures only one instance of APIFW_Front_End is loaded or can be loaded.
     *
     * @param string $file Plugin root file path.
     * @return Main APIFW_Front_End instance
     * @since 1.0.0
     * @static
     */
    public static function instance($file = '')
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }

    /**
     * Load Front End CSS.
     *
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function frontend_enqueue_styles()
    {
        wp_register_style($this->token . '-frontend', esc_url($this->assets_url) . 'css/frontend.css', array(), $this->version);
        wp_enqueue_style($this->token . '-frontend');
    }


}
