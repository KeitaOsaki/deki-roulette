import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  { locale: "ja", page: "roulette", html: "dist/index.html" },
  { locale: "en", page: "roulette", html: "dist/en/index.html" },
  { locale: "ja", page: "order", html: "dist/order/index.html" },
  { locale: "en", page: "order", html: "dist/en/order/index.html" },
];

const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(resolve(root, "dist-ssr/entry-server.js"));

for (const page of PAGES) {
  const file = resolve(root, page.html);
  const template = await readFile(file, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`${page.html} に ${PLACEHOLDER} がない`);
  }

  const markup = render(page.locale, page.page);
  // 置換文字列にすると markup 中の $& や $` が置換パターンとして解釈される。
  // 関数を渡してそのまま差し込む。
  await writeFile(
    file,
    template.replace(PLACEHOLDER, () => `<div id="root">${markup}</div>`)
  );
  console.log(`prerendered ${page.html} (+${markup.length} bytes)`);
}
