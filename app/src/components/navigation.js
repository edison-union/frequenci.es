import React, { Component } from 'react'
import styled from 'styled-components'
import FlightBoard from './flightBoard'
import SpatialAudio from './spatialAudio'
import Info from './info'
import Search from './search'
import { colours, spacing, timings } from '../style/variables'
import { above } from '../style/mixins'
import * as iconDepartures from '../images/icon-departures.svg'
import * as iconRadar from '../images/icon-radar.svg'
import * as iconInfo from '../images/icon-info.svg'
import * as iconSearch from '../images/icon-search.svg'

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childActive: -1,
      ...props
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      ...props
    };
  }

  toggleChild(index) {
    this.setState((prevState) => {
      return { childActive: prevState.childActive === index ? -1 : index }
    })
  }

  render() {
    return (
      <Container>
        <List>
          <ListItem>
            <Button className={ this.state.childActive === 0 ? 'is-active' : '' } onClick={() => this.toggleChild(0)}>
              <Icon src={iconSearch}/>
            </Button>
            <Search />
          </ListItem>
          <ListItem>
            <Button className={ this.state.childActive === 1 ? 'is-active' : '' } onClick={() => this.toggleChild(1)}>
              <Icon src={iconDepartures}/>
            </Button>
            <FlightBoard {...this.props} {...this.state}/>
          </ListItem>
          <ListItem>
            <Button className={ this.state.childActive === 2 ? 'is-active' : '' } onClick={() => this.toggleChild(2)}>
              <Icon src={iconRadar}/>
            </Button>
            <SpatialAudio {...this.props} {...this.state}/>
          </ListItem>
          <ListItem>
            <Button className={ this.state.childActive === 3 ? 'is-active' : '' } onClick={() => this.toggleChild(3)}>
              <Icon src={iconInfo}/>
            </Button>
            <Info />
          </ListItem>
        </List>
      </Container>
    );
  }
}

const Container = styled.nav`
  background-color: ${colours.navigation.background};
  color: ${colours.navigation.text};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;

  ${above.md`
    right: 0;
  `}
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
`

const ListItem = styled.li`
  display: flex;
`

const Icon = styled.img`
  height: 32px;
  width: 32px;
`

const Button = styled.button`
  background-color: transparent;
  border: 0;
  display: block;
  outline: 0;
  padding: ${spacing.default};

  &:hover,
  &.is-active {
    background-color: ${colours.navigation.background_hover};
  }

  & + * {
    position: absolute;
    right: calc(32px + ${spacing.default} + ${spacing.default});
    top: 0;
    transform: translateY(-100%);
    transition: transform ${timings.lg}s ease-out;
  }

  &.is-active + * {
    transform: translateY(0);
  }
`

export default Navigation
