const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const blogPostsQuery = `
query BlogPosts {
  allMdx(
    filter: {fields: {slug: {glob: "/blog/*/"}}}
    sort: {fields: [frontmatter___date], order: DESC}
    limit: 1000
  ) {
    nodes {
      id
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
}`

const projectQuery = `
query Projects {
  allMdx(
    filter: {fields: {slug: {glob: "/projects/*/"}}}
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    nodes {
      id
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
}`

const topLevelQuery = `
query TopLevelPages {
  allMdx(filter: {fields: {slug: {glob: "/*/"}}}) {
    nodes {
      id
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
}`

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const Post = path.resolve(`./src/templates/Post.tsx`)

  await createCollection(graphql, createPage, Post, blogPostsQuery)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

async function createCollection(
  graphql,
  createPage,
  component,
  query,
  includeAdjacent = true
) {
  const result = await graphql(query)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMdx.nodes

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      let previousPostId
      let nextPostId
      if (includeAdjacent) {
        previousPostId = index === 0 ? null : posts[index - 1].id
        nextPostId = index === posts.length - 1 ? null : posts[index + 1].id
      }

      createPage({
        path: post.fields.slug,
        component,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}
