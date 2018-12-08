import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyA2OW25gQEoEuP7BO7wmZFW8d0imgAd4kM",
    authDomain: "feedthecity-90684.firebaseapp.com",
    databaseURL: "https://feedthecity-90684.firebaseio.com",
    projectId: "feedthecity-90684",
    storageBucket: "feedthecity-90684.appspot.com",
    messagingSenderId: "567026437838"
};
firebase.initializeApp(config);


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
