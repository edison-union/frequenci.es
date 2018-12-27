import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import { MAP } from 'react-google-maps/lib/constants'
import MapStyles from '../style/mapStyles'
import { AirportConstants } from '../constants/airports'
import _ from 'lodash'
import { colours } from '../style/variables'

class Country extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { data, setMarkerBounds, setMapCenter, setMapBounds } = this.props;
    data.map((airport) => {
      this.setState((prevState) => {
        return { markerBounds: prevState.markerBounds.extend(new google.maps.LatLng(airport.coordinates.lat, airport.coordinates.lng)) }
      });
    });

    const map = this.map.context[MAP];
    map.setCenter(this.state.markerBounds.getCenter());
    map.fitBounds(this.state.markerBounds);

    const div = map.getDiv();

    // Hack to style the initial state of Google Maps
    div.firstChild.style.backgroundColor = colours.map.water;

    setMarkerBounds(this.state.markerBounds);

    let hasZoomed = false;

    google.maps.event.addListener(map, 'idle', () => {
      // This is for the og-image generator, there is a delay between this event being
      // fired and the markers being rendered, so we just delay it 100ms
      setTimeout(() => {
        window.frequencies = true;
      }, 750);
    });

    google.maps.event.addListener(map, 'bounds_changed', () => {
      setMapCenter(map.getCenter());
      setMapBounds(map.getBounds());

      if (!hasZoomed) {
        hasZoomed = true;
        map.setZoom(map.getZoom()+.25);
      }
    });
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
    const defaultOptions = {
      styles: MapStyles,
      disableDefaultUI: true,
      backgroundColor: colours.map.water,
    };

    return (<GoogleMap
      ref={(map) => { this.map = map; }}
      defaultOptions={defaultOptions}
      defaultZoom={5}
      defaultCenter={center}
      options={{
        ...defaultOptions
      }}>
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
  setMarkerBounds: PropTypes.func.isRequired,
  setMapBounds: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired
}

const mapStateToProps = state => {
  return {
    markerBounds: state.markerBounds || new google.maps.LatLngBounds(),
    mapBounds: state.mapBounds
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMarkerBounds: (bounds) => {
      dispatch({
        type: 'SET_MARKER_BOUNDS',
        bounds: bounds
      })
    },
    setMapBounds: (bounds) => {
      dispatch({
        type: 'SET_MAP_BOUNDS',
        bounds: bounds
      })
    },
    setMapCenter: (center) => {
      dispatch({
        type: 'SET_MAP_CENTER',
        center: center
      })
    },
  }
}

export default withScriptjs(withGoogleMap(connect(
  mapStateToProps,
  mapDispatchToProps
)(Country)))
