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
      default: {
        icon: markerLarge,
        size: 12
      },
      active: {
        icon: markerLargeActive,
        size: 48
      },
    },
    sounds: [
      'https://frequencies.netlify.com/sounds/ping-c.wav',
      'https://frequencies.netlify.com/sounds/ping-d.wav',
      'https://frequencies.netlify.com/sounds/ping-e.wav',
      'https://frequencies.netlify.com/sounds/ping-f.wav',
      'https://frequencies.netlify.com/sounds/ping-g.wav',
      'https://frequencies.netlify.com/sounds/ping-a.wav',
      'https://frequencies.netlify.com/sounds/ping-b.wav'
    ],
  },
  medium_airport: {
    key: 'medium',
    colour: '#F08A2A',
    markers: {
      default: {
        icon: markerMedium,
        size: 6
      },
      active: {
        icon: markerMediumActive,
        size: 24
      },
    },
    sounds: [
      'https://frequencies.netlify.com/sounds/whale-c.wav',
      'https://frequencies.netlify.com/sounds/whale-d.wav',
      'https://frequencies.netlify.com/sounds/whale-e.wav',
      'https://frequencies.netlify.com/sounds/whale-f.wav',
      'https://frequencies.netlify.com/sounds/whale-g.wav',
      'https://frequencies.netlify.com/sounds/whale-a.wav',
      'https://frequencies.netlify.com/sounds/whale-b.wav'
    ],
  },
  small_airport: {
    key: 'small',
    colour: '#1D89BC',
    markers: {
      default: {
        icon: markerSmall,
        size: 3
      },
      active: {
        icon: markerSmallActive,
        size: 12
      },
    },
    sounds: [
      'https://frequencies.netlify.com/sounds/grind-c.wav',
      'https://frequencies.netlify.com/sounds/grind-d.wav',
      'https://frequencies.netlify.com/sounds/grind-e.wav',
      'https://frequencies.netlify.com/sounds/grind-e.wav',
      'https://frequencies.netlify.com/sounds/grind-e.wav',
      'https://frequencies.netlify.com/sounds/grind-e.wav',
      'https://frequencies.netlify.com/sounds/grind-e.wav'
    ],
  }
}
