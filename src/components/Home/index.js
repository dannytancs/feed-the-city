import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { FirebaseContext } from '../Firebase';


import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


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

    console.log(process.env.GOOGLE_MAP_API);
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
          
            <button className="btn btn-primary" style={{right: "52%", position: "absolute", top:"13%"}}type="submit">
              Select
                </button>
            
          </form>
        </div>
        }


        {!this.state.loading && <div style={{ height: '100vh', width: '50%', float: "right" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API }}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
          >
            <AnyReactComponent
              lat={this.lat}
              lng={this.lon}
              text={'Current Location'}
            />
          </GoogleMapReact>
        </div>
        }
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