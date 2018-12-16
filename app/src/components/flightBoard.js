import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'
import { above } from '../style/mixins'
import { colours, flightBoardHeight, spacing, timings } from '../style/variables'
import { AirportConstants } from '../constants/airports'
import Song from '../services/song'

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
      <Container>
        {this.state.flights && this.state.flights.map((flight, i) => {
          if (this.isValidFlight(flight, i)) {
            return (<Flight className={classNames({
                'is-transitioning': Date.now() - flight.timestamp > 5,
                'is-old': Date.now() - flight.timestamp > this.song.getBars(2)
              })} types={Object.keys(AirportConstants)} activeType={flight.departure_airport.type} key={`${flight.callsign}-${i}`}>
                <FlightCallsign>{flight.callsign}</FlightCallsign>
                <FlightAirport>{flight.departure_airport.name}{flight.arrival_airport ? ` - ${flight.arrival_airport.name}` : ``}</FlightAirport>
            </Flight>)
          }
          return false;
        }).reverse()}
      </Container>
    )
  }
}

FlightBoard.propTypes = {
  data: PropTypes.array.isRequired,
  country: PropTypes.string.isRequired
}

export default FlightBoard

const Container = styled.section`
  align-items: center;
  background-color: ${colours.flightBoard.background};
  color: ${colours.flightBoard.text};
  height: ${flightBoardHeight};
  padding: ${spacing.md};
  overflow-y: auto;

  ${above.md`
    width: 25vw;
    height: 103vh;
  `}
`

const Flight = styled.div`
  background-color: ${colours.white};
  color: ${colours.black};
  display: flex;
  flex-direction: column;
  font-size: .8rem;
  margin-bottom: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  transform: rotateX(-90deg);
  transition: transform ${timings.sm}s ease-out, opacity ${timings.lg}s ease-out;
  width: 100%;
  box-sizing: border-box;

  ${props => props.types.map((type) => {
    if (props.activeType === type) {
      return `background-color: ${AirportConstants[type].colour};
        color: ${colours.white};`
    }
    return false;
  })}

  &.is-transitioning {
    transform: rotateX(0deg);
  }

  &.is-old {
    opacity: .8;
  }
`

const FlightCallsign = styled.strong`
  font-weight: 600;
`

const FlightAirport = styled.p`
  margin: 0;
`
