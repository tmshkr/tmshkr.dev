// matches first path segment, e.g. blog from /blog/2
export function getPathRoot(str) {
  return str.match(/\/([^\/]*)/)[1] || ""
}
