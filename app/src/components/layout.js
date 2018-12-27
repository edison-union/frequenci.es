import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { colours } from '../style/variables'
import { GlobalStyle } from '../style/global.js'

const Layout = ({ children, location }) => (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              name,
              title,
              description,
              siteUrl,
              keywords,
              google_site_verification,
              og {
                image
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: data.site.siteMetadata.description },
              { name: 'keywords', content: data.site.siteMetadata.keywords },
              { itemprop: "image", content: data.site.siteMetadata.og.image },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: data.site.siteMetadata.title },
              { name: "twitter:description", content: data.site.siteMetadata.description },
              { name: "twitter:image:src", content: data.site.siteMetadata.og.image },
              { property: "og:title", content: data.site.siteMetadata.title },
              { property: "og:type", content: "website" },
              { property: "og:url", content: `${data.site.siteMetadata.siteUrl}`},
              { property: "og:image:type", content: "image/png" },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:description", content: data.site.siteMetadata.description },
              { property: "og:site_name", content: data.site.siteMetadata.name },
              { name: "google-site-verification", content: data.site.siteMetadata.google_site_verification }
            ]}
          >
            <html lang="en" style={{ backgroundColor: colours.map.water }}/>
            <link rel="canonical" href="https://frequenci.es/" />
            <link href="https://fonts.googleapis.com/css?family=Bitter:400,700" rel="stylesheet" />
          </Helmet>
          <GlobalStyle/>
          <div>
          {Children.map(children, child => {
            return cloneElement(child, { location } );
          })}
          </div>
        </>
      )}
    />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired
}

export default Layout
