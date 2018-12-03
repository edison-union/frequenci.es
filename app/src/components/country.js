import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import PropTypes from 'prop-types'
import PQueue from 'p-queue'
import * as marker from '../images/marker.svg'
import fetch from 'isomorphic-fetch'
import moment from 'moment-timezone';
import AudioService from '../services/audio';

class Country extends Component {
  componentDidMount() {
    this.queueRequests();
    this.audioService = new AudioService();
  }

  componentWillUnmount() {
    this.audioService.destroy();
  }

  queueRequests() {
    const { data } = this.props;
    const queue = new PQueue({ concurrency: 2 });
    const now = moment();

    data.forEach((airport) => {
      const time = now.clone();
      time.tz(airport.timezone_id);
      const end = time.unix();
      const start = time.add(-15, 'minutes').unix();

      queue.add(() =>
        fetch(`${process.env.API_URL_ARRIVALS}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.length) {
              this.audioService.arrivalSound();
            }
          })
          .catch(() => {
            //console.log(err);
          })
      );

      queue.add(() =>
        fetch(`${process.env.API_URL_DEPARTURES}?airport=${airport.gps_code}&begin=${start}&end=${end}`)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.length) {
              this.audioService.departureSound();
            }
          })
          .catch(() => {
          //  console.log(err);
          })
      );
    });

    queue.onIdle().then(() => {
      setTimeout(() => this.queueRequests(), process.env.REQUEST_INTERVAL)
    });
  }

  render() {
    const { data, center, mapStyles } = this.props;

    return (<GoogleMap defaultOptions={{ styles: mapStyles, disableDefaultUI: true }} defaultZoom={5} defaultCenter={ center }>
      {data.map((airport) => {
        return <Marker key={airport.gps_code}
          icon={{
             url: marker
           }}
           position={airport.coordinates} />
      })}
    </GoogleMap>);
  }
}

Country.propTypes = {
  data: PropTypes.array.isRequired,
  mapStyles: PropTypes.array.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired
}

export default withScriptjs(withGoogleMap(Country));
