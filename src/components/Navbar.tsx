import * as React from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { MoonIcon, MenuIcon, XIcon } from "@heroicons/react/outline"
import { Link } from "gatsby"

declare var window: any

const activeItemClasses =
  "border-indigo-200 text-gray-900 border-b-2 font-medium no-underline"
const inactiveItemClasses =
  "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2 font-medium no-underline"

export default function Navbar() {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="max-w-2xl mx-auto px-4 md:px-0">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-gray-500 no-underline">
                  tmshkr
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                  <a href="#" className={activeItemClasses}>
                    About
                  </a>
                  <a href="#" className={inactiveItemClasses}>
                    Blog
                  </a>
                  <a href="#" className={inactiveItemClasses}>
                    Projects
                  </a>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="dark:bg-black p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MoonIcon
                    className="h-6 w-6 dark:fill-current"
                    aria-hidden="true"
                    onClick={() =>
                      window.__setPreferredTheme(
                        window.__theme === "dark" ? "light" : "dark"
                      )
                    }
                  />
                </button>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                About
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Blog
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Projects
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
