// vite.config.ts から辿れる範囲は拡張子付きで書く。拡張子なしだと Vite の設定ローダが警告を出す。
import {
  LOCALES,
  PAGES,
  PAGE_PATHS,
  translations,
  type Locale,
  type Page,
} from "./i18n.ts";

export type Route = {
  locale: Locale;
  page: Page;
};

/** 静的 HTML として配る全ページ。ビルド入力・プリレンダ・sitemap の唯一の定義。 */
export const ROUTES: readonly Route[] = PAGES.flatMap((page) =>
  LOCALES.map((locale): Route => ({ locale, page }))
);

export const routeUrlPath = ({ locale, page }: Route) => PAGE_PATHS[page][locale];

/** エントリ HTML のリポジトリ内パス。URL の先頭の `/` を落として `index.html` を足す。 */
export const routeFile = (route: Route) =>
  `${routeUrlPath(route).slice(1)}index.html`;

/** HTML の `<title>` と meta description。ツール画面と規約ページは HTML に直書きしてある。 */
export function routeMeta({ locale, page }: Route) {
  const t = translations[locale];
  if (page === "guide") {
    return { title: t.guideMetaTitle, description: t.guideMetaDescription };
  }
  return null;
}
