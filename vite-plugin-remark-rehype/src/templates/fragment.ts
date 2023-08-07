export default (html: string) => `export default () => {
  const div = document.createElement('div')
  div.innerHTML = ${html}

  const frag = document.createDocumentFragment()
  frag.append(...div.children)
  return frag
}`
