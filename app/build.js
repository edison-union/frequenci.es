const fs = require('fs')
fs.writeFileSync('./.env.production', `
AIRCRAFT_CEILING=${process.env.AIRCRAFT_CEILING}
GOOGLE_API_KEY=${process.env.GOOGLE_API_KEY}
API_URL_ARRIVALS=${process.env.API_URL_ARRIVALS}
API_URL_DEPARTURES=${process.env.API_URL_DEPARTURES}
REQUEST_INTERVAL=${process.env.REQUEST_INTERVAL}
TEMPO=${process.env.TEMPO}
BEATS_PER_BAR=${process.env.BEATS_PER_BAR}
BEAT_VALUE=${process.env.BEAT_VALUE}
`);
