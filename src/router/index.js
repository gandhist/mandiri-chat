import React from 'react'
import { Route, Switch, Redirect } from 'react-router';
import App from '../App';
import { Login, Chat } from "../pages";
import useToken from '../utils/useToken';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const { token } = useToken()
    let isLogin = token === undefined ? false : true;
    return (
        <Route
            {...rest}
            render={() =>
                isLogin ? (
                    children
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" >
                <App />
            </Route>
            <Route path="/login" >
                <Login />
            </Route>
            <PrivateRoute path="/chat">
                <Chat />
            </PrivateRoute>
            {/* <Route path="/chat" >
                <Chat />
            </Route> */}
        </Switch>
    )
}

export default Routes



