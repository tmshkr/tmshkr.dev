import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom"
import { SearchIcon } from "@heroicons/react/outline"

const { disableBodyScroll, enableBodyScroll } = require("body-scroll-lock")
const Mousetrap = require("mousetrap")

import "./Search.scss"

const searchClient = algoliasearch(
  "QOE9A9XPBA",
  "51ef76747e385c0819fc9a496322b785"
)

export function Search() {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    Mousetrap.bind(["command+k", "ctrl+k"], openModal)
  }, [])

  return (
    <InstantSearch searchClient={searchClient} indexName="pages">
      <div className="flex items-center ml-auto">
        <button
          className="dark:bg-slate-600 p-2 rounded-md"
          onClick={openModal}
        >
          <SearchIcon className="w-5 inline mr-2 -mt-1" />
          Search <span className="bg-slate-500 rounded-md ml-2 p-1">⌘K</span>
        </button>
      </div>
      {isOpen &&
        createPortal(<SearchModal {...{ closeModal }} />, document.body)}
    </InstantSearch>
  )
}

class SearchModal extends React.PureComponent<any, any> {
  private modal = React.createRef<HTMLDivElement>()

  componentDidMount() {
    Mousetrap.bind("esc", this.props.closeModal)
    disableBodyScroll(this.modal.current)
  }
  componentWillUnmount() {
    Mousetrap.unbind("esc")
    enableBodyScroll(this.modal.current)
  }

  render() {
    return (
      <div
        onClick={this.props.closeModal}
        className="bg-white/60 dark:bg-slate-500/60 dark:text-white fixed top-0 right-0 left-0 bottom-0"
      >
        <div
          ref={this.modal}
          onClick={e => e.stopPropagation()}
          className="flex flex-col bg-white dark:bg-slate-800 w-full sm:max-w-lg max-h-full sm:max-h-[80%] mt-0 sm:mt-24 mx-auto sm:rounded-lg shadow-lg"
        >
          <div className="flex p-4">
            <button
              onClick={this.props.closeModal}
              className="py-1 px-2 mr-2 bg-slate-500 rounded-[3px]"
            >
              esc
            </button>
            <SearchBox
              autoFocus
              className="w-full"
              onKeyDown={e => {
                if (e.key === "Escape") this.props.closeModal()
              }}
            />
          </div>
          <Hits hitComponent={Hit} className="overflow-scroll px-4" />
        </div>
      </div>
    )
  }
}

function Hit({ hit }) {
  return (
    <article>
      <h1>{hit.frontmatter.title}</h1>
      <p>{hit.frontmatter.date}</p>
      <p>{hit.excerpt}</p>
    </article>
  )
}
