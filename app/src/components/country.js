import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import PQueue from 'p-queue'
import * as markerLarge from '../images/marker-large.svg'
import * as markerLargeActive from '../images/marker-large-active.svg'
import * as markerMedium from '../images/marker-medium.svg'
import * as markerMediumActive from '../images/marker-medium-active.svg'
import * as markerSmall from '../images/marker-small.svg'
import * as markerSmallActive from '../images/marker-small-active.svg'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone'
import AudioService from '../services/audio'
import Song from '../services/song'
import { MAP } from 'react-google-maps/lib/constants'

class Country extends Component {
  constructor() {
    super();
    this.state = {
      flights: [],
      buffer: [],
      bounds: new google.maps.LatLngBounds()
    };
  }

  componentDidMount() {
    this.audioService = new AudioService();
    this.audioService.backgroundSound();
    this.song = new Song();
    this.queueRequests();
    this.interval = setInterval(() => this.addNewFlightsToBuffer(), this.song.getBars(1));

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

  componentWillUnmount() {
    this.audioService.destroy();
    clearInterval(this.interval);
  }

  addNewFlightsToBuffer() {
    const { data } = this.props;
    let buffer = this.state.flights
      .filter((flight) => !flight.processing && !flight.processed)
      .map((flight) => {
        const options = {
          height: flight.estDepartureAirportVertDistance,
          type: data.reduce((a, b) => {
            if (flight.estDepartureAirport === b.gps_code) {
              return b.type;
            }
            return a;
          }, null)
        }
        this.audioService.departureSound(options);

        flight.timestamp = Date.now();
        flight.processing = true;
        return flight;
      });

    this.setState({ buffer: buffer });
    this.clearBuffer();
  }

  isDecayedFlight(flight) {
    return Date.now() - flight.timestamp > this.song.getBars(1);
  }

  clearBuffer() {
    let unprocessed = this.state.buffer.filter((flight) => { this.isDecayedFlight(flight) }).map((flight) => {
      flight.processed = true;
      flight.processing = false;
      return flight;
    });

    let processed = this.state.flights.filter((flight) => flight.processed);

    if (unprocessed.length) {
      this.setState({
        flights: [...processed, ...unprocessed],
        buffer: this.state.buffer.filter(this.isDecayedFlight)
      });
    }
  }

  getDepartures(airport, start, end) {
    return fetch(`${process.env.API_URL_DEPARTURES}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.length) {
          this.setState((prevState) => {
            return {
              flights: [...prevState.flights, ...json.filter((flight) => !prevState.flights.some((f) => f.callsign === flight.callsign))]
            }
          });
          return json;
        }
      })
      .catch(() => {
        return false;
      })
  }

  queueRequests() {
    const { data } = this.props;
    const queue = new PQueue({ concurrency: 1 });
    const now = moment();

    data.forEach((airport) => {
      const time = now.clone();
      time.tz(airport.timezone_id);
      const end = time.unix();
      const start = time.add(-5, 'minutes').unix();
      queue.add(() => this.getDepartures(airport, start, end));
    });

    queue.onIdle().then(() => {
      setTimeout(() => this.queueRequests(), process.env.REQUEST_INTERVAL)
    });
  }

  getMarkerForAirport(airport) {
    const markerMap = [{
      type: 'large_airport',
      marker: markerLarge,
      markerActive: markerLargeActive,
      size: 3
    }, {
      type: 'medium_airport',
      marker: markerMedium,
      markerActive: markerMediumActive,
      size: 2
    }, {
      type: 'small_airport',
      marker: markerSmall,
      markerActive: markerSmallActive,
      size: 1
    }];

    const hasDeparture = this.state.flights.filter((flight) => {
      return this.state.buffer.some((f) => f.callsign === flight.callsign && flight.estDepartureAirport === airport.gps_code);
    }).length > 0;

    const matchingIcon = markerMap.filter((m) => m.type === airport.type)[0];

    if (hasDeparture) {
      return {
         url: matchingIcon.markerActive,
         anchor: new google.maps.Point(12, 12),
         size: new google.maps.Size(24, 24)
       };
     }

     return {
        url: matchingIcon.marker,
        anchor: new google.maps.Point(matchingIcon.size / 2, matchingIcon.size / 2),
        size: new google.maps.Size(matchingIcon.size, matchingIcon.size)
      };
  }

  render() {
    const { data, center, mapStyles } = this.props;
    return (<GoogleMap
      ref={(map) => { this.map = map; }}
      defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
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
  mapStyles: PropTypes.array.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired
}

export default withScriptjs(withGoogleMap(Country));
