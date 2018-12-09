import React, { Component } from 'react';
import { FirebaseContext } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';


class AccountPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: {},
      uid: this.props.uid
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.user(this.state.uid).on('value', snapshot => {
      this.setState({
        user: snapshot.val(),
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.state.uid).off();
  }

  render() {
    return (
      <div>
        <h4>Account Information:</h4>

        {this.state.loading && <div>Loading ...</div>}
        <div>
          Name: {this.state.user.name}
        </div>
        <div>
          Email: {this.state.user.email}
        </div>
        <div>
          Phone Number: {this.state.user.cellphone}
        </div>
        <div>
          Points: {this.state.user.points}
        </div>
      </div>
    );
  }
}



const AccountPage = () => (

  <FirebaseContext.Consumer>
    {firebase =>
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <AccountPageBase uid={authUser.uid} firebase={firebase} />
          </div>
        )}
      </AuthUserContext.Consumer>
    }
  </FirebaseContext.Consumer>

);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
