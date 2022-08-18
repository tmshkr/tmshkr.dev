import React, {
  useState,
  useCallback,
  useRef,
  createContext,
  useContext,
  useEffect,
} from "react"
import { createPortal } from "react-dom"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-hooks-web"
import { SearchIcon } from "@heroicons/react/outline"

const { disableBodyScroll, enableBodyScroll } = require("body-scroll-lock")

import "./Search.scss"

const searchClient = algoliasearch(
  "QOE9A9XPBA",
  "51ef76747e385c0819fc9a496322b785"
)
function Hit({ hit }) {
  return (
    <article>
      <h1>{hit.frontmatter.title}</h1>
      <p>{hit.frontmatter.date}</p>
      <p>{hit.excerpt}</p>
    </article>
  )
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const scrollDiv = useRef(null)

  const closeModal = () => {
    enableBodyScroll(scrollDiv.current)
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(scrollDiv.current)
    }
  }, [isOpen])

  return (
    <InstantSearch searchClient={searchClient} indexName="pages">
      <div className="flex items-center ml-auto">
        <button
          className="dark:bg-slate-600 py-2 px-4 rounded-md"
          onFocus={openModal}
        >
          <SearchIcon className="w-5 inline mr-2 -mt-1" />
          Search
        </button>
      </div>
      {isOpen &&
        createPortal(
          <div
            onClick={closeModal}
            className="bg-white/60 dark:bg-slate-500/60 backdrop-blur-sm dark:text-white absolute top-0 right-0 left-0 bottom-0"
          >
            <div
              ref={scrollDiv}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 max-w-lg max-h-[100%] sm:max-h-[80%] min-h-[33%] overflow-scroll bg-scroll mt-0 sm:mt-24 mx-auto p-4 rounded-lg shadow-lg"
            >
              <SearchBox />
              <Hits hitComponent={Hit} />
            </div>
          </div>,
          document.body
        )}
    </InstantSearch>
  )
}
