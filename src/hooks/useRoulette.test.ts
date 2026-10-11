import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Item } from "../types";
import { pickTargetIndex } from "./useRoulette";

const makeItems = (...ids: string[]): Item[] =>
  ids.map((id) => ({ id, label: id }));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("pickTargetIndex", () => {
  it("指定がなければ crypto.getRandomValues の値で添字を決める", () => {
    const spy = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = 4;
      return array;
    });

    expect(pickTargetIndex(makeItems("a", "b", "c"), null)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("指定がないとき Math.random を呼ばない", () => {
    const spy = vi.spyOn(Math, "random");

    pickTargetIndex(makeItems("a", "b", "c"), null);

    expect(spy).not.toHaveBeenCalled();
  });

  it("指定された項目の添字を返し、乱数を引かない", () => {
    const spy = vi.spyOn(crypto, "getRandomValues");

    expect(pickTargetIndex(makeItems("a", "b", "c"), "b")).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it("どの項目とも一致しない指定は -1", () => {
    expect(pickTargetIndex(makeItems("a", "b", "c"), "x")).toBe(-1);
  });

  it("1 項目で指定がなければ 0", () => {
    expect(pickTargetIndex(makeItems("a"), null)).toBe(0);
  });
});

describe("ルーレットの乱数源の記述", () => {
  const readDoc = (name: string) =>
    readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");

  it("README は本当にランダムの説明のそばに crypto.getRandomValues を書く", () => {
    const line = readDoc("README.md")
      .split("\n")
      .find((l) => l.includes("何も指定しなければ結果は本当にランダムです。"));

    expect(line).toContain("crypto.getRandomValues");
  });

  it("CLAUDE.md のスピンの仕組みに randomBelow と Math.random の使い分けを書く", () => {
    const section = readDoc("CLAUDE.md")
      .split("### スピンの仕組み")[1]
      .split("\n### ")[0];

    expect(section).toContain("`randomBelow`（`crypto.getRandomValues`）");
    expect(section).toContain("演出用の角度は `Math.random`");
  });
});
