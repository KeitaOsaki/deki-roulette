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
  it('6 つのエントリ HTML を読めて、どれにも「タブバーは画面共有」が含まれず、英語版の title は一般語で始まる', () => {
    const htmls = ENTRY_FILES.map((path) => [path, readRepoFile(path)] as const)
    for (const [, html] of htmls) {
      expect(html.length).toBeGreaterThan(0)
    }
    expect(htmls.filter(([, html]) => html.includes('タブバーは画面共有')).map(([path]) => path)).toEqual([])
    expect(readRepoFile('en/index.html')).toMatch(/<title>Roulette/)
    expect(readRepoFile('en/order/index.html')).toMatch(/<title>Random Order/)
  })
})

describe('AC2 @issue-30 @ac-2: エントリ HTML の HTML コメントは許可リストだけ', () => {
  it('検査関数は複数行のコメントも取り出して違反を返し、6 つのエントリ HTML には違反がない', () => {
    const multiLine = '<head>\n<!-- 一行目\n     二行目 -->\n<title>x</title>'
    expect(extractComments(multiLine)).toEqual(['一行目\n     二行目'])
    expect(findDisallowedComments(multiLine)).toEqual(['一行目\n     二行目'])
    expect(
      findDisallowedComments('<!-- Cloudflare Web Analytics --><!-- 余計なコメント --><!-- End Cloudflare Web Analytics -->'),
    ).toEqual(['余計なコメント'])
    expect(findDisallowedComments('<p>hello</p>')).toEqual([])

    const violations = ENTRY_FILES.flatMap((path) =>
      findDisallowedComments(readRepoFile(path)).map((comment) => `${path}: ${comment}`),
    )
    expect(violations).toEqual([])
  })
})

describe('AC3 @issue-30 @ac-3: コメント検査が pnpm test で走って通る', () => {
  it('pnpm test は src/ の検査ファイルと既存テストを vitest run で走らせ、エントリ HTML は AC1・AC2 の検査に通る', () => {
    const pkg = JSON.parse(readRepoFile('package.json')) as { scripts: Record<string, string> }
    expect(pkg.scripts.test).toBe('vitest run')
    for (const path of ['src/entryHtml.test.ts', 'src/items.test.ts', 'src/shuffle.test.ts']) {
      expect(existsSync(repoPath(path))).toBe(true)
    }

    const failing = ENTRY_FILES.filter((path) => {
      const html = readRepoFile(path)
      return html.includes('タブバーは画面共有') || findDisallowedComments(html).length > 0
    })
    expect(failing).toEqual([])
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
