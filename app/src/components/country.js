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
    let buffer = this.state.flights
      .filter((flight) => !flight.processing && !flight.processed)
      .map((flight, i) => {
        this.audioService.departureSound({
          offset: this.song.getNoteDelay(i),
          time: 0.1748,
          pitchShift: 20000 * 1.0 / flight.estDepartureAirportVertDistance
        });

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

  queueRequests() {
    const { data } = this.props;
    const queue = new PQueue({ concurrency: 6 });
    const now = moment();

    data.forEach((airport) => {
      const time = now.clone();
      time.tz(airport.timezone_id);
      const end = time.unix();
      const start = time.add(-10, 'minutes').unix();
      /*
      // Arrivals are delayed by a long time
      queue.add(() =>
        fetch(`${process.env.API_URL_ARRIVALS}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.length) {
              this.audioService.arrivalSound();
            }
          })
          .catch(() => {
            //console.log(err);
          })
      );*/

      queue.add(() =>
        fetch(`${process.env.API_URL_DEPARTURES}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.length) {
              this.setState((prevState) => {
                return {
                  flights: [...prevState.flights, ...json.filter((flight) => !prevState.flights.some((f) => f.callsign === flight.callsign))]
                }
              })
            }
          })
          .catch(() => {
          //  console.log(err);
          })
      );
    });

    queue.onIdle().then(() => {
      setTimeout(() => this.queueRequests(), process.env.REQUEST_INTERVAL)
    });
  }

  getMarkerForAirport(airport) {
    const hasDeparture = this.state.flights.filter((flight) => {
      return this.state.buffer.some((f) => f.callsign === flight.callsign && flight.estDepartureAirport === airport.gps_code);
    }).length > 0;

    return hasDeparture ? markerActive : marker;
  }

  render() {
    const { data, center, mapStyles } = this.props;

    return (<GoogleMap
      defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
      defaultZoom={5}
      defaultCenter={ center }>
      {data.map((airport) => {
        if (this.state.bounds) {
          this.setState((prevState) => {
            return { bounds: prevState.bounds.extend(airport.coordinates) }
          });
        }

        return <Marker key={airport.gps_code}
          icon={{
             url: this.getMarkerForAirport(airport)
           }}
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
