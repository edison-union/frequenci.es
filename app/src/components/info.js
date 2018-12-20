import React, { Component } from 'react'
import Flyout from './flyout'
import { Heading, Copy, Link, Subheading } from './shared'

class Info extends Component {
  render() {
    return (<Flyout>
      <Heading>About Frequenci.es</Heading>
      <Copy>Frequenci.es was created by David Johnson of creative technology collective <Link href="https://edisonunion.co" target="_blank">The Edison Union</Link>.</Copy>
      <Subheading>The Data</Subheading>
      <Copy>API provided by <Link href="https://opensky-network.org" target="_blank">OpenSky Network</Link></Copy>
      <Subheading>The Font</Subheading>
      <Copy>Font is <Link href="https://www.youworkforthem.com/font/T5585/visby-cf">Visby CF</Link> by <Link href="https://www.youworkforthem.com/designer/479/connary-fagen/">Connary Fagen</Link></Copy>
      <Subheading>The Icons</Subheading>
      <Copy>Icons by <Link href="https://www.flaticon.com/authors/itim2101" title="itim2101" target="_blank">itim2101</Link> from <Link href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</Link> and is licensed by <Link href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</Link></Copy>
    </Flyout>);
  }
}

export default Info
