import { existsSync, readFileSync } from 'node:fs'
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

const repoPath = (path: string): URL => new URL(`../${path}`, import.meta.url)

const readRepoFile = (path: string): string => readFileSync(repoPath(path), 'utf-8')

const extractComments = (html: string): string[] =>
  Array.from(html.matchAll(/<!--([\s\S]*?)-->/g), (m) => m[1].trim())

const findDisallowedComments = (html: string): string[] =>
  extractComments(html).filter((c) => !ALLOWED_COMMENTS.includes(c))

const markdownSection = (markdown: string, heading: string): string => {
  const start = markdown.indexOf(heading)
  if (start === -1) return ''
  const rest = markdown.slice(start + heading.length)
  const next = rest.search(/\n#{2,3} /)
  return next === -1 ? rest : rest.slice(0, next)
}

describe('AC1 @issue-30 @ac-1: エントリ HTML に画面共有への言及が残っていない', () => {
  it.each(ENTRY_FILES)('%s を読める', (path) => {
    expect(readRepoFile(path).length).toBeGreaterThan(0)
  })

  it.each(ENTRY_FILES)('%s に「タブバーは画面共有」が含まれない', (path) => {
    expect(readRepoFile(path)).not.toContain('タブバーは画面共有')
  })

  it('英語版の title は一般語で始まる', () => {
    expect(readRepoFile('en/index.html')).toMatch(/<title>Roulette/)
    expect(readRepoFile('en/order/index.html')).toMatch(/<title>Random Order/)
  })
})

describe('AC2 @issue-30 @ac-2: エントリ HTML の HTML コメントは許可リストだけ', () => {
  it.each(ENTRY_FILES)('%s の HTML コメントは許可リストだけ', (path) => {
    expect(findDisallowedComments(readRepoFile(path))).toEqual([])
  })

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

describe('AC3 @issue-30 @ac-3: コメント検査が pnpm test で走る', () => {
  it('pnpm test は vitest run で、検査ファイルと既存テストが src/ にある', () => {
    const pkg = JSON.parse(readRepoFile('package.json')) as { scripts: Record<string, string> }
    expect(pkg.scripts.test).toBe('vitest run')
    for (const path of ['src/entryHtml.test.ts', 'src/items.test.ts', 'src/shuffle.test.ts']) {
      expect(existsSync(repoPath(path))).toBe(true)
    }
  })
})

describe('AC4 @issue-30 @ac-4: CLAUDE.md に理由と検査対象が書かれている', () => {
  const claudeMd = readRepoFile('CLAUDE.md')

  it('SEO とメタ情報の節に、英語版 title を一般語にする理由がある', () => {
    const seo = markdownSection(claudeMd, '### SEO とメタ情報')
    expect(seo).toContain('ブラウザのタブバーは画面共有に映るので、英語版の title を一般語にしている。')
  })

  it('Commands 節のテストの説明に、エントリ HTML のコメント検査がある', () => {
    const commands = markdownSection(claudeMd, '## Commands')
    expect(commands).toMatch(/エントリ HTML の HTML コメント検査 \(`entryHtml\.test\.ts`\)/)
  })
})
