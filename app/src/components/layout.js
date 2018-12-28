import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { GlobalStyle } from '../style/global.js'

const getPageTitle = (pageContext, defaultTitle) => {
  return pageContext ? `${pageContext.name} ✈️ frequenci.es` : defaultTitle;
}

const getPageDescription = (pageContext, defaultDescription) => {
  return pageContext ? `A data sonification of flight departures in ${pageContext.name}` : defaultDescription
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
            title={ getPageTitle(pageContext, data.site.siteMetadata.title) }
            meta={[
              { name: 'description', content: getPageDescription(pageContext, data.site.siteMetadata.description) },
              { name: 'keywords', content: data.site.siteMetadata.keywords },
              { itemprop: "image", content: data.site.siteMetadata.og.image },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: getPageTitle(pageContext, data.site.siteMetadata.title) },
              { name: "twitter:description", content: getPageDescription(pageContext, data.site.siteMetadata.description) },
              { name: "twitter:image:src", content: getPageOpenGraphImage(data.site.siteMetadata.siteUrl, pageContext, data.site.siteMetadata.og.image) },
              { property: "og:title", content: getPageTitle(pageContext, data.site.siteMetadata.title) },
              { property: "og:type", content: "website" },
              { property: "og:url", content: getPageUrl(pageContext, data.site.siteMetadata.siteUrl) },
              { property: "og:image", content: getPageOpenGraphImage(data.site.siteMetadata.siteUrl, pageContext, data.site.siteMetadata.og.image) },
              { property: "og:image:type", content: "image/png" },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:description", content: getPageDescription(pageContext, data.site.siteMetadata.description) },
              { property: "og:site_name", content: data.site.siteMetadata.name },
              { property: "og:updated_time", content: new Date().toISOString() },
              { name: "google-site-verification", content: data.site.siteMetadata.google_site_verification }
            ]}
          >
            <html lang="en"/>
            <link href="https://fonts.googleapis.com/css?family=Lora:400,700" rel="stylesheet" />
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
