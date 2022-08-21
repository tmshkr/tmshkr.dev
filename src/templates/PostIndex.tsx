import React, { useEffect } from "react"
import { Link, graphql, navigate } from "gatsby"
import ArrowLeft from "@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg"
import ArrowRight from "@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg"
import Seo from "components/seo"
import { getPathRoot } from "utils/path"

const Mousetrap = require("mousetrap")

const PostIndex = ({ data, location, pageContext }) => {
  const { currentPage, numPages } = pageContext
  const posts = data.allMdx.nodes

  const pathRoot = getPathRoot(location.pathname)
  const prevPage = currentPage > 1 ? `/${pathRoot}/${currentPage - 1}` : null
  const nextPage =
    currentPage < numPages ? `/${pathRoot}/${currentPage + 1}` : null

  useEffect(() => {
    Mousetrap.bind("left", () => {
      if (nextPage) navigate(nextPage)
    })
    Mousetrap.bind("right", () => {
      if (prevPage) navigate(prevPage)
    })
    return () => {
      Mousetrap.unbind("left")
      Mousetrap.unbind("right")
    }
  }, [location.key])

  return (
    <>
      <ol className="list-none p-0">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <Link to={post.fields.slug} itemProp="url">
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2 className="m-0">
                      <span itemProp="headline">{title}</span>
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
              </Link>
            </li>
          )
        })}
      </ol>
      <hr />
      <nav className="pagination">
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
            {nextPage && (
              <Link to={nextPage} rel="next">
                <span className="mr-2">
                  <ArrowLeft />
                </span>
              </Link>
            )}
          </li>
          <li>
            {prevPage && (
              <Link to={prevPage} rel="prev">
                <span className="ml-2">
                  <ArrowRight />
                </span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  )
}

export default PostIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ location }) => {
  const pathRoot = getPathRoot(location.pathname)
  return <Seo title={pathRoot} />
}

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
