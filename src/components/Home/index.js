import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { FirebaseContext } from '../Firebase';


import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';


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
      restaurantsCoordinates: [],
      shelters: [],
      sheltersCoordinates: [],
      selectedOption: null,
      submitRestaurant: false
    }
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }


  componentDidMount() {
    this.setState({ loading: true });

    navigator.geolocation.getCurrentPosition((position) => {
      this.props.firebase.restaurants().on('value', snapshot1 => {
        let restaurantBounds = [];
        let shelterBounds = [];
        Object.keys(snapshot1.val()).map(key => {
          restaurantBounds.push({
            lat: snapshot1.val()[key].coordinates.latitude,
            lng: snapshot1.val()[key].coordinates.longitude
          })
          this.props.firebase.shelters().on('value', snapshot2 => {
            Object.keys(snapshot2.val()).map(key => {
              shelterBounds.push({
                lat: snapshot2.val()[key]['Coordinates']['Latitude'],
                lng: snapshot2.val()[key]['Coordinates']['Longitude']
              })
            })
            this.setState({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              loading: false,
              restaurants: snapshot1.val(),
              restaurantsCoordinates: restaurantBounds,
              shelters: snapshot2.val(),
              sheltersCoordinates: shelterBounds
            });
          })
        })
      })
    })
  };


  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
    console.log(changeEvent.target.value)
  }


  onSubmit = event => {
    this.setState({
      submitRestaurant: true
    });
  }


  render() {
    return (
      <div>
        {this.state.loading && <div>Loading ...</div>}
        {!this.state.loading && !this.state.submitRestaurant && < div style={{ height: '100%', width: '50%', float: 'left' }}>
          <div>
            <strong>List of restaurants near you:</strong>
          </div>
          <form onSubmit={this.onSubmit}>
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
        {
          !this.state.loading && !this.state.submitRestaurant && <GoogleApiRestaurant bounds={this.state.bounds} lat={this.state.lat} lon={this.state.lon} />
        }
      </div >
    )
  }
}


class GoogleMapRestaurant extends Component {

  constructor(props) {
    let bounds = new props.google.maps.LatLngBounds();
    for (let i = 0; i < props.coordinates; i++) {
      bounds.extend(props.coordinates[i]);
    }
    super(props)
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      bounds: bounds
    };
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <div style={{ height: '100vh', width: '50%', float: "right" }}>
        <Map
          google={this.props.google}
          style={
            {
              width: '50%',
              height: '100vh'
            }
          }
          initialCenter={{
            lat: this.props.lat,
            lng: this.props.lon
          }}
          bounds={this.state.bounds}
        >
          < Marker
            onClick={this.onMarkerClick}
            name={'Current Location'}
            position={{ lat: this.props.lat, lng: this.props.lon }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h6>{this.state.selectedPlace.name}</h6>
            </div>
          </InfoWindow>
        </Map>
      </div>
    )
  }
}


const GoogleApiRestaurant = GoogleApiWrapper(
  {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
  })(GoogleMapRestaurant)

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