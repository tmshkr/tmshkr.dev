const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const Post = path.resolve(`./src/templates/Post.tsx`)
  const PostIndex = path.resolve(`./src/templates/PostIndex.tsx`)

  await createCollection(graphql, createPage, Post, "blog")
  await createCollection(graphql, createPage, Post, "projects")
  await createCollection(graphql, createPage, Post)
  await createPaginatedIndex(graphql, createPage, PostIndex, "blog")
  await createPaginatedIndex(graphql, createPage, PostIndex, "projects")
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

async function createCollection(graphql, createPage, component, slug) {
  const result = await graphql(generateQuery(slug))

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMdx.nodes

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

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

async function createPaginatedIndex(graphql, createPage, component, slug) {
  const result = await graphql(generateQuery(slug))

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMdx.nodes

  const postsPerPage = 5
  const numPages = Math.ceil(posts.length / postsPerPage)

  createPage({
    path: `/${slug}`,
    component,
    context: {
      limit: postsPerPage,
      skip: 0,
      numPages,
      currentPage: 1,
      glob: `/${slug}/*/`,
    },
  })

  for (let i = 0; i < numPages; i++) {
    createPage({
      path: `/${slug}/${i + 1}`,
      component,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        glob: `/${slug}/*/`,
      },
    })
  }
}

function generateQuery(slug) {
  const glob = slug ? `/${slug}/*/` : `/*/`
  return `
  query {
    allMdx(
      filter: {fields: {slug: {glob: "${glob}"}}}
      sort: {fields: [frontmatter___date], order: ASC}
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
}
