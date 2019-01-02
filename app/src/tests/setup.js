require("dotenv").config({
  path: `.env.development`,
})

export const countries = require('../../data/airports.json')

export const country = "Australia"

export const center = {
  lat: -27,
  lng: 133
}

export const location = {
  search: ''
}

export const data = countries.filter((country) => country.country === 'AU')

export const mapBounds = {
  getNorthEast: () => {
    return {
      lat: () => -5.735616145222032,
      lng: () => 157.06766776125005
    }
  },
  getSouthWest: () => {
    return {
      lat: () => -45.92874659627811,
      lng: () => 110.09012869875005
    }
  }
}

export const testFlight = {
  arrivalAirportCandidatesCount: 0,
  arrival_airport: undefined,
  callsign: "JST674",
  departureAirportCandidatesCount: 45,
  departure_airport: {
    continent: "OC",
    coordinates: {
      lat: -27.384199142456055,
      lng: 153.11700439453125
    },
    elevation_ft: "13",
    gps_code: "YBBN",
    iata_code: "BNE",
    ident: "YBBN",
    iso_country: "AU",
    iso_region: "AU-QLD",
    local_code: null,
    municipality: "Brisbane",
    name: "Brisbane International Airport",
    timezone_id: "Australia/Brisbane",
    timezone_offset: 36000,
    type: "large_airport"
  },
  estArrivalAirport: null,
  estArrivalAirportHorizDistance: null,
  estArrivalAirportVertDistance: null,
  estDepartureAirport: "YBBN",
  estDepartureAirportHorizDistance: 2148,
  estDepartureAirportVertDistance: 186,
  firstSeen: 1546253573,
  icao24: "7c6b13",
  lastSeen: 1546253733,
  processed: true,
  processing: true,
  timestamp: 1546253738277,
  timezone_id: "Australia/Brisbane"
}
