import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import { MAP } from 'react-google-maps/lib/constants'
import MapStyles from '../style/mapStyles'
import { AirportConstants } from '../constants/airports'

class Country extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounds: new google.maps.LatLngBounds(),
      ...props
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      ...props
    };
  }

  componentDidMount() {
    // Extend the bounds of the map to the markers
    const { data } = this.props;
    data.map((airport) => {
      this.setState((prevState) => {
        return { bounds: prevState.bounds.extend(new google.maps.LatLng(airport.coordinates.lat, airport.coordinates.lng)) }
      });
    });

    const map = this.map.context[MAP];
    map.setCenter(this.state.bounds.getCenter());
    map.fitBounds(this.state.bounds);
  }

  getMarkerForAirport(airport) {
    const hasDeparture = this.state.buffer.filter((flight) => flight.estDepartureAirport === airport.gps_code).length > 0;

    const matchingIcon = AirportConstants[airport.type].markers;

    if (hasDeparture) {
      return {
         url: matchingIcon.active,
         anchor: new google.maps.Point(12, 12),
         size: new google.maps.Size(24, 24)
       };
     }

     return {
        url: matchingIcon.default,
        anchor: new google.maps.Point(matchingIcon.size / 2, matchingIcon.size / 2),
        size: new google.maps.Size(matchingIcon.size, matchingIcon.size)
      };
  }

  render() {
    const { data, center } = this.props;
    return (<GoogleMap
      ref={(map) => { this.map = map; }}
      defaultOptions={{ styles: MapStyles, disableDefaultUI: true }}
      defaultZoom={5}
      defaultCenter={center}>
      {data.map((airport, index) => {
        return <Marker key={`${airport.gps_code}-${index}`}
          icon={this.getMarkerForAirport(airport)}
          position={airport.coordinates} />
      })}
    </GoogleMap>);
  }
}

Country.propTypes = {
  data: PropTypes.array.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired
}

export default withScriptjs(withGoogleMap(Country));
