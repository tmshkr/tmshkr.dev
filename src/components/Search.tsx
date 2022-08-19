import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom"
import { SearchIcon } from "@heroicons/react/outline"
import { isMobileOrTablet } from "utils"
import "./Search.scss"

const { disableBodyScroll, enableBodyScroll } = require("body-scroll-lock")
const Mousetrap = require("mousetrap")
const { detect } = require("detect-browser")
const browser = detect()
const isMac = browser.os === "Mac OS"

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
    Mousetrap.bind(isMac ? "command+k" : "ctrl+k", openModal)
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
          {!isMobileOrTablet && (
            <span className="hidden sm:inline bg-slate-500 rounded-md ml-2 p-1">
              {isMac ? "⌘K" : "^K"}
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
    Mousetrap.bind("esc", this.props.closeModal)
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
          className="flex flex-col bg-white dark:bg-slate-800 w-full sm:max-w-lg max-h-full sm:max-h-[90%] mt-0 sm:mt-[5%] mx-auto sm:rounded-lg shadow-lg"
        >
          <InstantSearch searchClient={searchClient} indexName="pages">
            <div className="flex p-4">
              <SearchBox
                autoFocus
                className="w-full"
                onKeyDown={e => {
                  if (e.key === "Escape") this.props.closeModal()
                }}
              />
              <button onClick={this.props.closeModal}>
                <span className=" bg-slate-500 ml-2 p-2 rounded-[3px]">
                  esc
                </span>
              </button>
            </div>
            <div ref={this.hitsRef} className="overflow-scroll px-4">
              <Hits hitComponent={Hit} />
            </div>
          </InstantSearch>
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
