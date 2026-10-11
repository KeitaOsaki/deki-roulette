import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const ENTRY_FILES = [
  'index.html',
  'en/index.html',
  'order/index.html',
  'en/order/index.html',
  'privacy/index.html',
  'en/privacy/index.html',
]

const ALLOWED_COMMENTS = ['Cloudflare Web Analytics', 'End Cloudflare Web Analytics']

const readEntry = (path: string): string =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf-8')

const extractComments = (html: string): string[] =>
  Array.from(html.matchAll(/<!--([\s\S]*?)-->/g), (m) => m[1].trim())

const findDisallowedComments = (html: string): string[] =>
  extractComments(html).filter((c) => !ALLOWED_COMMENTS.includes(c))

describe('エントリ HTML', () => {
  it.each(ENTRY_FILES)('%s を読める', (path) => {
    expect(readEntry(path).length).toBeGreaterThan(0)
  })

  it.each(ENTRY_FILES)('%s に画面共有への言及が残っていない', (path) => {
    expect(readEntry(path)).not.toContain('タブバーは画面共有')
  })

  it('英語版の title は一般語で始まる', () => {
    expect(readEntry('en/index.html')).toMatch(/<title>Roulette/)
    expect(readEntry('en/order/index.html')).toMatch(/<title>Random Order/)
  })

  it.each(ENTRY_FILES)('%s の HTML コメントは許可リストだけ', (path) => {
    expect(findDisallowedComments(readEntry(path))).toEqual([])
  })
})

describe('コメント検査関数', () => {
  it('複数行にまたがるコメントも取り出す', () => {
    const html = '<head>\n<!-- 一行目\n     二行目 -->\n<title>x</title>'
    expect(extractComments(html)).toEqual(['一行目\n     二行目'])
  })

  it('許可リストにないコメントを違反として返す', () => {
    const html = '<!-- Cloudflare Web Analytics --><!-- 余計なコメント -->'
    expect(findDisallowedComments(html)).toEqual(['余計なコメント'])
  })

  it('コメントがなければ違反を返さない', () => {
    expect(findDisallowedComments('<p>hello</p>')).toEqual([])
  })
})
