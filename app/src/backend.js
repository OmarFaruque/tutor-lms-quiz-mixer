import React from "react";
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom";

import FetchWP from './utils/fetchWP';

import style from './backend.scss';
const { __ } = window.wp.i18n;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }
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


    fetchData() {
        this.setState({
            loader: true,
        });

        this.fetchWP.get('config/')
            .then(
                (json) => {
                    this.setState({
                        loader: false,
                        config: json,
                    });
                });


    }

    render() {
        const {config} = this.state;
        return (
            <div className={style.tlqmWrap}>
                <div>
                    <h2>{__('Tutor LMS Quiz Mixer', 'tutor-lms-quiz-mixer') }</h2>
                    <div className={style.formWrap}>
                        <div className={style.row}>
                            {/* Label */}
                            <div>
                                {__('Select Quizzes', 'tutor-lms-quiz-mixer')}
                            </div>

                            {/* Quz selector */}
                            <div>
                                
                            </div>

                            {/* Counter  */}
                            <div></div>

                            {/* Action */}
                            <div></div>
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

