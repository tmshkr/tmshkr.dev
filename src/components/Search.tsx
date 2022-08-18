import React, { useState } from "react"
import { createPortal } from "react-dom"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-hooks-web"
import { SearchIcon } from "@heroicons/react/outline"

const { disableBodyScroll, enableBodyScroll } = require("body-scroll-lock")
const Mousetrap = require("mousetrap")

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

  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="pages">
      <div className="flex items-center ml-auto">
        <button
          className="dark:bg-slate-600 py-2 px-4 rounded-md"
          onClick={openModal}
        >
          <SearchIcon className="w-5 inline mr-2 -mt-1" />
          Search
        </button>
      </div>
      {isOpen &&
        createPortal(<SearchModal {...{ closeModal }} />, document.body)}
    </InstantSearch>
  )
}

class SearchModal extends React.Component<any, any> {
  private scrollDiv = React.createRef<HTMLDivElement>()

  componentDidMount() {
    Mousetrap.bind("esc", this.props.closeModal)
    disableBodyScroll(this.scrollDiv.current)
  }
  componentWillUnmount() {
    Mousetrap.unbind("esc")
    enableBodyScroll(this.scrollDiv.current)
  }

  render() {
    return (
      <div
        onClick={this.props.closeModal}
        className="bg-white/60 dark:bg-slate-500/60 backdrop-blur-sm dark:text-white fixed top-0 right-0 left-0 bottom-0"
      >
        <div
          ref={this.scrollDiv}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 w-full sm:max-w-lg max-h-[100%] sm:max-h-[80%] min-h-[33%] overflow-scroll mt-0 sm:mt-24 mx-auto p-4 rounded-b-lg sm:rounded-lg shadow-lg"
        >
          <div className="flex">
            <button
              onClick={this.props.closeModal}
              className="py-1 px-2 mr-2 bg-slate-500 rounded-[3px]"
            >
              esc
            </button>
            <SearchBox className="w-full" />
          </div>
          <Hits hitComponent={Hit} />
        </div>
      </div>
    )
  }
}
