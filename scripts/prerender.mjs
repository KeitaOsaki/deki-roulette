import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  { locale: "ja", html: "dist/index.html" },
  { locale: "en", html: "dist/en/index.html" },
];

const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(resolve(root, "dist-ssr/entry-server.js"));

for (const page of PAGES) {
  const file = resolve(root, page.html);
  const template = await readFile(file, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`${page.html} に ${PLACEHOLDER} がない`);
  }

  const markup = render(page.locale);
  await writeFile(
    file,
    template.replace(PLACEHOLDER, `<div id="root">${markup}</div>`)
  );
  console.log(`prerendered ${page.html} (+${markup.length} bytes)`);
}
