import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_ITEMS,
  MAX_LABEL_LENGTH,
  MIN_ITEMS,
  REDUCED_MOTION_SPIN_MS,
  SPIN_FALLBACK_MS,
} from "../config";
import type { Item } from "../types";

function createId() {
  // randomUUID は secure context 限定なので、http 経由のプレビュー用に退避先を持つ
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeLabel(raw: string) {
  return raw.replace(/\s+/g, " ").trim().slice(0, MAX_LABEL_LENGTH);
}

export function makeItems(labels: readonly string[]): Item[] {
  return labels.map((label) => ({ id: createId(), label }));
}

export function useRoulette(
  createInitialItems: () => Item[],
  reducedMotion: boolean
) {
  const [items, setItems] = useState<Item[]>(createInitialItems);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  // 回転角は setRotation の updater 内で読むと StrictMode の二重実行で
  // 乱数の結果がずれるため、純粋でない計算の入力としてここに持つ
  const rotationRef = useRef(0);
  const pendingResultRef = useRef<string | null>(null);
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
    setResult(null);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setTargetId((prev) => (prev === id ? null : prev));
    setResult(null);
  }, []);

  const toggleTarget = useCallback((id: string) => {
    setTargetId((prev) => (prev === id ? null : id));
    setResult(null);
  }, []);

  const finishSpin = useCallback(() => {
    clearTimer();
    setSpinning(false);
    if (pendingResultRef.current === null) return;
    setResult(pendingResultRef.current);
    pendingResultRef.current = null;
  }, [clearTimer]);

  const canSpin = !spinning && items.length >= MIN_ITEMS;

  const spin = useCallback(() => {
    if (!canSpin) return;

    const targetIndex =
      targetId !== null
        ? items.findIndex((item) => item.id === targetId)
        : Math.floor(Math.random() * items.length);
    if (targetIndex === -1) return;

    const sliceAngle = 360 / items.length;
    // 針の位置に来る要素角は (360 - R) % 360。rawAngle に止めるには R をこう解く
    const rawAngle = targetIndex * sliceAngle + Math.random() * sliceAngle;
    const desiredMod = (360 - rawAngle) % 360;
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    let delta = (desiredMod - currentMod + 360) % 360;
    if (delta < 10) delta += 360;

    const fullSpins = 4 + Math.floor(Math.random() * 5);
    const next = rotationRef.current + fullSpins * 360 + delta;
    rotationRef.current = next;

    pendingResultRef.current = items[targetIndex].label;
    setRotation(next);
    setResult(null);
    setSpinning(true);

    clearTimer();
    timerRef.current = window.setTimeout(
      finishSpin,
      reducedMotion ? REDUCED_MOTION_SPIN_MS : SPIN_FALLBACK_MS
    );
  }, [canSpin, clearTimer, finishSpin, items, reducedMotion, targetId]);

  return {
    items,
    targetId,
    spinning,
    rotation,
    result,
    canSpin,
    atCapacity: items.length >= MAX_ITEMS,
    addItem,
    removeItem,
    toggleTarget,
    spin,
    finishSpin,
  };
}
