import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { GUIDE_MEDIA, guideMediaPath, type GuideMediaKey } from "./guideMedia";
import { LOCALES, PAGE_PATHS, localeFromPath, pageFromPath, translations } from "./i18n";
import { ROUTES, routeFile, routeMeta, routeUrlPath } from "./routes";

const repoPath = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const read = (path: string) => readFileSync(repoPath(path), "utf8");

const ORIGIN = "https://roulette.basekeita.com";

describe("URL からページを決める", () => {
  it.each([
    ["/", "roulette"],
    ["/en/", "roulette"],
    ["/order/", "order"],
    ["/en/order/", "order"],
    ["/privacy/", "privacy"],
    ["/guide/", "guide"],
    ["/en/guide", "guide"],
    ["/guide/faq/", "roulette"],
    ["/about/", "roulette"],
    ["/unknown/", "roulette"],
  ])("%s → %s", (path, page) => {
    expect(pageFromPath(path)).toBe(page);
  });

  it("ROUTES の URL は pageFromPath / localeFromPath と往復できる", () => {
    for (const route of ROUTES) {
      const path = routeUrlPath(route);
      expect(pageFromPath(path)).toBe(route.page);
      expect(localeFromPath(path)).toBe(route.locale);
    }
  });
});

describe("エントリ HTML とサイトマップ", () => {
  const sitemap = read("public/sitemap.xml");

  it("サイトマップの URL が ROUTES と過不足なく一致する", () => {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual(ROUTES.map((r) => `${ORIGIN}${routeUrlPath(r)}`).sort());
  });

  it.each(ROUTES.map((route) => [routeUrlPath(route), route] as const))(
    "%s のエントリ HTML が実装と食い違わない",
    (path, route) => {
      expect(existsSync(repoPath(routeFile(route)))).toBe(true);
      expect(sitemap).toContain(`<loc>${ORIGIN}${path}</loc>`);

      const meta = routeMeta(route);
      if (meta === null) return;
      const html = read(routeFile(route));
      const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      expect(html).toContain(`<html lang="${route.locale}">`);
      expect(html).toContain(`<title>${escape(meta.title)}</title>`);
      expect(html).toContain(`<meta name="description" content="${escape(meta.description)}" />`);
      expect(html).toContain(`<link rel="canonical" href="${ORIGIN}${path}" />`);
      for (const locale of LOCALES) {
        expect(html).toContain(
          `<link rel="alternate" hreflang="${locale}" href="${ORIGIN}${PAGE_PATHS[route.page][locale]}" />`
        );
      }
      expect(html).toContain('<div id="root"></div>');
    }
  );
});

describe("使い方ガイドの媒体", () => {
  const keys = Object.keys(GUIDE_MEDIA) as GuideMediaKey[];

  it("文言が参照する媒体はすべて定義済みで、重複して使われない", () => {
    for (const locale of LOCALES) {
      const used = translations[locale].guideSections.flatMap((s) => s.steps.map((step) => step.media));
      expect(new Set(used).size).toBe(used.length);
      for (const key of used) expect(keys).toContain(key);
    }
  });

  it.each(LOCALES.flatMap((locale) => keys.map((key) => [locale, key] as const)))(
    "%s の %s のファイルがある",
    (locale, key) => {
      expect(existsSync(repoPath(`public${guideMediaPath(key, locale)}`))).toBe(true);
      if (GUIDE_MEDIA[key].animated) {
        expect(existsSync(repoPath(`public${guideMediaPath(key, locale, true)}`))).toBe(true);
      }
    }
  );

  it("すべての手順に代替テキストと説明がある", () => {
    for (const locale of LOCALES) {
      for (const section of translations[locale].guideSections) {
        for (const step of section.steps) {
          expect(step.alt.length).toBeGreaterThan(10);
          expect(step.body.join("").length).toBeGreaterThan(40);
        }
      }
    }
  });
});

describe("ステルス仕様", () => {
  // 隠し操作の内容そのものを示唆する語を、読ませる文章に置かない。
  const FORBIDDEN = /当たり|長押し|仕込|指定|必ず|インチキ|出来レ|細工|press and hold|rigged|predetermin|guarantee/i;

  const texts: string[] = [];
  for (const locale of LOCALES) {
    const t = translations[locale];
    texts.push(t.guideMetaTitle, t.guideMetaDescription, t.guideLead, t.guideTipsTitle, ...t.guideTips);
    for (const section of t.guideSections) {
      texts.push(section.title, section.intro);
      for (const step of section.steps) texts.push(step.title, step.alt, ...step.body);
    }
    for (const item of t.guideFaq) texts.push(item.q, item.a);
  }

  it("使い方ガイドの文言に該当語が無い", () => {
    for (const text of texts) expect(text).not.toMatch(FORBIDDEN);
  });
});
