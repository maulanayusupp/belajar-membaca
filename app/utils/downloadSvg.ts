/**
 * Take a live SVGElement, serialize it (with `xmlns` attribute so it opens
 * standalone in any viewer), and trigger a browser download.
 */
export function downloadSvg(svg: SVGElement, filename: string) {
  const clone = svg.cloneNode(true) as SVGElement
  // Some renderers expect explicit namespace on standalone files.
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  }
  const xml = new XMLSerializer().serializeToString(clone)
  const withDecl = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${xml}`
  const blob = new Blob([withDecl], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
