import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  connectStateResults,
} from "react-instantsearch-dom"
import { SearchIcon } from "@heroicons/react/outline"
import { isMobileOrTablet, isMac } from "utils/browser"
import { debouncePromise } from "utils/promise"
import "./Search.scss"

const { disableBodyScroll, enableBodyScroll } = require("body-scroll-lock")
const Mousetrap = require("mousetrap")

const algoliaClient = algoliasearch(
  "QOE9A9XPBA",
  "51ef76747e385c0819fc9a496322b785"
)

const debouncedSearch = debouncePromise(algoliaClient.search, 300)

const searchClient = {
  ...algoliaClient,
  search(requests) {
    console.log(requests)
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      })
    }

    return debouncedSearch(requests)
  },
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [shortcut, setShortcut] = useState("")

  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isMobileOrTablet) {
      Mousetrap.bind(isMac ? "command+k" : "ctrl+k", () => {
        openModal()
        return false
      })
      setShortcut(isMac ? "⌘K" : "^K")
    }
  }, [])

  return (
    <>
      <div className="flex items-center ml-auto">
        <button
          className="dark:bg-slate-600 p-2 rounded-md"
          onClick={openModal}
        >
          <SearchIcon className="w-5 inline mr-2 -mt-1" />
          Search{" "}
          {shortcut && (
            <span className="hidden sm:inline bg-slate-500 rounded-md ml-2 p-1">
              {shortcut}
            </span>
          )}
        </button>
      </div>
      {isOpen &&
        createPortal(<SearchModal {...{ closeModal }} />, document.body)}
    </>
  )
}

class SearchModal extends React.PureComponent<any, any> {
  private hitsRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    Mousetrap.bind("esc", () => {
      this.props.closeModal()
      return false
    })
    disableBodyScroll(this.hitsRef.current)
  }
  componentWillUnmount() {
    Mousetrap.unbind("esc")
    enableBodyScroll(this.hitsRef.current)
  }

  render() {
    return (
      <div
        onClick={this.props.closeModal}
        className="bg-white/60 dark:bg-slate-500/60 dark:text-white fixed top-0 right-0 left-0 bottom-0"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="flex flex-col bg-white dark:bg-slate-800 w-full sm:max-w-lg max-h-full sm:max-h-[90vh] mt-0 sm:mt-[5vh] mx-auto sm:rounded-lg shadow-lg"
        >
          <InstantSearch searchClient={searchClient} indexName="pages">
            <div className="flex p-4">
              <SearchBox
                autoFocus
                className="w-full"
                onKeyDown={e => {
                  if (e.key === "Escape") {
                    e.preventDefault()
                    this.props.closeModal()
                  }
                }}
              />
              <button onClick={this.props.closeModal}>
                <span className=" bg-slate-500 ml-2 p-2 rounded-[3px]">
                  esc
                </span>
              </button>
            </div>
            <div ref={this.hitsRef} className="overflow-scroll px-4">
              <StateResults />
              <Hits hitComponent={Hit} />
            </div>
          </InstantSearch>
        </div>
      </div>
    )
  }
}

function Hit({ hit }) {
  console.log(hit)
  return (
    <article>
      <h1 className="m-0">
        <Highlight attribute="frontmatter.title" hit={hit} />
      </h1>
      <p className="m-0">{hit.frontmatter.date}</p>
      <p>
        <Highlight attribute="content" hit={hit} />
      </p>
    </article>
  )
}
const StateResults = connectStateResults(({ searchResults }) => {
  if (!searchResults) return null
  const { nbHits, query } = searchResults
  return <div>{query && `${nbHits} result${nbHits === 1 ? "" : "s"}`}</div>
})
