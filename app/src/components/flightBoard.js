import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'
import { colours } from '../style/variables'
import { AirportConstants } from '../constants/airports'
import { Card, CardTitle, CardCopy, Heading } from './shared'
import Song from '../services/song'
import Flyout from './flyout'

class FlightBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {...props};
    this.song = new Song();
    this.maxItems = 10;
  }

  static getDerivedStateFromProps(props) {
    return {
      ...props
    };
  }

  getAirportByCode(code) {
    return this.props.data.filter((airport) => {
      return airport.gps_code === code;
    })
  }

  isValidFlight(flight) {
    return flight.departure_airport;
  }

  render() {
    return (
      <Flyout>
        <Heading>Departure Board</Heading>
        {this.state.flights && this.state.flights.map((flight, i) => {
          if (this.isValidFlight(flight, i)) {
            return (
              <Flight
                target={flight.callsign ? '_blank' : '_self'}
                href={flight.callsign ? `http://flightaware.com/live/flight/${flight.callsign.toUpperCase()}` : 'javascript://'}
                className={classNames({
                  'is-transitioning': Date.now() - flight.timestamp > 5,
                  'is-old': Date.now() - flight.timestamp > this.song.getBars(2)
                })} types={Object.keys(AirportConstants)} activeType={flight.departure_airport.type} key={`${flight.callsign}-${i}`}>
                  <CardTitle>{flight.callsign ? flight.callsign : '-' }</CardTitle>
                  <CardCopy>{flight.departure_airport.name}</CardCopy>
              </Flight>
            )
          }
          return false;
        }).reverse()}
      </Flyout>
    )
  }
}

FlightBoard.propTypes = {
  data: PropTypes.array.isRequired,
  country: PropTypes.string.isRequired
}

export default FlightBoard

const Flight = styled(Card)`
  ${props => props.types.map((type) => {
    if (props.activeType === type) {
      return `background-color: ${AirportConstants[type].colour};
        color: ${colours.white};

        &:hover,
        &:focus {
          background-color: ${AirportConstants[type].colour};
          opacity: 1;
        }

        &:focus {
          outline: 1px dotted ${AirportConstants[type].colour};
        }`
    }
    return false;
  })}
`
