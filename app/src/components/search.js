import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Flyout from './flyout'
import { Heading, Card, CardCopy, CardTitle, Input } from './shared'
import styled from 'styled-components'
import { colours } from '../style/variables'

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
    const regex = new RegExp(this.inputRef.value, 'ig');

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
    if (this.props.childActive === 0) {
      this.inputRef.focus();
    }

    return (<Flyout>
      <Heading>Search</Heading>
      <Input ref={(ref) => { this.inputRef = ref; }} onKeyUp={(e) => { this.handleKeyDown(e) }}/>
      {this.state.results.map((result) => {
        return (<Country key={result.code} to={result.code}>
          <CardTitle>{result.name}</CardTitle>
          <CardCopy>{result.airports} airports</CardCopy>
        </Country>);
      })}
    </Flyout>);
  }
}

Search.propTypes = {
  countries: PropTypes.array.isRequired,
  childActive: PropTypes.number.isRequired
}

export default Search

const Country = styled(Card)`
  background-color: ${colours.button.background};
  color: ${colours.button.text};

  &:hover,
  &:focus {
    background-color: ${colours.button.hover}
  }

  &:focus {
    outline: 1px dotted ${colours.button.hover};
  }
`
