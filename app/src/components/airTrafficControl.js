import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone'
import AudioService from '../services/audio'
import Song from '../services/song'
import PQueue from 'p-queue'
import { shuffle } from '../util/array'
import styled from 'styled-components'
import { colours } from '../style/variables'
import Country from '../components/country'
import FlightBoard from '../components/flightBoard'
import { above } from '../style/mixins'
import { flightBoardHeight } from '../style/variables'

class AirTrafficControl extends Component {
  constructor() {
    super();
    this.queue = new PQueue({ concurrency: 1 });
    this.state = {
      flights: [],
      buffer: [],
      mapUrl: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`
    };
  }

  addNewFlightsToBuffer() {
    const { data } = this.props;
    let buffer = this.state.flights
      .filter((flight) => !flight.processed)
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

        if (!flight.processing) {
          this.audioService.departureSound(options);
          flight.timestamp = new Date().getTime();
          flight.processing = true;
        }
        return flight;
      });

    this.setState({ buffer: buffer });
    this.clearBuffer();
  }

  isDecayedFlight(flight) {
    return Date.now() - flight.timestamp > this.song.getBars(2);
  }

  clearBuffer() {
    this.setState({
      buffer: this.state.buffer.filter((flight) => { return !this.isDecayedFlight(flight) })
    });
  }

  getDepartures(airport, start, end) {
    return fetch(`${process.env.API_URL_DEPARTURES}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
      .then((response) => {
        if (!response.ok) {
          throw Error({
            status: 'blocked'
          });
        }
        return response.json();
      })
      .then((json) => {
        const { data } = this.props;
        if (json.length) {
          this.setState((prevState) => {
            const flights = json.filter((flight) => {
              return !prevState.flights.some((f) => {
                return f.callsign === flight.callsign
              })
            }).map((flight) => {
              flight.departure_airport = data.filter((airport) => {
                return airport.gps_code === flight.estDepartureAirport
              })[0]
              flight.arrival_airport = data.filter((airport) => {
                return airport.gps_code === flight.estArrivalAirport
              })[0]
              return flight;
            });

            return {
              flights: [...prevState.flights, ...flights]
            }
          });
          return json;
        }
      })
      .catch((err) => {
        if (err.status === 'blocked') {
          this.queue.pause();
          setTimeout(() => this.queue.start(), process.env.API_RETRY_TIMEOUT);
        }
        return false;
      });
  }

  queueRequests() {
    const { data } = this.props;
    const now = moment();

    data.sort(shuffle).forEach((airport) => {
      const time = now.clone();
      time.tz(airport.timezone_id);
      const end = time.unix();
      const start = time.add(-process.env.TIME_SINCE_LAST_FLIGHT, 'minutes').unix();
      this.queue.add(() => this.getDepartures(airport, start, end));
    });

    this.queue.onIdle().then(() => {
      setTimeout(() => this.queueRequests(), process.env.REQUEST_INTERVAL)
    });
  }

  componentDidMount() {
    this.audioService = new AudioService();
    this.audioService.backgroundSound();
    this.song = new Song();
    this.queueRequests();
    this.interval = setInterval(() => this.addNewFlightsToBuffer(), this.song.getNoteDelay(1, 4));
  }

  componentWillUnmount() {
    this.audioService.destroy();
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container>
        <Country
          googleMapURL={this.state.mapUrl}
          loadingElement={(<Loading/>)}
          containerElement={<MapContainer/>}
          mapElement={<Map/>}
          {...this.props}
          {...this.state}/>
        <FlightBoard {...this.props} {...this.state}/>
      </Container>
    );
  }
}

export default AirTrafficControl;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  ${above.md`
    flex-direction: row;
  `}
`

const MapContainer = styled.div`
  display: flex;
  width: 100vw;
  height: calc(103vh - ${flightBoardHeight});
  order: 1;

  ${above.md`
    width: 75vw;
    height: 103vh;
    order: 0;
  `}
`
const Loading = styled(MapContainer)`
  background-color: ${colours.white};
`
const Map = styled(MapContainer)``
