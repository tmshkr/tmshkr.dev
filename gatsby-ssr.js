import React from "react"
import Layout from "./src/components/SiteLayout"

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}
