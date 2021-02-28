import React from "react";
import style from './General.scss'

import TextInput from "../components/TextInput";

const { __ } = window.wp.i18n;

export default function General(props) {

    const {config} = props;
    const {general} = config;
    const {title} = general;
    return (<div className={style.test_class}>
        <label>{__('Text Label','tutor-lms-quiz-mixer')}</label>
        <TextInput type="text" value={title} onChange={(value) => {

        }}/>
    </div>)

}


