import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import PQueue from 'p-queue'
import * as marker from '../images/marker.svg'
import * as markerActive from '../images/marker-active.svg'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone'
import AudioService from '../services/audio'
import Song from '../services/song'

class Country extends Component {
  constructor() {
    super();
    this.state = {
      flights: [],
      buffer: [],
      bounds: window.google.maps.LatLngBounds()
    };
  }

  componentDidMount() {
    this.audioService = new AudioService();
    this.audioService.backgroundSound();
    this.song = new Song();
    this.queueRequests();
    this.setState({ bounds: window.google.maps.LatLngBounds()});
    this.interval = setInterval(() => this.addNewFlightsToBuffer(), this.song.getNoteDelay(1, 1));
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
        this.audioService.departureSound(data.reduce((a, b) => {
          if (flight.estDepartureAirport === b.gps_code) {
            return b.type;
          }
          return a;
        }, null));

        flight.timestamp = Date.now();
        flight.processing = true;
        return flight;
      });

    this.setState({ buffer: buffer });
    this.clearBuffer();
  }

  isDecayedFlight(flight) {
    return Date.now() - flight.timestamp > 2500;
  }

  clearBuffer() {
    let unprocessed = this.state.buffer.filter(this.isDecayedFlight).map((flight) => {
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
    const queue = new PQueue({ concurrency: 5 });
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
    const hasDeparture = this.state.flights.filter((flight) => {
      return this.state.buffer.some((f) => f.callsign === flight.callsign && flight.estDepartureAirport === airport.gps_code);
    }).length > 0;

    if (hasDeparture) {
      return {
         url: markerActive,
         anchor: new google.maps.Point(12, 12),
         size: new google.maps.Size(24, 24)
       };
     }

     return {
        url: marker,
        anchor: new google.maps.Point(1, 1),
        size: new google.maps.Size(2, 2)
      };
  }

  render() {
    const { data, center, mapStyles } = this.props;

    return (<GoogleMap
      defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
      defaultZoom={5}
      defaultCenter={ center }>
      {data.map((airport, index) => {
        if (this.state.bounds) {
          this.setState((prevState) => {
            return { bounds: prevState.bounds.extend(airport.coordinates) }
          });
        }

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
