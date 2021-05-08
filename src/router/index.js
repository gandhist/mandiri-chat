import React from 'react'
import { Route, Switch } from 'react-router';
import App from '../App';
import { Login, Chat } from "../pages";


const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" >
                <App/>
            </Route>
            <Route path="/login" >
                <Login/>
            </Route>
            <Route path="/chat" >
                <Chat/>
            </Route>
        </Switch>
    )
}

export default Routes



