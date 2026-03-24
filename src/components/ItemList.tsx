import { useState } from "react";
import type { T } from "../i18n";

type Item = {
  id: string;
  label: string;
};

type Props = {
  items: Item[];
  colors: string[];
  targetId: string | null;
  spinning: boolean;
  t: T;
  onAdd: (label: string) => void;
  onRemove: (id: string) => void;
  onSetTarget: (id: string) => void;
};

export default function ItemList({
  items,
  colors,
  targetId,
  spinning,
  t,
  onAdd,
  onRemove,
  onSetTarget,
}: Props) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <div>
        <h2 className="text-base font-bold text-slate-700">{t.itemListTitle}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{t.itemListHint}</p>
      </div>

      {/* Add input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={t.addPlaceholder}
          disabled={spinning}
          maxLength={20}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100 disabled:text-slate-400"
        />
        <button
          onClick={handleAdd}
          disabled={spinning || !input.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {t.addButton}
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-1.5 overflow-y-auto max-h-80">
        {items.length === 0 && (
          <li className="text-sm text-slate-400 text-center py-4">
            {t.emptyList}
          </li>
        )}
        {items.map((item, i) => (
          <li
            key={item.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
              targetId === item.id
                ? "border-yellow-400 bg-yellow-50 shadow-sm"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* Color dot */}
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            {/* Label */}
            <span className="flex-1 text-sm text-slate-800 truncate">
              {item.label}
            </span>
            {/* Target button */}
            <button
              onClick={() => onSetTarget(item.id)}
              disabled={spinning}
              title={t.setTargetTitle}
              aria-label={t.setTargetAriaLabel(item.label)}
              className={`text-base leading-none transition-colors disabled:cursor-not-allowed ${
                targetId === item.id
                  ? "text-yellow-400"
                  : "text-slate-200 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
            {/* Remove button */}
            <button
              onClick={() => onRemove(item.id)}
              disabled={spinning}
              aria-label={t.removeAriaLabel(item.label)}
              className="text-slate-300 hover:text-red-400 transition-colors disabled:cursor-not-allowed text-sm leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {items.length < 2 && (
        <p className="text-xs text-orange-400">{t.needMoreItems}</p>
      )}
    </div>
  );
}
