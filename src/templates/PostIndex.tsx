import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "components/SiteLayout"
import Seo from "components/seo"
import { getPathRoot } from "utils/path"

const PostIndex = ({ data, location, pageContext }) => {
  const { currentPage, numPages } = pageContext
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMdx.nodes

  const pathRoot = getPathRoot(location.pathname)

  return (
    <Layout location={location} title={siteTitle}>
      <ol className="list-none p-0">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2 className="m-0">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {currentPage < numPages && (
              <Link to={`/${pathRoot}/${currentPage + 1}`} rel="prev">
                ←
              </Link>
            )}
          </li>
          <li>
            {currentPage > 1 && (
              <Link to={`/${pathRoot}/${currentPage - 1}`} rel="next">
                →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default PostIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  query PaginatedIndex($skip: Int!, $limit: Int!, $glob: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      filter: { fields: { slug: { glob: $glob } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
      }
    }
  }
`
