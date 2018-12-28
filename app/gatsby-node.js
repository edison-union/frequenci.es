/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const Promise = require('bluebird')
const path = require('path')
const slug = require('slug')
const slash = require('slash')

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
        {
          allAirportsJson {
            edges {
              node {
                id,
                country,
                name,
                center {
                  lat,
                  lng
                },
                airports {
                  name
                }
              }
            }
          }
        }
        `
      ).then(result => {
        if (result.errors) {
          reject(new Error(result.errors))
        }

        const countryTemplate = path.resolve(`src/templates/country.js`)
        const indexTemplate = path.resolve(`src/templates/index.js`)

        const countries = result.data.allAirportsJson.edges.map((edge) => {
          return {
            name: edge.node.name,
            code: edge.node.country.toLowerCase(),
            airports: edge.node.airports.length
          }
        });


        // Index page
        createPage({
          path : '/',
          component: slash(indexTemplate),
          context: {
            countries: countries
          }
        });

        result.data.allAirportsJson.edges.forEach((edge) => {
          createPage({
            path: `/${slug(edge.node.country.toLowerCase())}/`,
            component: slash(countryTemplate),
            context: {
              id: edge.node.id,
              name: edge.node.name,
              code: edge.node.country.toLowerCase(),
              center: edge.node.center,
              countries: countries
            },
          })
        });

        return
      })
    )
  })
}
