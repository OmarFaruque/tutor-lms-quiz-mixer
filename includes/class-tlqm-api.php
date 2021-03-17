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


        // add_action('wp_head', array($this, 'tlqmTopics'));

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

                /**Get Topics */
                register_rest_route(
                    $this->token . '/v1',
                    '/get_topics/',
                    array(
                        'methods' => 'POST',
                        'callback' => array($this, 'tlqmTopics'),
                        'permission_callback' => array($this, 'getPermission'),
                    )
                );


                /** Save Mixed Quizes */
                register_rest_route(
                    $this->token . '/v1',
                    '/save_mixed_quiz/',
                    array(
                        'methods' => 'POST',
                        'callback' => array($this, 'tlqm_save_mixed_quizes'),
                        'permission_callback' => array($this, 'getPermission'),
                    )
                );

            }
        );
    }



    /**
     * @param data as array
     * return success message
     */
    public function tlqm_save_mixed_quizes($data){
        /** Create New Course */
        if($data['newcourse'] && !empty($data['course'])){
            $course_id = wp_insert_post( 
                array(
                    'post_title' => $data['course'], 
                    'post_type' => 'courses', 
                    'post_status' => 'publish'
                )
            );

            /**Create New Topic for new created course */
            if($course_id){
                $topic_id = wp_insert_post( 
                    array(
                        'post_title' => $data['topic'], 
                        'post_type' => 'topics', 
                        'post_status' => 'publish', 
                        'post_parent' => $course_id, 
                    )
                );
                if($topic_id) $data['topic'] = $topic_id;
            }
        }

        $new_quiz_id = wp_insert_post( 
            array(
                'post_title' => !empty($data['quiz_title']) ? $data['quiz_title'] : __('New Quiz', 'tutor-lms-quiz-mixer'), 
                'post_type' => 'tutor_quiz',
                'post_status' => 'publish',
                'post_parent' => (int)$data['topic'], 
                'menu_order' => (int)$data['order']
            )
        ); 

        
        $newQuestions = array();
        if($new_quiz_id){
            foreach($data['quiz'] as $single){
                $qry = $this->wpdb->prepare( 'SELECT q.* FROM '.$this->prefix.'tutor_quiz_questions q WHERE q.`quiz_id`=%d ORDER BY RAND() LIMIT %d', (int)$single['quiz'], (int)$single['quiz_number'] );
                $results = $this->wpdb->get_results($qry, OBJECT);
                foreach($results as $s){
                    array_push($newQuestions, $s);
                    $insert = $this->wpdb->insert(
                        $this->prefix . 'tutor_quiz_questions', 
                        array(
                            'quiz_id' => $new_quiz_id, 
                            'question_title' => $s->question_title, 
                            'question_description' => $s->question_description, 
                            'question_type' => $s->question_type, 
                            'question_mark' => $s->question_mark, 
                            'question_settings' => $s->question_settings, 
                            'question_order' => $s->question_order
                        )  
                    );
                }
            }
        }

        

        $return = array(
            'quiz_id' => $new_quiz_id, 
            'newcourse' => $data['newcourse']
        );


        


        return new WP_REST_Response($return, 200);
    }

    /**
     * @param course id
     * Get course topics by course id
     *
     */
    public function tlqmTopics($data){
        $course_id = $data['course_id'];
        $qry = $this->wpdb->prepare( 'SELECT p.`ID`, p.`post_title` FROM '.$this->prefix.'posts p WHERE p.`post_type`=%s AND p.`post_parent`=%s ORDER BY p.`post_parent`', 'topics', $course_id);
        $topics = $this->wpdb->get_results($qry, OBJECT);
        $newTopics = array();
        foreach($topics as $single) $newTopics[$single->ID] = $single->post_title;
        
        return new WP_REST_Response($newTopics, 200);
    }


    /**
     * @param NULL
     * return all course
     */
    public function tlqm_get_all_courses(){
        $courses = get_posts(
                array(
                    'post_type' => 'courses', 
                    'post_status' => 'publish', 
                    'numberposts' => -1
                )
            );

        $nCourses = array();
        foreach($courses as $s) $nCourses[$s->ID] = $s->post_title;
        return $nCourses;
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

    /**
     * Get All Topics
     * @param NULL
     */
    public function tlqm_tutorlms_topics(){

    }

    public function getConfig()
    {
        $config = array(
            'quizes' => $this->tlqm_tutorlms_quizes(), 
            'courses' => $this->tlqm_get_all_courses(), 
            'topics' => $this->tlqmTopics(array('course_id' => end(array_keys($this->tlqm_get_all_courses() ))))
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
