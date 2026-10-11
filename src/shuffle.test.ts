import { afterEach, describe, expect, it, vi } from "vitest";
import { arrange, shuffle } from "./shuffle";
import type { Item } from "./types";

const makeItems = (...ids: string[]): Item[] =>
  ids.map((id) => ({ id, label: id }));

const ids = (items: readonly Item[]) => items.map((item) => item.id);

/** 試行回数 trials に対し、各区画の期待度数 ±tolerance に収まっているか。
 *  tolerance は標準偏差の 6 倍以上に取り、CI で偶発的に落ちないようにする。 */
function expectUniform(
  counts: Map<string, number>,
  cells: number,
  trials: number,
  tolerance: number
) {
  expect(counts.size).toBe(cells);
  for (const count of counts.values()) {
    expect(Math.abs(count - trials / cells)).toBeLessThan(tolerance);
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("shuffle", () => {
  it("同じ要素を並べ替えるだけで、元の配列は変えない", () => {
    const source = [1, 2, 3, 4, 5];
    const result = shuffle(source);

    expect(result).not.toBe(source);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(source).toEqual([1, 2, 3, 4, 5]);
  });

  it("空配列と 1 要素はそのまま返す", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["a"])).toEqual(["a"]);
  });

  it("すべての並びがほぼ等確率で出る", () => {
    const trials = 6000;
    const counts = new Map<string, number>();
    for (let i = 0; i < trials; i++) {
      const key = shuffle(["a", "b", "c"]).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    expectUniform(counts, 6, trials, 200);
  });

  it("割り切れない端の乱数は捨てて引き直す", () => {
    // 3 要素の最初の抽選は範囲 3。2^32 は 3 で割り切れず、0xFFFFFFFF は
    // 剰余だと 0 に偏る端の値なので、捨てて次の値 1 を使うのが正しい。
    const draws = [0xffffffff, 1, 0];
    const spy = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = draws.shift()!;
      return array;
    });

    expect(shuffle(["a", "b", "c"])).toEqual(["c", "a", "b"]);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});

describe("arrange", () => {
  it("指定がなければ全項目をそのまま並べ替える", () => {
    const source = makeItems("a", "b", "c", "d");
    const result = arrange(source, null, null);

    expect(ids(result).sort()).toEqual(["a", "b", "c", "d"]);
    expect(ids(source)).toEqual(["a", "b", "c", "d"]);
  });

  it("先頭の指定は必ず先頭に、末尾の指定は必ず末尾に来る", () => {
    const source = makeItems("a", "b", "c", "d", "e");

    // 元の並びとの重なり方で結果が変わるので、抽選を繰り返して全組を確かめる
    for (const first of ids(source)) {
      for (const last of ids(source)) {
        if (first === last) continue;
        for (let n = 0; n < 50; n++) {
          const result = arrange(source, first, last);
          expect(result[0].id).toBe(first);
          expect(result[result.length - 1].id).toBe(last);
          expect(ids(result).sort()).toEqual(["a", "b", "c", "d", "e"]);
        }
      }
    }
  });

  it("先頭だけ、末尾だけの指定でも効く", () => {
    const source = makeItems("a", "b", "c");

    for (let n = 0; n < 50; n++) {
      expect(arrange(source, "b", null)[0].id).toBe("b");
      expect(arrange(source, null, "b")[2].id).toBe("b");
    }
  });

  it("存在しない ID の指定は無視する", () => {
    const source = makeItems("a", "b", "c");
    const result = arrange(source, "x", "y");

    expect(ids(result).sort()).toEqual(["a", "b", "c"]);
  });

  it("指定以外の並びは偏らない", () => {
    // 引き直し方式だとここが偏る。指定した a と e を除く 3 項目は 6 通りが等確率。
    const source = makeItems("a", "b", "c", "d", "e");
    const trials = 6000;
    const counts = new Map<string, number>();
    for (let i = 0; i < trials; i++) {
      const key = ids(arrange(source, "a", "e")).slice(1, 4).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    expectUniform(counts, 6, trials, 200);
  });
});
