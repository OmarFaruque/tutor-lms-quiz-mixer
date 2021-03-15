import React from "react";
import {HashRouter, Route} from 'react-router-dom'
import ReactDOM from "react-dom";
import TextInput from './components/TextInput';
import { Button, IconButton, Switch } from '@material-ui/core';
import FetchWP from './utils/fetchWP';
import QuizModal from './components/QuizModal';

import style from './backend.scss';
const { __ } = window.wp.i18n;


const SingleRow = (props) => {
    return(
        <>
        <div>
            {
                (() => {
                    if(props.index <= 0){
                        return(
                            <>
                                    {__('Select Quizzes', 'tutor-lms-quiz-mixer')}
                            </>
                        )
                    }
                })()
            }
        </div>

        {/* Quz selector */}
        <div>
            <TextInput
                type="select"
                options={props.config.quizes}
                onChange={(e) => props.handleInputChange(e, props.index)}
                name="quiz"
                value=""
            />
        </div>

        {/* Counter  */}
        <div>
            <TextInput 
                type="number"
                name="quiz_number"
                onChange={(e) => props.handleInputChange(e, props.index)}
                value={props.item.quiz_number}
                min={1}
            />
        </div>

        {/* Action */}
        <div className={style.icon}>
            <div>
                <span onClick={props.addNew} className="dashicons dashicons-plus-alt2"></span>
            </div>
        </div>
        </>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            newcourse: false,
            temp_course: false,
            temp_topics: false,
            temp_select_topic: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }, 
            temp_quizes: [
                {
                    quiz_name: '', 
                    quiz_number: 1
                }
            ]
        }

        this.fetchWP = new FetchWP({
            restURL: window.tlqm_object.root,
            restNonce: window.tlqm_object.api_nonce,

        });

    }


    componentDidMount() {
        this.fetchData();

    }

    componentWillUnmount() {

    }

    handleUpdate(conf) {

        this.setState({conf});
    }

    SaveChanges = () => {

        const {config} = this.state;
        this.fetchWP.post('save', {'config': config}).then(json => {

        }).catch(error => {
            alert("Some thing went wrong");
        })
    }


    /**
     * 
     * @param {default event} e 
     * @param (index) number
     * Handle all input change event
     */
    handleInputChange = (e, index = false, type='', name='') => {
        

        const {temp_quizes} = this.state;

        if(index){
            temp_quizes[index][e.target.name] = e.target.value;
            this.setState(
                {
                    temp_quizes: temp_quizes
                }
            )
        }else{
            if(type == 'switch'){
                this.setState({
                    [name]: !this.state[name]? true : false
                })
            }
            else if(e.target.type == 'select-one' && e.target.name == 'temp_course'){
                let course_id = {
                    course_id: e.target.value
                }
                this.fetchWP.post('get_topics/', course_id)
                .then(
                    (json) => {
                        
                        this.setState({
                            [e.target.name]: e.target.value, 
                            temp_topics: json
                        })
                    })
    
            }
            else{
                this.setState({
                    [e.target.name]: e.target.value
                })
            }
        }
        
    }

    /**
     * 
     * @param {default event} e 
     * return add new rows
     */
    addNewRow = (e) => {
        const {temp_quizes} = this.state;
        const newObject = {
            quiz_name: '', 
            quiz_number: 1
        }
        temp_quizes.push(newObject)
        this.setState(
            {
                temp_quizes: temp_quizes
            }
        )
    }

    fetchData() {
        this.setState({
            loader: true,
        });

        this.fetchWP.get('config/')
            .then(
                (json) => {
                    console.log('json: ', json.topics.data);
                    this.setState({
                        loader: false,
                        config: json,
                        temp_course: Object.keys(json.courses)[0], 
                        temp_topics: json.topics.data
                    });
                });


    }


    /**
     * Fire Save & Next button 
     * & open quiz popup
     */
    saveNext =()=>{
        this.setState(
            {
                quizModal: !this.state.quizModal ? true : false
            }
        )
    }

    /**
     * 
     * @param {default event} e 
     * Quiz modal handler
     */
    modalHandler = (e) => {
        this.setState(
            {
                quizModal: !this.state.quizModal ? true : false
            }
        )
    }

    render() {
        const {config, temp_quizes, newcourse, temp_topics} = this.state;
        return (
            <div className={style.tlqmWrap}>
                <div>
                    <h2>{__('Tutor LMS Quiz Mixer', 'tutor-lms-quiz-mixer') }</h2>
                    <div className={style.formWrap}>
                            {/* Label */}

                            {
                                    temp_quizes.map((k, v) => {
                                        return(
                                            <>
                                                <div key={v} className={style.row}>
                                                    <SingleRow 
                                                        key={v} 
                                                        index={v} 
                                                        item={temp_quizes[v]} 
                                                        handleInputChange={this.handleInputChange} 
                                                        config={config} 
                                                        addNew={this.addNewRow} 
                                                    />
                                                </div>
                                            </>
                                        )
                                    })
                            }

                            {/* Course */}
                            <div className={style.row}>
                                <div>
                                    {
                                        this.state.newcourse ? __('Course Title', 'tutor-lms-quiz-mixer') : __('Search course', 'tutor-lms-quiz-mixer')
                                    }
                                   
                                </div>

                                {/* Course selector */}
                                <div>
                                    {
                                        this.state.newcourse 
                                        ? 
                                        <TextInput
                                            type="text"
                                            onChange={this.handleInputChange}
                                            name="temp_course"
                                            value={this.state.temp_course}
                                        />
                                        :
                                        <TextInput
                                            type="select"
                                            options={config.courses}
                                            onChange={this.handleInputChange}
                                            name="temp_course"
                                            value={this.state.temp_course}
                                        />
                                    }
                                </div>

                                {/* Counter  */}
                                <div>
                                    {__('New Course?', 'tutor-lms-quiz-mixer')}
                                </div>

                                {/* Action */}
                                <div className={style.switcher}>
                                    <div>
                                    {/* <Switch onChange={this.handleInputChange} checked={0} /> */}
                                    <Switch size="small" checked={this.state.newcourse} onClick={(e) => this.handleInputChange(e, false, 'switch', 'newcourse') } />
                                    </div>
                                </div>
                            </div>  


                            {/* Topics */}
                            <div className={style.row}>
                                <div>
                                   {__('Select Topic', 'tutor-lms-quiz-mixer')}
                                </div>

                                {/* Course selector */}
                                <div>
                                        <TextInput
                                            type="select"
                                            options={temp_topics}
                                            onChange={this.handleInputChange}
                                            name="temp_select_topic"
                                            value={this.state.temp_select_topic}
                                        />
                                </div>

                                {/* Counter  */}
                                <div>
                                    {__('Order', 'tutor-lms-quiz-mixer')}
                                </div>

                                {/* Action */}
                                <div className={style.switcher}>
                                    <div>
                                        <TextInput 
                                            type="number"
                                            name="topics_order"
                                            min={1}
                                            value={this.state.topics_order ? this.state.topics_order : 1}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>  
                            {/* End Topics */}

                            {/* Save Button */}
                            {/* <Button variant="contained" color="primary" onClick={(e) => this.saveNext}>
                                {__('Save & Next', 'tutor-lms-quiz-mixer')}
                            </Button> */}
                            <button className="open-tutor-quiz-modal button button-primary" data-quiz-id="76" data-topic-id="75">
                            {__('Save & Next', 'tutor-lms-quiz-mixer')}
                            </button>
                            {/* {
                                !this.state.quizModal 
                                ? 
                                <QuizModal modalHandler={this.modalHandler} /> 
                                : 
                                null
                            } */}
                            <div class="tutor-modal-wrap tutor-quiz-builder-modal-wrap show">
    <div class="tutor-modal-content">
        <div class="modal-header">
            <div class="modal-title">
                <h1>Quiz</h1>
            </div>
            <div class="modal-close-wrap">
                <a href="javascript:;" class="modal-close-btn"><i class="tutor-icon-line-cross"></i> </a>
            </div>
        </div>
        <div class="modal-container"></div>
    </div>
</div>
                    </div>
                </div>
            </div>
        )
    }

}


if (document.getElementById("tlqm_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("tlqm_ui_root"));
}

