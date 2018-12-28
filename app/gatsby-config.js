require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    name: 'frequenci.es',
    title: 'frequenci.es',
    description: 'Music from airports. A data sonification of flight departures from around the world.',
    siteUrl: 'https://frequenci.es',
    keywords: 'Data sonification, airports, music for airports, ambient, flight patterns, departures',
    google_site_verification: 'xojYv-QrCVOoJEDqvRH7TGN9Fw-30PBeQUmS9wNCGg4',
    og: {
      image: 'https://frequenci.es/og-image/default.png'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|cache|data|public)/,
        options: {
          emitWarning: true,
          failOnError: true
        }
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
      },
    },
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-127969191-2',
        head: true,
        cookieDomain: "frequenci.es"
      }
    },
    'gatsby-plugin-netlify',
    'gatsby-plugin-offline',
    'gatsby-plugin-sitemap'
  ],
}
