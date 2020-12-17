import React from "react";
import style from './Page2.scss'


class Page2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        }

    }

    render() {
        return (<div className={style.test_class}>
            Test
        </div>)
    }
}


export default Page2;
