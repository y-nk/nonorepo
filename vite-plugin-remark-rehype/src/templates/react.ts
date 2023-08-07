export default (html: string) => `export default (props) => {
  const __html = ${html}
  return <div {...props} dangerouslySetInnerHTML={{ __html }} />
}`
