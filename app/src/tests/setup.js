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
