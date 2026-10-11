import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

const exists = (path: string) =>
  existsSync(fileURLToPath(new URL(`../${path}`, import.meta.url)));

/** 文字列リテラルの中の // は触らず、行コメントとブロックコメントだけを落とす。 */
function stripJsonComments(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < source.length && source[j] !== '"') {
        j += source[j] === "\\" ? 2 : 1;
      }
      out += source.slice(i, j + 1);
      i = j + 1;
    } else if (source.startsWith("//", i)) {
      while (i < source.length && source[i] !== "\n") i++;
    } else if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

const PAGES = [
  { path: "public/404.html", lang: "ja", home: "/", order: "/order/" },
  { path: "public/en/404.html", lang: "en", home: "/en/", order: "/en/order/" },
] as const;

describe("AC1: wrangler.jsonc @issue-26 @ac-1", () => {
  const raw = read("wrangler.jsonc");

  it("コメントを除いて JSON として読め、assets の未知パスの扱いが 404-page", () => {
    let config: { assets?: { not_found_handling?: string } } = {};
    expect(() => {
      config = JSON.parse(stripJsonComments(raw));
    }).not.toThrow();
    expect(config.assets?.not_found_handling).toBe("404-page");
  });

  it("single-page-application の文字列が残っていない", () => {
    expect(raw).not.toContain("single-page-application");
  });
});

describe("AC2: 日本語版 404.html @issue-26 @ac-2", () => {
  it("ファイルが存在する", () => {
    expect(exists("public/404.html")).toBe(true);
  });

  it("html lang=ja・空でない title・トップと順番決めへのリンクを持つ", () => {
    const html = read("public/404.html");
    expect(html).toMatch(/<html[^>]*\slang="ja"/i);
    expect(html).toMatch(/<title>\s*\S[\s\S]*?<\/title>/i);
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/order/"');
  });
});

describe("AC3: 英語版 404.html @issue-26 @ac-3", () => {
  it("ファイルが存在する", () => {
    expect(exists("public/en/404.html")).toBe(true);
  });

  it("html lang=en・空でない title・英語版トップと順番決めへのリンクを持つ", () => {
    const html = read("public/en/404.html");
    expect(html).toMatch(/<html[^>]*\slang="en"/i);
    expect(html).toMatch(/<title>\s*\S[\s\S]*?<\/title>/i);
    expect(html).toContain('href="/en/"');
    expect(html).toContain('href="/en/order/"');
  });

  it("日本語版へのリンクを持たない", () => {
    const html = read("public/en/404.html");
    expect(html).not.toContain('href="/"');
    expect(html).not.toContain('href="/order/"');
  });
});

describe.each(PAGES)("AC4: $path @issue-26 @ac-4", ({ path }) => {
  it("script 要素を含まない", () => {
    expect(read(path)).not.toMatch(/<script\b/i);
  });

  it("外部オリジンのリソースを参照しない", () => {
    expect(read(path)).not.toMatch(/\b(?:src|href)\s*=\s*["']?\s*https?:\/\//i);
  });
});

describe.each(PAGES)("AC5: $path @issue-26 @ac-5", ({ path }) => {
  it("meta robots noindex を持つ", () => {
    expect(read(path)).toMatch(
      /<meta\s+name="robots"\s+content="noindex"\s*\/?>/i
    );
  });
});

describe("AC5: 禁止語 @issue-26 @ac-5", () => {
  it("日本語版に「当たり」「必ず」「長押し」「仕込」が出ない", () => {
    const html = read("public/404.html");
    for (const word of ["当たり", "必ず", "長押し", "仕込"]) {
      expect(html).not.toContain(word);
    }
  });

  it("英語版に rig・long press・long-press が単語として出ない", () => {
    const html = read("public/en/404.html");
    expect(html).not.toMatch(/\brig\b/i);
    expect(html).not.toMatch(/\blong[ -]press\b/i);
  });
});

describe("AC6: sitemap.xml @issue-26 @ac-6", () => {
  it("404 ページは public にあるが、404 を含む loc はない", () => {
    for (const { path } of PAGES) {
      expect(exists(path)).toBe(true);
    }
    const locs = [...read("public/sitemap.xml").matchAll(/<loc>([^<]*)<\/loc>/g)];
    expect(locs.length).toBeGreaterThan(0);
    for (const [, url] of locs) {
      expect(url).not.toContain("404");
    }
  });
});

describe("AC7: pnpm test での実行 @issue-26 @ac-7", () => {
  it("pnpm test の vitest run がこのファイルを拾い、確かめる対象の 404.html がそろっている", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts.test).toBe("vitest run");
    expect(read("vite.config.ts")).toMatch(
      /include:\s*\[\s*"src\/\*\*\/\*\.test\.\{ts,tsx\}"\s*\]/
    );
    expect(read("src/notFound.test.ts")).toMatch(
      /^import\s*\{[^}]*\bdescribe\b[^}]*\bexpect\b[^}]*\bit\b[^}]*\}\s*from\s*"vitest";$/m
    );
    for (const { path } of PAGES) {
      expect(exists(path)).toBe(true);
    }
  });
});
