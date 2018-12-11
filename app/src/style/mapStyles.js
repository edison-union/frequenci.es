import { colours } from '../style/variables'

const MapStyles = [{
    "elementType": "labels",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "elementType": "geometry",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "on"
      },
      {
        "color": colours.map.road
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [{
        "color": colours.map.water
      },
      {
        "visibility": "on"
      }
    ]
  }
]

export default MapStyles;
