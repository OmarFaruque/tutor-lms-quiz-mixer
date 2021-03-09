<?php

if (!defined('ABSPATH')) {
    exit;
}

class TLQM_Api
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
    public $version;
    /**
     * The token.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public string $token;

    /**
     * db connection
     */
    public $wpdb;

    /**
     * Table Prefix
     */
    public $prefix;

    public function __construct()
    {
        global $wpdb;
        $this->token = TLQM_TOKEN;
        $this->wpdb = $wpdb;
        $this->prefix = $this->wpdb->prefix;


        // add_action('wp_head', array($this, 'tlqm_tutorlms_quizes'));

        add_action(
            'rest_api_init',
            function () {
                register_rest_route(
                    $this->token . '/v1',
                    '/config/',
                    array(
                        'methods' => 'GET',
                        'callback' => array($this, 'getConfig'),
                        'permission_callback' => array($this, 'getPermission'),
                    )
                );
            }
        );
    }



    /**
     * Quizes
     * @param NULL
     */
    public function tlqm_tutorlms_quizes(){
        $qry = $this->wpdb->prepare( 'SELECT p.`ID`, p.`post_title`, t.`post_title` as `topix_title` FROM '.$this->prefix.'posts p LEFT JOIN '.$this->prefix.'posts t ON p.`post_parent`=t.`ID` WHERE p.`post_type`=%s ORDER BY p.`post_parent`', 'tutor_quiz');
        $quizes = $this->wpdb->get_results($qry, OBJECT);

        $object = array();
        foreach($quizes as $s){
            $object[$s->ID] = $s->post_title . ' (' . $s->topix_title . ')';
        }
        return $object;
    }

    public function getConfig()
    {
        $config = array(
            'quizes' => $this->tlqm_tutorlms_quizes()
        );

        return new WP_REST_Response($config, 200);
    }

    /**
     *
     * Ensures only one instance of APIFW is loaded or can be loaded.
     *
     * @param string $file Plugin root path.
     * @return Main APIFW instance
     * @see WordPress_Plugin_Template()
     * @since 1.0.0
     * @static
     */
    public static function instance()
    {
        if (is_null(self::$instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Permission Callback
     **/
    public function getPermission()
    {
        if (current_user_can('administrator') || current_user_can('manage_woocommerce')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Cloning is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }

    /**
     * Unserializing instances of this class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }
}
