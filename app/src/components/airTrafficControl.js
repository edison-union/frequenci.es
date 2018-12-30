import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone'
import styled from 'styled-components'
import Div100vh from 'react-div-100vh'
import _ from 'lodash'
import { isIOS } from 'react-device-detect'
import { connect } from 'react-redux'
import AudioService from '../services/audio'
import Song from '../services/song'
import PQueue from 'p-queue'
import Country from './country'
import Navigation from './navigation'
import { Heading, Copy, Button, ButtonRow } from './shared'
import { scale } from '../util/number'
import { colours, spacing } from '../style/variables'
import { above } from '../style/mixins'
import * as spinner from '../images/icon-spinner.svg'

class AirTrafficControl extends Component {
  constructor() {
    super();

    this.queue = new PQueue({ concurrency: parseInt(process.env.API_REQUEST_CONCURRENCY) });
    this.state = {
      flights: [],
      buffer: [],
      isModalOpen: true,
      isReady: false,
      activeAirports: [],
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
    const { data } = this.props;
    let index = 0;

    // Buffer is for any recently added flights
    // If it's currently not being processed, we feed the audio service
    // an object of parameters that it uses to play a sound
    let buffer = this.state.flights
      .filter((flight) => !flight.processed)
      .map((flight) => {
        if (!flight.processing) {
          const options = {
            height: flight.estDepartureAirportVertDistance,
            spatialData: this.convertDistanceToSpatial(flight),
            offset: this.song.getNoteDelay(index, 8),
            type: data.reduce((a, b) => {
              if (flight.estDepartureAirport === b.gps_code) {
                return b.type;
              }
              return a;
            }, null)
          }

          if (this.audioService) {
            this.audioService.departureSound(options);
          }

          flight.timestamp = new Date().getTime();
          flight.processing = true;
          index++;
        }

        return flight;
      });

    // Performance tweak
    // We don't want to re-render anything unless the buffer has changed
    if (!_.isEqual(buffer, this.state.buffer)) {
      this.setState({ buffer: buffer });
    }

    // Clear out any decayed flights
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
    this.setState((prevState) => {
      return {
        activeAirports: [...prevState.activeAirports, airport.gps_code]
      }
    });

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
            // We need to filter out if it's already been added
            // Then add some other data attributes
            const flights = json.filter((flight) => {
              return !prevState.flights.some((f) => {
                return f.callsign === flight.callsign
              })
            }).map((flight) => {
              flight.timezone_id = airport.timezone_id;
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
      }).finally(() => {
        this.setState((prevState) => {
          return {
            activeAirports: prevState.activeAirports.filter((a) => !a.gps_code === airport.gps_code)
          }
        });
      });
  }

  queueRequests() {
    const { data } = this.props;
    const now = moment();

    // Sort by latitude and longitude
    // Left -> Right
    // Top -> Bottom
    data.sort((a, b) => {
      return a.coordinates.lng - b.coordinates.lng || a.coordinates.lat - b.coordinates.lat;
    }).forEach((airport) => {
      const time = now.clone();

      // Create timestamps to search by i.e. now and now - N minutes
      const end = time.unix();
      const start = time.add(-process.env.TIME_SINCE_LAST_FLIGHT, 'minutes').unix();

      // Add promises to the queue
      this.queue.add(() => this.getDepartures(airport, start, end));
    });

    // When the queue is empty, re-hydrate it
    this.queue.onIdle().then(() => {
      setTimeout(() => this.queueRequests(), process.env.REQUEST_INTERVAL)
    });
  }

  startAudioIOS() {
    this.startAudio();
    this.setState({ isModalOpen: false });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  startRequests() {
    this.setState({ isReady: true });
    this.queueRequests();
    this.interval = setInterval(() => this.addNewFlightsToBuffer(), this.song.getNoteDelay(1, 4));
  }

  startAudio() {
    this.song = new Song();
    this.audioService = new AudioService();
    this.audioService.backgroundSound();
    this.audioService.onReady = () => {
      this.startRequests();
    }
  }

  componentDidMount() {
    if (!isIOS) {
      this.startAudio();
    }
  }

  componentWillUnmount() {
    this.queue.pause();
    this.queue.clear();
    this.audioService.destroy();
    clearInterval(this.interval);
  }

  render() {
    return (
      <Div100vh>
        <Container>
          <Navigation {...this.props} {...this.state}/>
          {this.state.isReady && (
            <Country googleMapURL={this.state.mapUrl} loadingElement={(<Loading/>)} containerElement={<MapContainer/>} mapElement={<Map/>} {...this.props} {...this.state}/>
          )}
          {!this.state.isReady && (
            <Loading/>
          )}
            {this.state.isModalOpen && isIOS && (
              <Div100vh>
                <ModalOverlay>
                  <Modal>
                    <Heading>Enable Audio</Heading>
                    <Copy>iOS will only start an AudioContext in response to a user interaction, so to enjoy the full visual audio/visual experience
                    of frequenci.es on your device, please tap the Start Audio button below to start!</Copy>
                    <ButtonRow>
                      <Button onClick={() => this.startAudioIOS()}>Start Audio</Button>
                      <Button onClick={() => this.closeModal()}>No Thanks</Button>
                    </ButtonRow>
                  </Modal>
                </ModalOverlay>
              </Div100vh>
            )}
        </Container>
      </Div100vh>
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
  height: 100vh;
  overflow: hidden;
  width: 100vw;

  ${above.md`
    flex-direction: row;
  `}
`

const MapContainer = styled.div`
  display: flex;
  height: 103vh;
  width: 100vw;
`

const Loading = styled(Div100vh)`
  background-color: ${colours.map.water};
  background-image: url(${spinner});
  background-position: 50% 48%;
  background-repeat: no-repeat;
  background-size: 3rem;
  width: 100%;
`

const Map = styled(MapContainer)``

const ModalOverlay = styled(Div100vh)`
  display: flex;
  background-color: ${colours.overlay};
  z-index: 99998;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`

const Modal = styled.div`
  background-color: ${colours.white};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 80%;
  left: 50%;
  max-height: 40rem;
  max-width: 40rem;
  padding: ${spacing.md};
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  z-index: 99999;
`
