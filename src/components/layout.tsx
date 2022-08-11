import * as React from "react"
import { Link } from "gatsby"
import Navbar from "./Navbar"
declare const __PATH_PREFIX__: string

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="max-w-2xl m-auto p-4 md:p-0" data-is-root-path={isRootPath}>
      <Navbar />
      <header className="global-header">{header}</header>
      <main className="mt-4">{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
