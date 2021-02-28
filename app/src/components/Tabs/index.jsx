import React from 'react'
import {NavLink, withRouter} from "react-router-dom";
import style from './style.scss'

const Tabs = (props) => {

    return (
        <div className={style.wrap}>
            <ul>
                <li>
                    <NavLink exact activeClassName={style.active} to="/">General</NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName={style.active} to="/page2">Page2 </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Tabs);
