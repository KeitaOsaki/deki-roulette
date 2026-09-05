import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_ITEMS,
  MAX_LABEL_LENGTH,
  MIN_ITEMS,
  SLICE_COLORS,
  TARGET_HINT_MS,
} from "../config";
import { useLongPress } from "../hooks/useLongPress";
import type { T } from "../i18n";
import type { Item } from "../types";

type RowProps = {
  item: Item;
  color: string;
  isTarget: boolean;
  showMark: boolean;
  spinning: boolean;
  removeAriaLabel: string;
  onLongPress: (id: string) => void;
  onRemove: (id: string) => void;
};

function ItemRow({
  item,
  color,
  isTarget,
  showMark,
  spinning,
  removeAriaLabel,
  onLongPress,
  onRemove,
}: RowProps) {
  const handleLongPress = useCallback(
    () => onLongPress(item.id),
    [item.id, onLongPress]
  );
  const longPress = useLongPress(handleLongPress, spinning);

  return (
    <li
      className={`flex items-center rounded-xl border bg-ink-800 pr-2.5 transition-colors ${
        showMark ? "border-ink-500" : "border-ink-700"
      }`}
    >
      <button
        type="button"
        {...longPress}
        aria-pressed={isTarget}
        className="no-callout flex min-w-0 flex-1 select-none items-center gap-2.5 rounded-xl py-2 pl-3 text-left"
      >
        {/* 指定中は塗りを抜いてリングにする。位置も大きさも変えないので、
            気づいていない人にはただの色見本のままに見える。 */}
        <span
          aria-hidden
          className="h-3 w-3 shrink-0 rounded-full transition-[background-color,box-shadow] duration-150"
          style={
            showMark
              ? { boxShadow: `inset 0 0 0 2px ${color}` }
              : { backgroundColor: color }
          }
        />
        <span className="truncate text-sm text-ivory">{item.label}</span>
      </button>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={spinning}
        aria-label={removeAriaLabel}
        className="shrink-0 rounded px-1 py-2 text-sm leading-none text-ink-400 transition-colors hover:text-flare disabled:cursor-not-allowed"
      >
        ✕
      </button>
    </li>
  );
}

const MemoItemRow = memo(ItemRow);

type Props = {
  items: Item[];
  targetId: string | null;
  spinning: boolean;
  atCapacity: boolean;
  t: T;
  onAdd: (label: string) => void;
  onRemove: (id: string) => void;
  onToggleTarget: (id: string) => void;
};

function ItemList({
  items,
  targetId,
  spinning,
  atCapacity,
  t,
  onAdd,
  onRemove,
  onToggleTarget,
}: Props) {
  const [input, setInput] = useState("");
  const [listActive, setListActive] = useState(false);
  const [hinting, setHinting] = useState(false);
  const hintTimerRef = useRef<number | undefined>(undefined);

  const trimmed = input.trim();
  const inputDisabled = spinning || atCapacity;

  // 指定した本人だけが結果を確認できればよいので、印はリストに触れている間と
  // 指定直後だけ出す。スピン中は無条件で伏せる。
  const revealTarget = !spinning && (listActive || hinting);

  useEffect(() => () => clearTimeout(hintTimerRef.current), []);

  const handleLongPress = useCallback(
    (id: string) => {
      onToggleTarget(id);
      setHinting(true);
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = window.setTimeout(
        () => setHinting(false),
        TARGET_HINT_MS
      );
    },
    [onToggleTarget]
  );

  const handleAdd = () => {
    if (!trimmed || inputDisabled) return;
    onAdd(trimmed);
    setInput("");
  };

  return (
    <section className="flex w-full flex-col gap-4 sm:max-w-xs">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold text-ivory">{t.itemListTitle}</h2>
        <span className="shrink-0 text-xs tabular-nums text-muted">
          {t.itemCount(items.length, MAX_ITEMS)}
        </span>
      </header>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.addPlaceholder}
          disabled={inputDisabled}
          maxLength={MAX_LABEL_LENGTH}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ivory placeholder:text-muted/80 focus:border-ink-400 focus:outline-none disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={inputDisabled || !trimmed}
          className="shrink-0 rounded-xl bg-ink-700 px-4 py-2 text-sm font-bold text-ivory transition-colors hover:bg-ink-600 disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-muted/60"
        >
          {t.addButton}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-600 px-3 py-6 text-center text-sm text-muted">
          {t.emptyList}
        </p>
      ) : (
        <ul
          className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1"
          onPointerEnter={() => setListActive(true)}
          onPointerLeave={() => setListActive(false)}
          onFocus={() => setListActive(true)}
          onBlur={() => setListActive(false)}
        >
          {items.map((item, i) => (
            <MemoItemRow
              key={item.id}
              item={item}
              color={SLICE_COLORS[i % SLICE_COLORS.length]}
              isTarget={targetId === item.id}
              showMark={revealTarget && targetId === item.id}
              spinning={spinning}
              removeAriaLabel={t.removeAriaLabel(item.label)}
              onLongPress={handleLongPress}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}

      {items.length < MIN_ITEMS ? (
        <p className="text-xs text-flare">{t.needMoreItems}</p>
      ) : null}
      {atCapacity ? (
        <p className="text-xs text-muted">{t.atCapacity(MAX_ITEMS)}</p>
      ) : null}
    </section>
  );
}

export default memo(ItemList);
