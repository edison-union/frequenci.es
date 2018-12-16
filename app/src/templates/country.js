import * as PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import AirTrafficControl from '../components/airTrafficControl'
import MapStyles from '../style/mapStyles'
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

  getStaticMapUrl(center) {
    let url = `https://maps.googleapis.com/maps/api/staticmap?&size=1200x615&zoom=6&center=${center.lat},${center.lng}&format=png&scale=2&`;
    url += MapStyles.map((style) => {
      let output = `style=`;

      if (style.featureType) {
        output += `feature:${style.featureType}|`
      }

      if (style.elementType) {
        output += `element:${style.elementType}|`
      }

      if (style.stylers) {
        output += style.stylers.map((styler) => {
          return Object.keys(styler).map((key) => {
            return `${key}:${styler[key].replace('#', '0x')}`;
          });
        }).join('|')
      }

      return output;
    }).join('&');

    return encodeURI(`${url}&key=${process.env.GOOGLE_API_KEY}`);
  }

  render() {
    const { location, pageContext } = this.props;

    return (
      <Layout location={location}>
        <Helmet>
          <title>{`🛫 ${pageContext.name} 🎶`}</title>
          <meta name="description" content="A data sonification of flight departures in ${pageContext.name}" />
          <meta name="og:image" url={this.getStaticMapUrl(pageContext.center)}/>
        </Helmet>
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
