import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import { MAP } from 'react-google-maps/lib/constants'
import MapStyles from '../style/mapStyles'
import { AirportConstants } from '../constants/airports'
import _ from 'lodash'

class Country extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounds: new google.maps.LatLngBounds(),
      ...props
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!_.isEqual(props, state)) {
      return {
        ...props
      }
    }
    return null;
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
         url: matchingIcon.active.icon,
         anchor: new google.maps.Point(matchingIcon.active.size / 2, matchingIcon.active.size / 2),
         size: new google.maps.Size(matchingIcon.active.size, matchingIcon.active.size)
       };
     }

     return {
        url: matchingIcon.default.icon,
        anchor: new google.maps.Point(matchingIcon.default.size / 2, matchingIcon.default.size / 2),
        size: new google.maps.Size(matchingIcon.default.size, matchingIcon.default.size)
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
