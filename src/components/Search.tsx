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
  return (
    <InstantSearch searchClient={searchClient} indexName="pages">
      {isOpen ? (
        createPortal(
          <div
            onClick={() => setIsOpen(false)}
            className="bg-white/60 dark:bg-slate-500/60 backdrop-blur-sm dark:text-white absolute top-0 right-0 left-0 bottom-0"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 max-w-2xl mt-24 mx-auto p-4 md:p-0"
            >
              <SearchBox />
              <Hits hitComponent={Hit} />
            </div>
          </div>,
          document.body
        )
      ) : (
        <input onFocus={() => setIsOpen(true)} />
      )}
    </InstantSearch>
  )
}
