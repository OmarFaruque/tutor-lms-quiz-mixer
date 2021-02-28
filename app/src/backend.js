import React from "react";
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom";

import FetchWP from './utils/fetchWP';

import General from "./pages/General";

import Page2 from "./pages/Page2";

import Tabs from "./components/Tabs";


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
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,

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
            <div>
                <HashRouter>
                    <Tabs/>
                    <Switch>
                        <Route
                            path="/"
                            exact
                            render={props =>
                                <General config={config} handleUpdate={this.handleUpdate}/>
                            }
                        />
                        <Route
                            exact
                            path="/page2"
                            render={props =>
                                <Page2/>
                            }
                        />
                    </Switch>
                </HashRouter>


            </div>
        )
    }

}


if (document.getElementById("acotrs_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("acotrs_ui_root"));
}

