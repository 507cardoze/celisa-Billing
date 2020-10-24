import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {SubcriberRefreshToken} from "../../helpers/fetch"

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <SubcriberRefreshToken>
    <Route {...rest} render={props => (
        localStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
    </SubcriberRefreshToken>
)