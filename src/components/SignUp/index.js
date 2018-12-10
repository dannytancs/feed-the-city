import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>Sign Up</h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    passwordOne: '',
    passwordTwo: '',
    name: '',
    cellphone: '',
    error: null,
    points: 0
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { cellphone, name, email, passwordOne, points } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne).then(authUser => {
                // Create a user in your Firebase realtime database
                console.log(authUser);
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        name: name,
                        email: email,
                        cellphone: cellphone,
                        points: points
                    });
            })
            .then(() => {
                this.setState({ error: { code: 'verifyEmail', message: 'A confirmation link is sent to your NYU email' } });
                this.props.firebase.sendEmailVerification();
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            email,
            name,
            cellphone,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid = () => {
            const invalidCellphone = cellphone.length !== 10;
            const invalidPass = passwordOne !== passwordTwo || passwordOne === '';
            const invalidName = name === '';
            let invalidEmail = email.split('@');
            if (invalidEmail.length === 2 && invalidEmail[1] === "nyu.edu") {
                invalidEmail = false;
            }
            else {
                invalidEmail = true;
            }

            return invalidPass || invalidName || invalidEmail || invalidCellphone;
        }

        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">NYU Email address</label>
                    <input
                        className="form-control"
                        aria-describedby="emailHelp"
                        id="email"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="email"
                        placeholder="NYU Email Address"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        className="form-control"
                        id="name"
                        name="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Full Name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cellphone">Cellphone</label>
                    <input
                        className="form-control"
                        id="cellphone"
                        name="cellphone"
                        value={cellphone}
                        onChange={this.onChange}
                        type="tel"
                        placeholder="8008888888"
                    />
                </div>



                <div className="form-group">
                    <label htmlFor="passwordOne">Password</label>
                    <input
                        className="form-control"
                        id="passwordOne"
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                </div>



                <div className="form-group">
                    <label htmlFor="passwordTwo">Password</label>
                    <input
                        className="form-control"
                        id="passwordTwo"
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </div>


                <button disabled={isInvalid()} className="btn btn-primary" type="submit">
                    Sign Up
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Register a new account <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };