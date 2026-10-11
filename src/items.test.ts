import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_LABEL_LENGTH } from "./config";
import { createId, makeItems, normalizeLabel } from "./items";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeLabel", () => {
  it("前後の空白を落とし、連続する空白を 1 つにまとめる", () => {
    expect(normalizeLabel("  カレー \t ライス\n")).toBe("カレー ライス");
  });

  it("全角スペースも空白として扱う", () => {
    expect(normalizeLabel("　カレー　　ライス　")).toBe(
      "カレー ライス"
    );
  });

  it("空白だけの入力は空文字になる", () => {
    expect(normalizeLabel(" \n\t　")).toBe("");
  });

  it("上限の文字数で切り詰める", () => {
    const long = "あ".repeat(MAX_LABEL_LENGTH + 5);

    expect(normalizeLabel(long)).toBe("あ".repeat(MAX_LABEL_LENGTH));
  });

  it("空白を詰めたあとの長さで上限を判定する", () => {
    const padded = `${"a".repeat(MAX_LABEL_LENGTH)}      `;

    expect(normalizeLabel(padded)).toBe("a".repeat(MAX_LABEL_LENGTH));
  });
});

describe("createId", () => {
  it("呼ぶたびに別の ID を返す", () => {
    const generated = new Set(Array.from({ length: 100 }, createId));

    expect(generated.size).toBe(100);
  });

  it("randomUUID がない環境でも ID を返す", () => {
    // http 経由のプレビュー（secure context ではない）を想定
    vi.stubGlobal("crypto", {});

    const generated = new Set(Array.from({ length: 100 }, createId));

    expect(generated.size).toBe(100);
    for (const id of generated) {
      expect(id).toMatch(/^[0-9a-z]+-[0-9a-z]+$/);
    }
  });

  it("crypto 自体がない環境でも ID を返す", () => {
    vi.stubGlobal("crypto", undefined);

    expect(createId()).toMatch(/^[0-9a-z]+-[0-9a-z]+$/);
  });
});

describe("makeItems", () => {
  it("ラベルの順を保ち、項目ごとに別の ID を振る", () => {
    const items = makeItems(["a", "b", "c"]);

    expect(items.map((item) => item.label)).toEqual(["a", "b", "c"]);
    expect(new Set(items.map((item) => item.id)).size).toBe(3);
  });

  it("空の入力は空の配列になる", () => {
    expect(makeItems([])).toEqual([]);
  });
});
