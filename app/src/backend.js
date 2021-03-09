import React from "react";
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom";
import TextInput from './components/TextInput'

import FetchWP from './utils/fetchWP';

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
                onChange={props.handleInputChange}
                name="quiz"
                value=""
            />
        </div>

        {/* Counter  */}
        <div>
            <TextInput 
                type="number"
                name="quiz_number"
                onChange={props.handleInputChange}
                value=""
                min={1}
            />
        </div>

        {/* Action */}
        <div className={style.icon}>
            <div>
                <span onClick={props.addNew} class="dashicons dashicons-plus-alt2"></span>
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
     * Handle all input change event
     */
    handleInputChange = (e) => {
        
        
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
                    console.log('config: ', json);
                    this.setState({
                        loader: false,
                        config: json,
                    });
                });


    }

    render() {
        const {config, temp_quizes} = this.state;
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
                                                <div className={style.row}>
                                                    <SingleRow index={v} handleInputChange={this.handleInputChange} config={config} addNew={this.addNewRow} />
                                                </div>
                                            </>
                                        )
                                    })
                            }
                            
                    </div>
                </div>
            </div>
        )
    }

}


if (document.getElementById("tlqm_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("tlqm_ui_root"));
}

