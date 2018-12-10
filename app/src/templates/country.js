import * as PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Helmet from 'react-helmet'

import Country from '../components/country'
import Layout from '../components/layout'
import MapStyles from '../style/mapStyles'
import { colours } from '../style/variables'

class CountryTemplate extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      airportsJson: PropTypes.object.isRequired,
    }),
    location: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      queue: [],
      airports: [],
      country: null,
      center: {
        lat: 0,
        lng: 0
      },
      mapUrl: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`
    }
  }

  componentDidMount() {
    const { data } = this.props;
    const filtered = data.airportsJson.airports.filter((airport) => {
      return ['large_airport', 'medium_airport', 'small_airport'].includes(airport.type);
    });

    this.setState({ country: data.airportsJson.name, airports: filtered, center: data.airportsJson.center });

    filtered.forEach((airport) => {
      this.setState(prevState => ({
        queue: [...prevState.queue, airport.gps_code]
      }));
    });
  }

  render() {
    const { location } = this.props;

    return (
      <Layout location={location}>
        <Helmet>
          <title>{`frequenci.es  - ${this.state.country}`}</title>
          <meta name="description" content="A data sonification of flight departures and arrivals in ${this.state.country}" />
        </Helmet>
        <Country
          data={this.state.airports}
          mapStyles={MapStyles}
          googleMapURL={this.state.mapUrl}
          center={this.state.center}
          loadingElement={(<Loading/>)}
          containerElement={<Container/>}
          mapElement={<Map/>}/>
      </Layout>
    )
  }
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 103vh;
`
const Loading = styled(Container)`
  background-color: ${colours.white};
`
const Map = styled(Container)``

export default CountryTemplate

export const pageQuery = graphql`
  query($id: String!) {
    airportsJson(id: { eq: $id }) {
      ...AirportFragment
    }
  }
`
