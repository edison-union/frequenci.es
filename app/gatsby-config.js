module.exports = {
  siteMetadata: {
    name: 'Frequencies',
    title: 'Frequencies',
    description: 'A data sonification of flight departures and arrivals',
    siteUrl: 'https://frequenci.es',
    keywords: 'Data sonification, airports, music for airports, ambient, flight patterns, arrivals, departures',
    google_site_verification: 'MJDFKPslztppagIFWP9KbeVemhd_jI70eeatBQ3-bRo',
    og: {
      image: 'https://frequenci.es/images/og-image.png'
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
        trackingId: '',
        head: true,
        cookieDomain: "frequenci.es"
      }
    },
    'gatsby-plugin-netlify'
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
