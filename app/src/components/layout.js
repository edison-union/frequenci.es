import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { GlobalStyle } from '../style/global.js'

const getPageTitle = (pageContext, defaultTitle) => {
  return pageContext && pageContext.name ? `${pageContext.name} ✈️ frequenci.es` : defaultTitle;
}

const getPageDescription = (pageContext, defaultDescription) => {
  return pageContext && pageContext.name ? `A data sonification of flight departures in ${pageContext.name}` : defaultDescription
}

const getPageOpenGraphImage = (baseUrl, pageContext, alt) => {
  return pageContext && pageContext.code ? `${baseUrl}/og-image/${pageContext.code}.png` : alt
}

const getPageUrl = (pageContext, defaultUrl) => {
  return pageContext && pageContext.code ? `${defaultUrl}/${pageContext.code}/` : defaultUrl;
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
              { name: "google-site-verification", content: data.site.siteMetadata.google_site_verification },
              { name: "msapplication-TileColor", content: "#f6f7f2" },
              { name: "msapplication-TileImage", content: "/mstile-144x144.png" },
              { name: "msapplication-square70x70logo", content: "/mstile-70x70.png" },
              { name: "msapplication-square150x150logo", content: "/mstile-150x150.png" },
              { name: "msapplication-wide310x150logo", content: "/mstile-310x150.png" },
              { name: "msapplication-square310x310logo", content: "/mstile-310x310.png" },
            ]}
          >
            <html lang="en"/>
            <link href="https://fonts.googleapis.com/css?family=Lora:400,700" rel="stylesheet" />
            <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/apple-touch-icon-57x57.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114.png" />
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/apple-touch-icon-72x72.png" />
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144.png" />
            <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/apple-touch-icon-60x60.png" />
            <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/apple-touch-icon-120x120.png" />
            <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/apple-touch-icon-76x76.png" />
            <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/apple-touch-icon-152x152.png" />
            <link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196" />
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
            <link rel="icon" type="image/png" href="/favicon-128.png" sizes="128x128" />
          </Helmet>
          <GlobalStyle/>
          <div>
          {Children.map(children, child => {
            if (child.type.target) {
              return child;
            }
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
