import { JSDOM } from 'jsdom'
import lucide from 'lucide'
import kebab from 'kebab-case'
import { mkdirSync, rmSync, writeFileSync } from 'fs'

const {
  createElement,
  createIcons,
  icons,
  ...configs
} = lucide

console.log({ icons })

const { window } = new JSDOM(``);
globalThis.document = window.document

rmSync('./dist', {
  force: true,
  recursive: true,
})

mkdirSync('./dist')

for (const [key, val] of Object.entries(configs)) {
  const iconName = kebab(key)
    .slice(1)
    .replace(/([a-z])([0-9])/g, '$1-$2')

  const fileName = `${iconName}.svg`
  const fileContent = createElement(val).outerHTML

  writeFileSync(`./dist/${fileName}`, fileContent, 'utf-8')
}
