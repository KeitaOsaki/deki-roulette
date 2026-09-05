import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import { LONG_PRESS_MS } from "../config";

/**
 * 長押しでのみ発火するハンドラ束。通常のクリック・タップでは何も起きないので、
 * 見ている人には「ただ項目に触れただけ」にしか映らない。
 */
export function useLongPress(onLongPress: () => void, disabled: boolean) {
  const timerRef = useRef<number | undefined>(undefined);
  const firedRef = useRef(false);

  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  return useMemo(
    () => ({
      onPointerDown: () => {
        if (disabled) return;
        cancel();
        timerRef.current = window.setTimeout(onLongPress, LONG_PRESS_MS);
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,

      // OS のキーリピートが始まってから拾うので、単押しでは反応しない
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (disabled || !e.repeat) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (firedRef.current) return;
        firedRef.current = true;
        onLongPress();
      },
      onKeyUp: () => {
        firedRef.current = false;
      },

      // 長押しでコンテキストメニューやテキスト選択ハンドルが出るのを抑える
      onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    }),
    [cancel, disabled, onLongPress]
  );
}
