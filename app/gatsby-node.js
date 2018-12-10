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
                name
              }
            }
          }
        }
        `
      ).then(result => {
        if (result.errors) {
          reject(new Error(result.errors))
        }

        const postTemplate = path.resolve(`src/templates/country.js`)

        result.data.allAirportsJson.edges.forEach((edge) => {
          createPage({
            path: `/${slug(edge.node.country.toLowerCase())}/`,
            component: slash(postTemplate),
            context: {
              id: edge.node.id,
              name: edge.node.name
            },
          })
        });

        return
      })
    )
  })
}
