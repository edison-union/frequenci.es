import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Flyout from './flyout'
import { Heading, Input } from './shared'
import styled from 'styled-components'
import { gpuStyles } from '../style/mixins'
import { colours, spacing, timings } from '../style/variables'

class Search extends Component {
  constructor(props) {
    super(props);
    this.inputRef = null;
    this.state = {
      results: [],
      ...props
    };
  }

  handleKeyDown() {
    const { countries } = this.props;
    const regex = new RegExp(this.inputRef.value);

    if (this.inputRef.value.length >= 2) {
      this.setState({
        results: countries.filter((country) => regex.test(country.name) || regex.test(country.code))
      })
    } else {
      this.setState({
        results: []
      });
    }
  }

  render() {
    return (<Flyout>
      <Heading>Search</Heading>
      <Input ref={(ref) => { this.inputRef = ref; }} onKeyUp={(e) => { this.handleKeyDown(e) }}/>
      {this.state.results.map((result) => {
        return (<Country key={result.code} to={result.code}>
          <CountryName>{result.name}</CountryName>
          <CountryAirports>{result.airports} airports</CountryAirports>
        </Country>);
      })}
    </Flyout>);
  }
}

Search.propTypes = {
  countries: PropTypes.array.isRequired
}

export default Search

const Country = styled(Link)`
  background-color: ${colours.button.background};
  box-sizing: border-box;
  color: ${colours.button.text};
  display: flex;
  flex-direction: column;
  font-size: .8rem;
  min-height: min-content;
  padding: ${spacing.xs} ${spacing.sm};
  text-decoration: none;
  transform: rotateX(-90deg);
  transition: transform ${timings.sm}s ease-out, opacity ${timings.lg}s ease-out;
  width: 100%;

  ${gpuStyles``}

  &:hover {
    background-color: ${colours.button.hover}
  }

  &:focus {
    outline: none;
  }

  & + & {
    margin-top: ${spacing.xs};
  }
`

const CountryName = styled.strong`
  font-weight: 600;
`

const CountryAirports = styled.p`
  margin: 0;
`
