import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone'
import styled from 'styled-components'
import { connect } from 'react-redux'
import AudioService from '../services/audio'
import Song from '../services/song'
import PQueue from 'p-queue'
import Country from './country'
import Navigation from './navigation'
import { shuffle } from '../util/array'
import { scale } from '../util/number'
import { colours } from '../style/variables'
import { above } from '../style/mixins'
import _ from 'lodash'

class AirTrafficControl extends Component {
  constructor() {
    super();
    this.queue = new PQueue({ concurrency: parseInt(process.env.API_REQUEST_CONCURRENCY) });
    this.state = {
      flights: [],
      buffer: [],
      mapUrl: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`
    };
  }

  convertDistanceToSpatial(flight) {
    const airport = flight.departure_airport.coordinates;
    const height = flight.estDepartureAirportVertDistance;
    const { mapBounds } = this.props;

    const left = mapBounds.getSouthWest().lng();
    const top = mapBounds.getSouthWest().lat();
    const right = mapBounds.getNorthEast().lng();
    const bottom = mapBounds.getNorthEast().lat();

    return {
      x: scale(airport.lng, left, right, -1, 1),
      y: scale(airport.lat, top, bottom, -1, 1),
      z: -scale(height, 0, 1000, 0, 1)
    }
  }

  addNewFlightsToBuffer() {
    const { data, spatialAudioEnabled } = this.props;
    let index = 0;

    let buffer = this.state.flights
      .filter((flight) => !flight.processed)
      .map((flight) => {
        if (!flight.processing) {
          const options = {
            height: flight.estDepartureAirportVertDistance,
            spatialAudioEnabled: spatialAudioEnabled,
            spatialData: this.convertDistanceToSpatial(flight),
            offset: this.song.getNoteDelay(index, 8),
            type: data.reduce((a, b) => {
              if (flight.estDepartureAirport === b.gps_code) {
                return b.type;
              }
              return a;
            }, null)
          }

          this.audioService.departureSound(options);
          flight.timestamp = new Date().getTime();
          flight.processing = true;
          index++;
        }

        return flight;
      });

    if (!_.isEqual(buffer, this.state.buffer)) {
      this.setState({ buffer: buffer });
    }

    this.clearBuffer();
  }

  isDecayedFlight(flight) {
    return Date.now() - flight.timestamp > this.song.getBars(2);
  }

  clearBuffer() {
    const notExpired = this.state.buffer.filter((flight) => { return !this.isDecayedFlight(flight) });

    if (!_.isEqual(notExpired, this.state.buffer)) {
      this.setState((prevState) => {
        return {
          buffer: notExpired,
          flights: prevState.flights.map((flight) => {
            flight.processed = this.isDecayedFlight(flight);
            return flight;
          })
        }
      });
    }
  }

  getDepartures(airport, start, end) {
    return fetch(`${process.env.API_URL_DEPARTURES}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject({
            status: response.status
          })
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
        // When a 503 error occurs for some reason fetch thinks it's an OPTIONS request that failed
        // So doesn't return a response, it just throws an error
        if (err.toString() === 'TypeError: Failed to fetch') {
          this.queue.pause();
          setTimeout(() => this.queue.start(), process.env.API_RETRY_TIMEOUT);
        }
        return false;
      });
  }

  queueRequests() {
    const { data } = this.props;
    const now = moment();

    shuffle(data).forEach((airport) => {
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
    this.queue.pause();
    this.queue.clear();
    this.audioService.destroy();
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container>
        <Navigation {...this.props} {...this.state}/>
        <Country
          googleMapURL={this.state.mapUrl}
          loadingElement={(<Loading/>)}
          containerElement={<MapContainer/>}
          mapElement={<Map/>}
          {...this.props}
          {...this.state}/>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    spatialAudioEnabled: state.spatialAudioEnabled,
    mapBounds: state.mapBounds,
    markerBounds: state.markerBounds
  }
}

export default connect(
  mapStateToProps
)(AirTrafficControl)

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
  height: 103vh;
`

const Loading = styled(MapContainer)`
  background-color: ${colours.map.water};
`

const Map = styled(MapContainer)``
