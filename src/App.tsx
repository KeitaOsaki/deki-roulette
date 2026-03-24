import { useRef, useState } from "react";
import ItemList from "./components/ItemList";
import RouletteWheel from "./components/RouletteWheel";
import { type Locale, translations } from "./i18n";

export type Item = {
  id: string;
  label: string;
};

const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#a855f7", // purple
];

export default function App() {
  const [locale, setLocale] = useState<Locale>(
    navigator.language.startsWith("ja") ? "ja" : "en"
  );
  const t = translations[locale];

  const makeDefaultItems = (loc: Locale): Item[] =>
    translations[loc].defaultItems.map((label, i) => ({
      id: String(i + 1),
      label,
    }));

  const [items, setItems] = useState<Item[]>(() =>
    makeDefaultItems(navigator.language.startsWith("ja") ? "ja" : "en")
  );
  const [targetId, setTargetId] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const totalRotationRef = useRef(0);

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    setItems(makeDefaultItems(next));
    setTargetId(null);
    setResult(null);
  };

  const addItem = (label: string) => {
    const id = Date.now().toString();
    setItems((prev) => [...prev, { id, label }]);
    setResult(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (targetId === id) setTargetId(null);
    setResult(null);
  };

  const spin = () => {
    if (spinning || items.length < 2) return;

    const targetIndex =
      targetId !== null
        ? items.findIndex((item) => item.id === targetId)
        : Math.floor(Math.random() * items.length);
    if (targetIndex === -1) return;

    const sliceAngle = 360 / items.length;

    // Element angle at pointer = (360 - R) % 360, so to land on rawAngle we need R = (360 - rawAngle) % 360
    const rawAngle = targetIndex * sliceAngle + Math.random() * sliceAngle;
    const desiredMod = (360 - rawAngle) % 360;
    const currentMod = ((totalRotationRef.current % 360) + 360) % 360;
    let delta = (desiredMod - currentMod + 360) % 360;
    if (delta < 10) delta += 360;

    const fullSpins = 4 + Math.floor(Math.random() * 5); // 4〜8周
    const newTotal = totalRotationRef.current + fullSpins * 360 + delta;
    totalRotationRef.current = newTotal;
    setRotation(newTotal);
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      setSpinning(false);
      setResult(items[targetIndex].label);
    }, 4600);
  };

  const canSpin = !spinning && items.length >= 2;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="mb-16 text-center w-full max-w-3xl flex items-center justify-center relative">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          {t.title}
        </h1>
        {/* Language switcher */}
        <div className="absolute right-0 flex gap-1">
          {(["ja", "en"] as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                locale === loc
                  ? "bg-slate-800 text-white"
                  : "bg-slate-200 text-slate-500 hover:bg-slate-300"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 w-full max-w-3xl">
        {/* Left: wheel + spin */}
        <div className="flex flex-col items-center gap-5">
          <RouletteWheel
            items={items}
            colors={COLORS}
            rotation={rotation}
            spinning={spinning}
          />

          {/* Result */}
          <div className="h-14 flex items-center justify-center">
            {result && (
              <div className="px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-yellow-300 text-xl font-bold text-slate-800 animate-bounce">
                🎉 {result}
              </div>
            )}
          </div>

          {/* Spin button */}
          <button
            onClick={spin}
            disabled={!canSpin}
            className={`px-10 py-3.5 rounded-full text-lg font-black shadow-lg transition-all ${
              canSpin
                ? "bg-red-500 hover:bg-red-600 active:scale-95 text-white shadow-red-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {spinning ? t.spinning : t.spin}
          </button>

          {/* Hint messages */}
          {!spinning && items.length < 2 && (
            <p className="text-xs text-orange-400">{t.needMoreItems}</p>
          )}
        </div>

        {/* Right: item list */}
        <div className="w-full lg:w-auto">
          <ItemList
            items={items}
            colors={COLORS}
            targetId={targetId}
            spinning={spinning}
            t={t}
            onAdd={addItem}
            onRemove={removeItem}
            onSetTarget={setTargetId}
          />
        </div>
      </div>

      {/* Explanation — below the fold */}
      <section className="mt-24 w-full max-w-3xl border-t border-slate-200 pt-8 pb-4 text-slate-400 text-sm space-y-2">
        <h2 className="text-base font-bold text-slate-400">{t.aboutTitle}</h2>
        <h4 className="text-base font-bold">{t.aboutHeading}</h4>
        <p>
          {t.aboutBody.split("★").map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span className="text-yellow-500 font-bold">★</span>
              </span>
            ) : (
              part
            )
          )}
        </p>
        <p>{t.aboutRandom}</p>
        <p>{t.aboutApology}</p>
      </section>

      {/* Disclaimer */}
      <footer className="w-full max-w-3xl pb-8 text-sm text-slate-400 space-y-2">
        <h2 className="text-base font-bold text-slate-400">{t.disclaimerTitle}</h2>
        ⚠️ {t.disclaimer}
      </footer>

      {/* Copyright */}
      <p className="pb-6 text-xs text-slate-500">&copy; 2026 basekeita</p>
    </main>
  );
}
