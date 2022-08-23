import React from "react"
import { Link } from "gatsby"
import "./IconLink.scss"

import GitHub from "@fortawesome/fontawesome-free/svgs/brands/github.svg"

const icons = {
  github: <GitHub className="inline w-4 dark:fill-white" />,
}

export const IconLink = ({ icon, text, to }) => {
  const isExternal = to.startsWith("http")
  if (icon in icons) {
    icon = icons[icon]
  }

  return isExternal ? (
    <a
      href={to}
      className="IconLink"
      title={text}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon} <span className="underline">{text}</span>
    </a>
  ) : (
    <Link to={to} className="IconLink">
      {icon} <span className="underline">{text}</span>
    </Link>
  )
}
