import React, { useEffect } from "react"
import { Link, graphql, navigate } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import ArrowLeft from "@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg"
import ArrowRight from "@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg"
import Seo from "components/seo"
import "./Post.scss"

const Mousetrap = require("mousetrap")

const Post = ({ data: { previous, next, site, mdx: post }, location }) => {
  useEffect(() => {
    Mousetrap.bind("left", () => {
      if (previous) navigate(previous.fields.slug)
    })
    Mousetrap.bind("right", () => {
      if (next) navigate(next.fields.slug)
    })
    return () => {
      Mousetrap.unbind("left")
      Mousetrap.unbind("right")
    }
  }, [location.key])

  return (
    <>
      <article
        className="Post font-serif"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="my-4">
          {post.frontmatter.title !== "about" && (
            <>
              <h1 itemProp="headline" className="mb-0">
                {post.frontmatter.title}
              </h1>
              <p className="font-sans m-0">{post.frontmatter.date}</p>
            </>
          )}
        </header>
        <MDXRenderer frontmatter={post.frontmatter}>{post.body}</MDXRenderer>
        <hr />
      </article>
      <nav className="pagination">
        <ul className="list-none p-0 m-0 mt-4 child:inline-block">
          <li className="mr-4">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                <span className="mr-2">
                  <ArrowLeft />
                </span>
                {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className="float-right">
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}{" "}
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

export const Head = ({ data: { mdx: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default Post

export const pageQuery = graphql`
  query PostById($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        url
        github_repo
        attachments {
          publicURL
        }
      }
    }
    previous: mdx(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
