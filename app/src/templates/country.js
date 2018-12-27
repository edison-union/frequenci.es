import * as PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import AirTrafficControl from '../components/airTrafficControl'
import { AirportConstants } from '../constants/airports'

class CountryTemplate extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      airportsJson: PropTypes.object.isRequired,
    }),
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
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
    }
  }

  componentDidMount() {
    const { data } = this.props;
    const filtered = data.airportsJson.airports.filter((airport) => {
      return AirportConstants[airport.type]
    });

    this.setState({ airports: filtered, center: data.airportsJson.center });

    filtered.forEach((airport) => {
      this.setState(prevState => ({
        queue: [...prevState.queue, airport.gps_code]
      }));
    });
  }

  render() {
    const { location, pageContext } = this.props;
    return (
      <Layout location={location} pageContext={pageContext}>
        <AirTrafficControl country={pageContext.name} data={this.state.airports} center={this.state.center}/>
      </Layout>
    )
  }
}

export default CountryTemplate

export const pageQuery = graphql`
  query($id: String!) {
    airportsJson(id: { eq: $id }) {
      ...AirportFragment
    }
  }
`
