import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser && authUser.emailVerified ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div className="navBar">
    <span>  <Link to={ROUTES.HOME}>
      <button type="button" className="btn btn-primary">
        Home
      </button>
    </Link> </span>
    <span> <Link to={ROUTES.ACCOUNT}>
      <button type="button" className="btn btn-primary">
        My Account
      </button></Link> </span>
    <span>  <SignOutButton /> </span>
  </div>
);

const NavigationNonAuth = () => (
  <Link to={ROUTES.SIGN_IN}><button type="button" className="btn btn-primary">
    Sign In
</button></Link>
);

export default Navigation;