import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Switch } from 'react-router';

import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';


class Landing extends Component {
    render() {
        return (
            <Switch>
                <AuthUserContext.Consumer>
                    {authUser =>
                        authUser && authUser.emailVerified ? <Redirect to={ROUTES.HOME} /> :  <Redirect to={ROUTES.SIGN_IN} />
                    }
                </AuthUserContext.Consumer>
            </Switch>
        )
    }
}


export default Landing;