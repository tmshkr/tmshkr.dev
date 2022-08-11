import * as React from "react"
import Navbar from "./Navbar"
declare const __PATH_PREFIX__: string

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <>
      <Navbar />
      <div
        className="max-w-2xl m-auto p-4 md:p-0"
        data-is-root-path={isRootPath}
      >
        {/* <header className="global-header">{header}</header> */}
        <main className="mt-4">{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

export default Layout
