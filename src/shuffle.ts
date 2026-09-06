import type { Item } from "./types";

const UINT32_RANGE = 0x1_0000_0000;

/** [0, max) の一様な整数。剰余は範囲を割り切れない端で偏るので、
 *  割り切れる上限を超えた値は捨てて引き直す。 */
function randomBelow(max: number) {
  const limit = Math.floor(UINT32_RANGE / max) * max;
  const buf = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

export function shuffle<T>(source: readonly T[]): T[] {
  const result = [...source];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function moveTo(items: Item[], id: string | null, index: number) {
  if (id === null) return;
  const at = items.findIndex((item) => item.id === id);
  if (at === -1 || at === index) return;
  [items[at], items[index]] = [items[index], items[at]];
}

/** 一様にシャッフルしてから指定された項目を目的の位置と入れ替える。
 *  条件を満たすまで引き直す方式は、指定以外の並びに偏りを持ち込む。 */
export function arrange(
  items: readonly Item[],
  firstId: string | null,
  lastId: string | null
): Item[] {
  const result = shuffle(items);
  moveTo(result, firstId, 0);
  // 先頭は直前で確定済み。firstId と lastId は同じ項目になり得ないので、
  // 末尾との入れ替えが先頭を巻き込むことはない。
  moveTo(result, lastId, result.length - 1);
  return result;
}
