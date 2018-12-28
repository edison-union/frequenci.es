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
      '/sounds/ping-c.mp3',
      '/sounds/ping-d.mp3',
      '/sounds/ping-e.mp3',
      '/sounds/ping-f.mp3',
      '/sounds/ping-g.mp3',
      '/sounds/ping-a.mp3',
      '/sounds/ping-b.mp3'
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
      '/sounds/whale-c.mp3',
      '/sounds/whale-d.mp3',
      '/sounds/whale-e.mp3',
      '/sounds/whale-f.mp3',
      '/sounds/whale-g.mp3',
      '/sounds/whale-a.mp3',
      '/sounds/whale-b.mp3'
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
      '/sounds/grind-c.mp3',
      '/sounds/grind-d.mp3',
      '/sounds/grind-e.mp3',
      '/sounds/grind-e.mp3',
      '/sounds/grind-e.mp3',
      '/sounds/grind-e.mp3',
      '/sounds/grind-e.mp3'
    ],
  }
}
