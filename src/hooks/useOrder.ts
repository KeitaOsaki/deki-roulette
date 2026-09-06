import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_ITEMS,
  MIN_ITEMS,
  ORDER_REVEAL_STEP_MS,
  REDUCED_MOTION_REVEAL_MS,
  REVEAL_ANIM_MS,
} from "../config";
import { createId, normalizeLabel } from "../items";
import { arrange } from "../shuffle";
import type { Item, Marks } from "../types";

type Positions = {
  first: string | null;
  last: string | null;
};

export function revealDelayMs(index: number, reducedMotion: boolean) {
  return reducedMotion ? 0 : index * ORDER_REVEAL_STEP_MS;
}

function revealDurationMs(count: number, reducedMotion: boolean) {
  if (reducedMotion) return REDUCED_MOTION_REVEAL_MS;
  return revealDelayMs(count - 1, false) + REVEAL_ANIM_MS;
}

export function useOrder(
  createInitialItems: () => Item[],
  reducedMotion: boolean
) {
  const [items, setItems] = useState<Item[]>(createInitialItems);
  // 先頭と末尾は 1 つのステートに束ねる。片方の遷移がもう片方の今の値に
  // 依存するので、分けると cycleMark が毎回作り直されて行が再描画される。
  const [positions, setPositions] = useState<Positions>({
    first: null,
    last: null,
  });
  const [ordered, setOrdered] = useState<Item[] | null>(null);
  const [revealing, setRevealing] = useState(false);

  const timerRef = useRef<number | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const addItem = useCallback((raw: string) => {
    const label = normalizeLabel(raw);
    if (!label) return;
    setItems((prev) =>
      prev.length >= MAX_ITEMS ? prev : [...prev, { id: createId(), label }]
    );
    setOrdered(null);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setPositions((prev) => ({
      first: prev.first === id ? null : prev.first,
      last: prev.last === id ? null : prev.last,
    }));
    setOrdered(null);
  }, []);

  /** 長押しのたびに 先頭 → 末尾 → 解除 と回す。
   *  先頭と末尾はそれぞれ 1 項目までなので、付け替えると前の指定は落ちる。 */
  const cycleMark = useCallback((id: string) => {
    setPositions((prev) => {
      if (prev.first === id) return { first: null, last: id };
      if (prev.last === id) return { ...prev, last: null };
      return { first: id, last: prev.last };
    });
    setOrdered(null);
  }, []);

  const marks = useMemo<Marks>(() => {
    const next: Record<string, "first" | "last"> = {};
    if (positions.first !== null) next[positions.first] = "first";
    if (positions.last !== null) next[positions.last] = "last";
    return next;
  }, [positions]);

  const canShuffle = !revealing && items.length >= MIN_ITEMS;

  const shuffleItems = useCallback(() => {
    if (!canShuffle) return;
    setOrdered(arrange(items, positions.first, positions.last));
    setRevealing(true);
    clearTimer();
    timerRef.current = window.setTimeout(
      () => setRevealing(false),
      revealDurationMs(items.length, reducedMotion)
    );
  }, [canShuffle, clearTimer, items, positions, reducedMotion]);

  return {
    items,
    marks,
    ordered,
    revealing,
    canShuffle,
    atCapacity: items.length >= MAX_ITEMS,
    addItem,
    removeItem,
    cycleMark,
    shuffleItems,
  };
}
