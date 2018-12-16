import * as markerLarge from '../images/marker-large.svg'
import * as markerLargeActive from '../images/marker-large-active.svg'
import * as markerMedium from '../images/marker-medium.svg'
import * as markerMediumActive from '../images/marker-medium-active.svg'
import * as markerSmall from '../images/marker-small.svg'
import * as markerSmallActive from '../images/marker-small-active.svg'

export const AirportConstants = {
  large_airport: {
    key: 'large',
    colour: '#BF3541',
    markers: {
      default: markerLarge,
      active: markerLargeActive,
      size: 6,
    },
    sounds: [
      '/sounds/ping-c.wav',
      '/sounds/ping-d.wav',
      '/sounds/ping-e.wav'
    ],
  },
  medium_airport: {
    key: 'medium',
    colour: '#F08A2A',
    markers: {
      default: markerMedium,
      active: markerMediumActive,
      size: 3,
    },
    sounds: [
      '/sounds/warble-c.wav',
      '/sounds/warble-d.wav',
      '/sounds/warble-e.wav'
    ],
  },
  small_airport: {
    key: 'small',
    colour: '#1D89BC',
    markers: {
      default: markerSmall,
      active: markerSmallActive,
      size: 2,
    },
    sounds: [
      '/sounds/hum-c.wav',
      '/sounds/hum-d.wav',
      '/sounds/hum-e.wav'
    ],
  }
}
