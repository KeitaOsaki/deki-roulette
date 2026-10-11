import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('..', import.meta.url))

const ENTRIES = [
  'index.html',
  'en/index.html',
  'order/index.html',
  'en/order/index.html',
  'privacy/index.html',
  'en/privacy/index.html',
]

function read(rel: string): string {
  return readFileSync(`${root}${rel}`, 'utf8')
}

function htmlUnder(dir: string): string[] {
  const found: string[] = []
  for (const name of readdirSync(`${root}${dir}`)) {
    const rel = `${dir}/${name}`
    if (statSync(`${root}${rel}`).isDirectory()) found.push(...htmlUnder(rel))
    else if (name.endsWith('.html')) found.push(rel)
  }
  return found
}

describe('app/privacy の静的 HTML', () => {
  const html = read('public/app/privacy/index.html')

  it('<style 要素がない', () => {
    expect(html).not.toMatch(/<style[\s>]/i)
  })

  it('<head> に style.css への link がある', () => {
    const head = /<head>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? ''
    expect(head).toMatch(
      /<link\s+rel="stylesheet"\s+href="\/app\/privacy\/style\.css"\s*\/?>/,
    )
  })

  it('style.css が旧 <style> の全ルールを持つ', () => {
    const css = read('public/app/privacy/style.css')
    expect(css.trim()).not.toBe('')
    const compact = css.replace(/\s+/g, ' ')
    for (const selector of ['body', 'main', 'h1', 'h2', 'p, ul', 'ul', 'a']) {
      expect(compact).toContain(`${selector} {`)
    }
    for (const decl of [
      'background: #17111f',
      'color: #f5efe6',
      'line-height: 1.7',
      'max-width: 42rem',
      'padding: 3rem 1rem 4rem',
      'font-size: 1.75rem',
      'font-size: 1.125rem',
      'color: #ffc94a',
      'color: #d9d0e3',
      'padding-left: 1.25rem',
    ]) {
      expect(compact).toContain(decl)
    }
  })
})

describe('style 要素と style 属性の不在', () => {
  const targets = [...new Set([...ENTRIES, ...htmlUnder('public')])]

  it('調べる対象が 7 件以上ある', () => {
    expect(targets.length).toBeGreaterThanOrEqual(7)
  })

  it.each(targets)('%s に <style も style= もない', (rel) => {
    const html = read(rel)
    expect(html).not.toMatch(/<style[\s>]/i)
    expect(html).not.toMatch(/\sstyle\s*=/i)
  })
})
