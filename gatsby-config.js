require("dotenv").config()

const config = {
  siteMetadata: {
    title: `tmshkr | Tim Shaker`,
    author: {
      name: `Tim Shaker`,
      summary: `Tim Shaker is a full-stack engineer in Southern California`,
    },
    description: `Tim Shaker is a full-stack engineer in Southern California`,
    siteUrl: `https://tmshkr.dev/`,
    social: {
      twitter: `tmshkr`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
          {
            resolve: "gatsby-remark-mermaid",
            options: {
              theme: "forest",
              mermaidOptions: {
                sequence: {
                  useMaxWidth: true,
                },
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_TRACKING_ID,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `tmshkr.com`,
        short_name: `tmshkr.com`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `./static/tm.png`,
      },
    },
    "gatsby-plugin-postcss",
    "gatsby-plugin-root-import",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.svg$/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          includePaths: ["node_modules"],
        },
      },
    },
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
        queries: [
          {
            query: `{
              allMdx(sort: {fields: [frontmatter___date], order: DESC}) {
                nodes {
                  id
                  content: excerpt(pruneLength: 2147483647)
                  fields {
                    slug
                  }
                  frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    title
                  }
                }
              }
            }`,
            transformer: ({ data }) => data.allMdx.nodes,
            indexName: process.env.ALGOLIA_INDEX_NAME,
          },
        ],
        chunkSize: 10000, // default: 1000
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-catch-links`,
  ],
}

if (process.env.NODE_ENV === "development") {
  config.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/drafts`,
      name: `drafts`,
    },
  })
  // config.flags = {
  //   DEV_SSR: true,
  // }
}

module.exports = config
