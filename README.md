# frequenci.es

frequenci.es is a data visualisation and sonification of flight departures in real-time.

## About
This project is built with [React](https://reactjs.org/) and [Gatsby](https://www.gatsbyjs.org/).
### Features
- The flight callsign and departing airport are added to the departure board.
- Audio is played spatially relative to the centre of the the map. So if a plane takes off from an airport on the right of the map, you will hear it in the right headphone/speaker. Zoom in and pan around for the full effect!
- Text search

## Installation

```
cd app
yarn
yarn develop
```

For this to work, you will need to add a `.env.development` file into the `app` folder and populate it with the following environment variables.

| Variable Name | Value | Description
----|----|----
| AIRCRAFT_CEILING | 1000 | Clamp departure height to 1000, helps scaling the note that's played.
| API_REQUEST_CONCURRENCY | 2 | Number of API requests to request at once. Keep this below 3, as the API tends to return 503s after that.
| API_RETRY_TIMEOUT | 5000 | If a 503 is received, the queue will wait this number of seconds before retrying.
| API_URL_ARRIVALS | https://opensky-network.org/api/flights/arrival | Arrivals endpoint (currently not used)
| API_URL_DEPARTURES | https://opensky-network.org/api/flights/departure | Departures endpoint
| BEAT_VALUE | 4 | Quarter note
| BEATS_PER_BAR | 4 | 4 beats per bar, ergo time signature is 4/4
| GOOGLE_API_KEY | YOUR_API_KEY_HERE | Keep this secret!
| REQUEST_INTERVAL | 5000 | The number of milliseconds to wait before refreshing the request queue.
| TEMPO | 120 | Beats per minute
| TIME_SINCE_LAST_FLIGHT | 2 | Number of minutes to query e.g. (now - 2)

### Open graph images
I have included a script to generate open graph preview images from the local development version. This script uses [puppeteer](https://github.com/GoogleChrome/puppeteer) to take screenshots of each country and save it to the file system, which can then committed to the repo.

### Colours and map styles
Colours for UI elements and the Google Map are kept in a map inside `app/src/style/variables.js`. Colours are based off [this custom theme](https://color.adobe.com/cloud/aHR0cHM6Ly9jYy1hcGktYXNzZXRzLmFkb2JlLmlv/library/04640ae0-f44a-11e4-922e-7f7f083f222d/theme/7a14771b-907c-49ab-aaf0-6139bd5a55e2/) on [color.adobe.com](https://color.adobe.com/)

```js
export const colours = {
  white: '#fff',
  heading: '#191512',
  subheading: '#241e19',
  copy: '#54473a',
  overlay: 'rgba(36, 30, 25, .4)',
  navigation: {
    background: '#f6f7f2',
    text: '#001921',
    background_hover: '#fffffb',
    shadow: '#ecede8'
  },
  map: {
    water: '#f6f7f2',
    landscape: '#fffffb',
    road: '#f6f7f2'
  },
  button: {
    background: '#3FB0A9',
    hover: '#42BAB3',
    text: '#fffffb'
  },
  link: {
    default: '#544f4a',
    hover: '#bcb4ab'
  }
}
```
