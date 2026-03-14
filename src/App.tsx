import { useRef, useState } from "react";
import ItemList from "./components/ItemList";
import RouletteWheel from "./components/RouletteWheel";

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

const DEFAULT_ITEMS: Item[] = [
  { id: "1", label: "ラーメン" },
  { id: "2", label: "カレー" },
  { id: "3", label: "寿司" },
  { id: "4", label: "焼肉" },
];

export default function App() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const totalRotationRef = useRef(0);

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
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          出来レーレット
        </h1>
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
            {spinning ? "スピン中…" : "スピン！"}
          </button>

          {/* Hint messages */}
          {!spinning && items.length < 2 && (
            <p className="text-xs text-orange-400">
              項目を2つ以上追加してください
            </p>
          )}
        </div>

        {/* Right: item list */}
        <div className="w-full lg:w-auto">
          <ItemList
            items={items}
            colors={COLORS}
            targetId={targetId}
            spinning={spinning}
            onAdd={addItem}
            onRemove={removeItem}
            onSetTarget={setTargetId}
          />
        </div>
      </div>

      {/* Explanation — below the fold */}
      <section className="mt-24 w-full max-w-3xl border-t border-slate-200 pt-8 pb-4 text-slate-400 text-sm space-y-2">
        <h2 className="text-base font-bold text-slate-400">このサービスについて</h2>
        <p>
          項目リストの <span className="text-yellow-500 font-bold">★</span>{" "}
          ボタンを押すと、その項目を「確定当たり」として設定できます。
          スピン後は必ずその項目が選ばれます。
        </p>
        <p>
          ★ を設定しない場合はランダムに選ばれます。
        </p>
        <p>友人などにばれてしまった際は誠心誠意謝罪するか、逃げ切ってください。</p>
      </section>

      {/* Disclaimer */}
      <footer className="w-full max-w-3xl pb-8 text-sm text-slate-400 space-y-2">
        <h2 className="text-base font-bold text-slate-400">注意事項</h2>
        ⚠️ 本サービスの利用により生じたいかなる損害についても責任を負いません。
      </footer>
    </main>
  );
}
