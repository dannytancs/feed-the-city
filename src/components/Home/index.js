import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { FirebaseContext } from '../Firebase';


import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


// class Shelter extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (

//     ) 
//   }
// }

class HomePageBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lon: null,
      loading: true,
      restaurants: [],
      shelters: [],
      selectedOption: null
    }
    this.handleOptionChange = this.handleOptionChange.bind(this);
    console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  }


  componentDidMount() {
    this.setState({ loading: true });

    navigator.geolocation.getCurrentPosition((position) => {
      this.props.firebase.restaurants().on('value', snapshot => {
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          zoom: 14,
          loading: false,
          restaurants: snapshot.val()
        });
        console.log(this.state.restaurants);
      });
    });
  }


  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
    console.log(changeEvent.target.value)
  }



  render() {
    return (
      <div>
        {this.state.loading && <div>Loading ...</div>}
        {!this.state.loading && <div style={{ height: '100%', width: '50%', float: 'left' }}>
          <div>
            List of restaurants near you:
          </div>

          <form>
            {Object.keys(this.state.restaurants).map(key => (

              <div className="radio" key={key}>
                <label>
                  <input type="radio" value={key} checked={this.state.selectedOption === key} onChange={this.handleOptionChange} />
                  <div>
                    <strong>Name:</strong> {this.state.restaurants[key].name}
                  </div>
                  <div>
                    <strong>Address:</strong> {this.state.restaurants[key].address}
                  </div>
                  <div>
                    <strong>Phone:</strong> {this.state.restaurants[key].phone}
                  </div>

                </label>
              </div>
            ))}

            <button className="btn btn-primary" style={{ right: "52%", position: "absolute", top: "13%" }} type="submit">
              Select
                </button>

          </form>
        </div>
        }


        {!this.state.loading && <GoogleMap center={this.state.center} zoom = {this.state.zoom} lat = {this.lat} lon = {this.lon} />
        }
      </div>
    )
  }
}


class GoogleMap extends Component {
  
  render() {
    return (
      <div style={{ height: '100vh', width: '50%', float: "right" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      >
        <AnyReactComponent
          lat={this.props.lat}
          lng={this.props.lon}
          text={'Current Location'}
        />
      </GoogleMapReact>
    </div>
    )
  }
}

const HomePage = () => (
  <FirebaseContext.Consumer>
    {firebase =>
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <HomePageBase uid={authUser.uid} firebase={firebase} />
          </div>
        )}
      </AuthUserContext.Consumer>
    }
  </FirebaseContext.Consumer>
);



const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);