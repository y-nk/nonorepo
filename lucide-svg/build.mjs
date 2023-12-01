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

const { window } = new JSDOM(``);
globalThis.document = window.document

rmSync('./dist', {
  force: true,
  recursive: true,
})

mkdirSync('./dist')

for (const [key, val] of Object.entries(configs)) {
  const fileName = `${kebab(key).slice(1)}.svg`
  const fileContent = createElement(val).outerHTML

  writeFileSync(`./dist/${fileName}`, fileContent, 'utf-8')
}
