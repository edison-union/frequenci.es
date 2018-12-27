import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { colours } from '../style/variables'
import { GlobalStyle } from '../style/global.js'

const getPageTitle = (pageContext) => {
  return pageContext ? `${pageContext.name} 🛫 frequenci.es}` : 'frequenci.es';
}

const getPageDescription = (pageContext) => {
  return pageContext ? `A data sonification of flight departures in ${pageContext.name}` : 'Music from airports'
}

const getPageOpenGraphImage = (baseUrl, pageContext, alt) => {
  return pageContext ? `${baseUrl}/og-images/${pageContext.code}.png` : alt
}

const getPageUrl = (pageContext, defaultUrl) => {
  return pageContext ? `${defaultUrl}/${pageContext.code}/` : defaultUrl;
}

const Layout = ({ children, pageContext, location }) => (
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
            title={ getPageDescription(pageContext) }
            meta={[
              { name: 'description', content: getPageDescription(pageContext) },
              { name: 'keywords', content: data.site.siteMetadata.keywords },
              { itemprop: "image", content: data.site.siteMetadata.og.image },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: getPageTitle(pageContext) },
              { name: "twitter:description", content: getPageDescription(pageContext) },
              { name: "twitter:image:src", content: getPageOpenGraphImage(data.site.siteMetadata.siteUrl, pageContext, data.site.siteMetadata.og.image) },
              { property: "og:title", content: getPageTitle(pageContext) },
              { property: "og:type", content: "website" },
              { property: "og:url", content: getPageUrl(pageContext, data.site.siteMetadata.siteUrl) },
              { property: "og:image", content: getPageOpenGraphImage(data.site.siteMetadata.siteUrl, pageContext, data.site.siteMetadata.og.image) },
              { property: "og:image:type", content: "image/png" },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:description", content: getPageDescription(pageContext) },
              { property: "og:site_name", content: data.site.siteMetadata.name },
              { name: "google-site-verification", content: data.site.siteMetadata.google_site_verification }
            ]}
          >
            <html lang="en" style={{ backgroundColor: colours.map.water }}/>
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
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
}

export default Layout
