import React, { Component } from 'react'
import Flyout from './flyout'
import { Heading, Copy, TextLink, Subheading } from './shared'

class Info extends Component {
  render() {
    return (<Flyout>
      <Heading>About Frequenci.es</Heading>
      <Copy>Frequenci.es was created by David Johnson of creative technology collective <TextLink href="https://edisonunion.co" target="_blank">The Edison Union</TextLink>.</Copy>
      <Subheading>The Data</Subheading>
      <Copy>API provided by <TextLink href="https://opensky-network.org" target="_blank">OpenSky Network</TextLink></Copy>
      <Subheading>The Font</Subheading>
      <Copy>Font is <TextLink href="https://www.youworkforthem.com/font/T5585/visby-cf">Visby CF</TextLink> by <TextLink href="https://www.youworkforthem.com/designer/479/connary-fagen/">Connary Fagen</TextLink></Copy>
      <Subheading>The Icons</Subheading>
      <Copy>Icons by <TextLink href="https://www.flaticon.com/authors/itim2101" title="itim2101" target="_blank">itim2101</TextLink> from <TextLink href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</TextLink> and is licensed by <TextLink href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</TextLink></Copy>
      <Subheading>The Code</Subheading>
      <Copy>Built with <TextLink href="https://gatsbyjs.org" target="_blank">Gatsby</TextLink> and <TextLink href="https://reactjs.org" target="_blank">React</TextLink>.
      Source code available on <TextLink href="https://github.com/edison-union/frequenci.es" target="_blank">Github</TextLink>.</Copy>
    </Flyout>);
  }
}

export default Info
