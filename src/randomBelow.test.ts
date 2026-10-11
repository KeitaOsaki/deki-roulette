import { afterEach, describe, expect, it, vi } from "vitest";
import { randomBelow } from "./shuffle";

function stubRandomValues(...values: number[]) {
  const queue = [...values];
  return vi
    .spyOn(crypto, "getRandomValues")
    .mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
      (array as unknown as Uint32Array)[0] = queue.shift() ?? 0;
      return array;
    });
}

describe("randomBelow @issue-29 @ac-1", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("max が 1 のときは常に 0 を返す", () => {
    for (let i = 0; i < 100; i++) {
      expect(randomBelow(1)).toBe(0);
    }
  });

  it("0 以上 max 未満の整数だけを返す", () => {
    for (let i = 0; i < 1000; i++) {
      const value = randomBelow(6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(6);
    }
  });

  it("crypto.getRandomValues の値を max で割った余りを返す", () => {
    const spy = stubRandomValues(5);
    expect(randomBelow(3)).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("limit 以上の値は捨てて引き直す", () => {
    const spy = stubRandomValues(0xffffffff, 4);
    expect(randomBelow(3)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("Math.random を呼ばない", () => {
    const random = vi.spyOn(Math, "random");
    randomBelow(10);
    expect(random).not.toHaveBeenCalled();
  });
});
