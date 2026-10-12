import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PLACEHOLDER = '<div id="root"></div>';

const { renderAll } = await import(resolve(root, "dist-ssr/entry-server.js"));

for (const { file: relative, markup } of renderAll()) {
  const html = `dist/${relative}`;
  const file = resolve(root, html);
  const template = await readFile(file, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`${html} に ${PLACEHOLDER} がない`);
  }

  // 置換文字列にすると markup 中の $& や $` が置換パターンとして解釈される。
  // 関数を渡してそのまま差し込む。
  await writeFile(
    file,
    template.replace(PLACEHOLDER, () => `<div id="root">${markup}</div>`)
  );
  console.log(`prerendered ${html} (+${markup.length} bytes)`);
}
