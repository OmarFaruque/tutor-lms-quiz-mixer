import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import style from './style.scss';

export default class QuizModal extends Component {
    render() {
        return (
            <div>
                <Modal visible={1} width="900" height="370" effect="fadeInLeft" onClickAway={this.props.modalHandler}>
                                                                   <div className={style.quizWrap}>
                                                                        <p>Content</p>
                                                                         
                                                                         <a className={style.closeBtn} href="#" onClick={this.props.modalHandler}>
                                                                            <span>
                                                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                                                </svg>
                                                                            </span>
                                                                        </a>
                                                                   </div>
                </Modal>
            </div>
        )
    }
}
