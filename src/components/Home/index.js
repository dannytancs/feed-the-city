import React, { Component } from 'react';

import { withAuthorization } from '../Session';




class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lon: null,
      loading: true
    }
  }


  componentDidMount() {
    this.setState({ loading: true });

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        loading: false
      })
    })
  }




  render() {
    return (
      <div>
        {this.state.loading && <div>Loading ...</div>}
        {!this.state.loading &&
          <div>
            <div>
              Latitude: {this.state.lat}
            </div>
            <div>
              Longitude: {this.state.lon}
            </div>
          </div>
        }
      </div>
    )
  }
}



const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);