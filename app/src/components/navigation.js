import React, { Component } from 'react'
import styled from 'styled-components'
import FlightBoard from './flightBoard'
import { colours, spacing, timings } from '../style/variables'
import { above } from '../style/mixins'
import * as iconDepartures from '../images/icon-departures.svg'
import * as iconRadar from '../images/icon-radar.svg'
import * as iconInfo from '../images/icon-info.svg'

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
              <Icon src={iconDepartures}/>
            </Button>
            <FlightBoard {...this.props} {...this.state}/>
          </ListItem>
          <ListItem>
            <Button className={ this.state.childActive === 1 ? 'is-active' : '' } onClick={() => this.toggleChild(1)}>
              <Icon src={iconRadar}/>
            </Button>
          </ListItem>
          <ListItem>
            <Button className={ this.state.childActive === 2 ? 'is-active' : '' } onClick={() => this.toggleChild(2)}>
              <Icon src={iconInfo}/>
            </Button>
          </ListItem>
        </List>
      </Container>
    );
  }
}

const Container = styled.nav`
  position: absolute;
  top: 0;
  right: 0;
  background: ${colours.navigation.background};
  color: ${colours.navigation.text};
  z-index: 2;

  ${above.md`
    right: 0;
  `}
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`

const ListItem = styled.li`
  display: flex;
  background: ${colours.navigation.background};
`

const Icon = styled.img`
  width: 32px;
  height: 32px;
`

const Button = styled.button`
  background: none;
  border: 0;
  outline: 0;
  padding: ${spacing.default};
  display: block;

  &:hover,
  &.is-active {
    background: ${colours.navigation.background_hover};
  }

  & + * {
    position: absolute;
    transform: translateX(100%);
    top: 0;
    transition: transform ${timings.lg}s ease-out;
    z-index: -1;
  }

  &.is-active + * {
    transform: translateX(-100%);
  }
`

export default Navigation
