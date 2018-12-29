import { graphql } from 'gatsby'

export const AirportFragment = graphql`
  fragment AirportFragment on AirportsJson {
    id,
    country,
    name,
    center {
      lat,
      lng
    },
    airports {
      continent
      coordinates {
        lat,
        lng
      }
      elevation_ft
      gps_code
      iata_code
      ident
      iso_country
      iso_region
      local_code
      municipality
      name
      type
      timezone_id
      timezone_offset
    }
  }
`
