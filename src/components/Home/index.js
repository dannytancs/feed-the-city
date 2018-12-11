import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { FirebaseContext } from '../Firebase';


import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


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
      chosenRestaurant: null,
      chosenShelter: null,
      submitRestaurant: false,
      submitShelter: false
    }
    this.handleOptionChangeRestaurant = this.handleOptionChangeRestaurant.bind(this);
    this.handleOptionChangeShelter = this.handleOptionChangeShelter.bind(this);
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


  handleOptionChangeRestaurant(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
      chosenRestaurant: changeEvent.target.value
    });
  }

  handleOptionChangeShelter(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
      chosenShelter: changeEvent.target.value
    });
  }


  onSubmit = event => {
    this.setState({
      submitRestaurant: true,
    });
  }

  onSubmitShelter = event => {
    this.setState({
      submitShelter: true
    })
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


              <label key={key} value={key}>
                <input type="radio" value={key} checked={this.state.selectedOption === key} onChange={this.handleOptionChangeRestaurant} />
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

            ))}

            <button className="btn btn-primary" style={{ right: "52%", position: "absolute", top: "13%" }} type="submit">
              Select
                </button>
          </form>
        </div>
        }
        {
          !this.state.loading && !this.state.submitRestaurant && <GoogleApiRestaurant restaurants={this.state.restaurants} bounds={this.state.restaurantBounds} lat={this.state.lat} lon={this.state.lon} />
        }



        {!this.state.loading && this.state.submitRestaurant && !this.state.submitShelter && < div style={{ height: '100%', width: '50%', float: 'left' }}>
          <div>
            <strong>List of shelters near you:</strong>
          </div>
          <form onSubmit={this.onSubmitShelter}>
            {Object.keys(this.state.shelters).map(key => (


              <label key={key} value={key}>
                <input type="radio" value={key} checked={this.state.selectedOption === key} onChange={this.handleOptionChangeShelter} />
                <div>
                  <strong>Name:</strong> {this.state.shelters[key].Name}
                </div>
                <div>
                  <strong>Address:</strong> {this.state.shelters[key].Address}
                </div>
                <div>
                  <strong>Phone:</strong> {this.state.shelters[key]['Phone Number']}
                </div>
              </label>

            ))}

            <button className="btn btn-primary" style={{ right: "52%", position: "absolute", top: "13%" }} type="submit">
              Select
                </button>
          </form>
        </div>
        }
        {
          !this.state.loading && this.state.submitRestaurant && !this.state.submitShelter && <GoogleApiShelter shelters={this.state.shelters} bounds={this.state.shelterBounds} lat={this.state.lat} lon={this.state.lon} />
        }

        {this.state.submitRestaurant && this.state.submitShelter && < div style={{ height: '100%', width: '50%', float: 'left' }}>
        <Results restaurantKey={this.state.chosenRestaurant} restaurants={this.state.restaurants} shelterKey={this.state.chosenShelter} shelters={this.state.shelters} />
        </div>
        }
        {
          this.state.submitRestaurant && this.state.submitShelter && <GoogleApiResult lat={this.state.lat} lon={this.state.lon} restaurantLat={this.state.restaurants[this.state.chosenRestaurant].coordinates.latitude} 
          restaurantLon={this.state.restaurants[this.state.chosenRestaurant].coordinates.longitude} 
          shelterLat={this.state.shelters[this.state.chosenShelter].Coordinates.Latitude}
          shelterLon={this.state.shelters[this.state.chosenShelter].Coordinates.Longitude}></GoogleApiResult>
        }

        
      </div >
    )
  }
}

class ResultGoogleMap extends Component {
  constructor(props) {
    let bounds = new props.google.maps.LatLngBounds();;
    bounds.extend({
      lat: props.lat, lng: props.lon
    })
    bounds.extend({
      lat: props.shelterLat, lng: props.shelterLon
    })
    bounds.extend({
      lat: props.restaurantLat, lng: props.restaurantLon
    })
    super(props)
    this.state = {
      bounds: bounds
    }
  }

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
            name={'Current Location'}
            position={{ lat: this.props.lat, lng: this.props.lon }}
          ></Marker>


          < Marker
            name={'Chosen Restaurant'}
            position={{ lat: this.props.restaurantLat, lng: this.props.restaurantLon }}
          ></Marker>

          < Marker
            name={'Chosen Shelter'}
            position={{ lat: this.props.shelterLat, lng: this.props.shelterLon }}
          ></Marker>
        </Map>
      </div>
    )
  }
}

class Results extends Component {
  render() {
    return (
      <div>
        <div>
          <strong>Chosen Restaurant:</strong>
          <div>
            Name: {this.props.restaurants[this.props.restaurantKey].name}
          </div>
          <div>
            Address: {this.props.restaurants[this.props.restaurantKey].address}
          </div>
          <div>
            Phone: {this.props.restaurants[this.props.restaurantKey].phone}
          </div>
        </div>
        <div>
          <strong>Chosen Shelter:</strong>
          <div>
            Name: {this.props.shelters[this.props.shelterKey].Name}
          </div>
          <div>
            Address: {this.props.shelters[this.props.shelterKey].Address}
          </div>
          <div>
            Phone: {this.props.shelters[this.props.shelterKey]['Phone Number']}
          </div>
        </div>
      </div>
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
      bounds: bounds
    };
  }


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
            name={'Current Location'}
            position={{ lat: this.props.lat, lng: this.props.lon }}
          ></Marker>

          {
            Object.keys(this.props.restaurants).map(key => (
              <Marker key = {key}
                name={this.props.restaurants[key].name}
                position={{ lat: this.props.restaurants[key].coordinates.latitude, lng: this.props.restaurants[key].coordinates.longitude }}
              ></Marker>
            ))
          }

        </Map>
      </div>
    )
  }
}



class GoogleMapShelter extends Component {

  constructor(props) {
    let bounds = new props.google.maps.LatLngBounds();
    for (let i = 0; i < props.coordinates; i++) {
      bounds.extend(props.coordinates[i]);
    }
    super(props)
    this.state = {
      bounds: bounds
    };
  }

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
            name={'Current Location'}
            position={{ lat: this.props.lat, lng: this.props.lon }}
          ></Marker>
          {
            Object.keys(this.props.shelters).map(key => (
              <Marker key={key}
                name={this.props.shelters[key].name}
                position={{ lat: this.props.shelters[key].Coordinates.Latitude, lng: this.props.shelters[key].Coordinates.Longitude }}
              ></Marker>
            ))
          }
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

const GoogleApiShelter = GoogleApiWrapper(
  {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
  })(GoogleMapShelter)


  const GoogleApiResult = GoogleApiWrapper(
    {
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })(ResultGoogleMap)



const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);