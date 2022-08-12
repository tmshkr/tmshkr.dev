import * as React from "react"
import Navbar from "./Navbar"
import LinkedIn from "@fortawesome/fontawesome-free/svgs/brands/linkedin.svg"
import GitHub from "@fortawesome/fontawesome-free/svgs/brands/github.svg"
import Hashnode from "@fortawesome/fontawesome-free/svgs/brands/hashnode.svg"
import "./SiteLayout.scss"

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl m-auto p-4 md:p-0">
        <main className="mt-4">{children}</main>
        <footer className="text-center mx-auto child:p-1 child:fill-stone-400 child-hover:fill-stone-500">
          <a
            href="https://www.linkedin.com/in/tmshkr/"
            title="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn />
          </a>
          <a
            href="https://github.com/tmshkr/"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </a>
          <a
            href="https://hashnode.com/@tmshkr"
            title="Hashnode"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Hashnode />
          </a>
        </footer>
      </div>
    </>
  )
}

export default Layout
