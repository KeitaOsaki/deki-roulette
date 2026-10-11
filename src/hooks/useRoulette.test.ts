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
