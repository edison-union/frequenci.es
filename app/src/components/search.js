import React, { Component } from 'react'
import Flyout from './flyout'
import { Heading, Copy } from './shared'

class Search extends Component {
  render() {
    return (<Flyout>
      <Heading>Search</Heading>
      <Copy>Coming soon</Copy>
    </Flyout>);
  }
}

export default Search
