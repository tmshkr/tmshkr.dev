import React, { useState } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { MoonIcon, MenuIcon } from "@heroicons/react/outline"
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import { Search } from "./Search"
import { getPathRoot } from "utils/path"

declare var window: any
declare var document: any

const toggleTheme = () => {
  window.__setPreferredTheme(window.__theme === "dark" ? "light" : "dark")
}

const activeItemClasses =
  "border-indigo-200 text-gray-900 dark:text-gray-300 border-b-2 font-medium no-underline"
const inactiveItemClasses =
  "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 border-b-2 font-medium no-underline"
const activePathClassesMobile =
  "bg-indigo-50 dark:bg-slate-500 border-indigo-500 text-indigo-700 dark:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
const inactivePathClassesMobile =
  "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"

export default function Navbar({ location }) {
  const pathRoot = getPathRoot(location.pathname)
  const navPaths = [
    { slug: "about", label: "📖 about" },
    { slug: "blog", label: "📓 blog" },
    { slug: "projects", label: "💻 projects" },
  ]

  return (
    <Disclosure as="nav">
      {({ open, close }) => {
        if (open) {
          document.documentElement.style.cursor = "pointer"
          window.onclick = close
        } else if (
          typeof document !== "undefined" &&
          typeof window !== "undefined"
        ) {
          window.onclick = null
          document.documentElement.style.cursor = null
        }
        return (
          <>
            <div className="max-w-2xl mx-auto px-4 md:px-0 flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/about"
                  className="text-gray-500 dark:text-gray-400 no-underline"
                >
                  tmshkr
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navPaths.map(({ slug, label }) => (
                    <Link
                      to={`/${slug}`}
                      key={slug}
                      className={
                        slug === pathRoot
                          ? activeItemClasses
                          : inactiveItemClasses
                      }
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <Search {...{ location }} />
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={toggleTheme}
                >
                  <MoonIcon
                    className="h-6 w-6 dark:fill-current"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={e => {
                    e.stopPropagation()
                    if (open) toggleTheme()
                  }}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <MoonIcon
                      className="h-6 w-6 dark:fill-current"
                      aria-hidden="true"
                    />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navPaths.map(({ slug, label }) => (
                  <Disclosure.Button
                    as="a"
                    key={`${slug}#mobile`}
                    onClick={() => navigate(`/${slug}`)}
                    className={
                      slug === pathRoot
                        ? activePathClassesMobile
                        : inactivePathClassesMobile
                    }
                  >
                    {label}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )
      }}
    </Disclosure>
  )
}
