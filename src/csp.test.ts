import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const headersPath = fileURLToPath(new URL('../public/_headers', import.meta.url))

type Rule = { path: string; headers: Map<string, string> }

function parseHeaders(text: string): Rule[] {
  const rules: Rule[] = []
  let current: Rule | null = null
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    if (!/^\s/.test(line)) {
      current = { path: line.trim(), headers: new Map() }
      rules.push(current)
      continue
    }
    const idx = line.indexOf(':')
    if (current === null || idx < 0) throw new Error(`不正な行: ${line}`)
    current.headers.set(line.slice(0, idx).trim(), line.slice(idx + 1).trim())
  }
  return rules
}

function parseCsp(value: string): Map<string, string[]> {
  const directives = new Map<string, string[]>()
  for (const part of value.split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) continue
    directives.set(tokens[0], tokens.slice(1))
  }
  return directives
}

function loadRules(): Rule[] {
  return parseHeaders(readFileSync(headersPath, 'utf8'))
}

function cspOf(rules: Rule[]): Map<string, string[]> {
  const rule = rules.find((r) => r.path === '/*')
  const value = rule?.headers.get('Content-Security-Policy')
  if (value === undefined) throw new Error('/* の CSP 行が見つからない')
  return parseCsp(value)
}

function loadCsp(): Map<string, string[]> {
  return cspOf(loadRules())
}

const ADS_FRAME = [
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.adtrafficquality.google',
  'https://fundingchoicesmessages.google.com',
]

describe('CSP の style 系ディレクティブ', () => {
  it("style-src は 'self' だけ", () => {
    expect(loadCsp().get('style-src')).toEqual(["'self'"])
  })

  it("style-src-attr は 'unsafe-inline' だけ", () => {
    expect(loadCsp().get('style-src-attr')).toEqual(["'unsafe-inline'"])
  })

  it("style-src-elem があれば 'unsafe-inline' を含まない", () => {
    const csp = loadCsp()
    // style-src-elem が無いとブラウザは <style> 要素に style-src を当てる
    const elem = csp.get('style-src-elem') ?? csp.get('style-src')
    expect(elem).toBeDefined()
    expect(elem).not.toContain("'unsafe-inline'")
  })

  it('CSP 行が見つからなければ失敗する', () => {
    expect(() => cspOf(parseHeaders('/*\n  X-Frame-Options: DENY\n'))).toThrow(
      '/* の CSP 行が見つからない',
    )
    expect(() => cspOf(parseHeaders('/assets/*\n  Content-Security-Policy: default-src \'self\'\n'))).toThrow(
      '/* の CSP 行が見つからない',
    )
  })
})

describe('テストの実行環境', () => {
  it('pnpm test で新しいテストと既存のテストがすべて通る', () => {
    const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8')) as {
      scripts: Record<string, string>
    }
    expect(pkg.scripts.test).toBe('vitest run')
    expect(existsSync(fileURLToPath(new URL('../vitest.config.ts', import.meta.url)))).toBe(false)
    const viteConfig = readFileSync(fileURLToPath(new URL('../vite.config.ts', import.meta.url)), 'utf8')
    expect(viteConfig).toContain('include: ["src/**/*.test.{ts,tsx}"]')
    for (const rel of [
      '../public/_headers',
      '../public/app/privacy/index.html',
      '../public/app/privacy/style.css',
      './csp.test.ts',
      './static-html.test.ts',
      './shuffle.test.ts',
      './items.test.ts',
    ]) {
      expect(existsSync(fileURLToPath(new URL(rel, import.meta.url))), rel).toBe(true)
    }
    const csp = loadCsp()
    expect(csp.get('style-src-elem') ?? csp.get('style-src')).not.toContain("'unsafe-inline'")
  })
})

describe('CSP のほかのディレクティブとヘッダ', () => {
  it('style 系以外のディレクティブは変わっていない', () => {
    const csp = loadCsp()
    const others = new Map(csp)
    others.delete('style-src')
    others.delete('style-src-attr')
    others.delete('style-src-elem')
    expect(Object.fromEntries(others)).toEqual({
      'default-src': ["'self'"],
      'base-uri': ["'none'"],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'form-action': ["'none'"],
      'script-src': [
        "'self'",
        'https://static.cloudflareinsights.com',
        ...ADS_FRAME,
        'https://partner.googleadservices.com',
        'https://www.googletagservices.com',
      ],
      'frame-src': ADS_FRAME,
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': [
        "'self'",
        'https://cloudflareinsights.com',
        ...ADS_FRAME,
        'https://csi.gstatic.com',
      ],
      'manifest-src': ["'self'"],
      'upgrade-insecure-requests': [],
    })
  })

  it('/* のほかのヘッダは変わっていない', () => {
    const rule = loadRules().find((r) => r.path === '/*')
    const rest = new Map(rule?.headers)
    rest.delete('Content-Security-Policy')
    expect(Object.fromEntries(rest)).toEqual({
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy':
        'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-Frame-Options': 'DENY',
    })
  })

  it('ほかのパスのルールは変わっていない', () => {
    const others = loadRules().filter((r) => r.path !== '/*')
    expect(others.map((r) => [r.path, Object.fromEntries(r.headers)])).toEqual([
      ['/assets/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }],
      ['/favicon.svg', { 'Cache-Control': 'public, max-age=604800' }],
      ['/og.png', { 'Cache-Control': 'public, max-age=604800' }],
      ['/ads.txt', { 'Cache-Control': 'public, max-age=86400' }],
      ['/robots.txt', { 'Cache-Control': 'public, max-age=86400' }],
      ['/sitemap.xml', { 'Cache-Control': 'public, max-age=86400' }],
    ])
  })
})
