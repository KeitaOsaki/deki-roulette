import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const raw = readFileSync(
  fileURLToPath(new URL("../wrangler.jsonc", import.meta.url)),
  "utf8"
);

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

const config: Record<string, unknown> & {
  observability?: { enabled?: boolean };
  assets?: { not_found_handling?: string };
} = JSON.parse(stripJsonComments(raw));

describe("AC1: wrangler.jsonc に nodejs_compat がない @issue-31 @ac-1", () => {
  it("生の文字列に nodejs_compat が含まれない", () => {
    expect(raw).not.toContain("nodejs_compat");
  });

  it("compatibility_flags キーがない", () => {
    expect(config).not.toHaveProperty("compatibility_flags");
  });

  it("ほかのキーは変更前の値のまま", () => {
    expect(config.$schema).toBe("node_modules/wrangler/config-schema.json");
    expect(config.name).toBe("deki-roulette");
    expect(config.compatibility_date).toBe("2025-09-27");
    expect(config.observability?.enabled).toBe(true);
    expect(config.assets?.not_found_handling).toBe("404-page");
  });

  it("main キーがない（アセット専用の構成）", () => {
    expect(config).not.toHaveProperty("main");
  });
});
