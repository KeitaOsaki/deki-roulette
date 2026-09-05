import { memo, useMemo } from "react";
import { SLICE_COLORS, SPIN_DURATION_MS, SPIN_EASING } from "../config";
import type { Item } from "../types";

type Props = {
  items: Item[];
  rotation: number;
  spinning: boolean;
  onSpinEnd: () => void;
};

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 16;
const INK = "#17111F";

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const s = polarToCartesian(startAngle, RADIUS);
  const e = polarToCartesian(endAngle, RADIUS);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)} Z`;
}

function truncate(label: string, max: number) {
  return label.length > max ? `${label.slice(0, max)}…` : label;
}

function RouletteWheel({ items, rotation, spinning, onSpinEnd }: Props) {
  const { slices, fontSize } = useMemo(() => {
    const maxLabelLen = items.length > 8 ? 5 : items.length > 5 ? 7 : 10;
    const sliceAngle = items.length > 0 ? 360 / items.length : 360;

    return {
      fontSize: items.length > 8 ? 9 : items.length > 5 ? 11 : 13,
      slices: items.map((item, i) => {
        const midAngle = (i + 0.5) * sliceAngle;
        const pos = polarToCartesian(midAngle, RADIUS * 0.62);
        return {
          id: item.id,
          d: describeSlice(i * sliceAngle, (i + 1) * sliceAngle),
          fill: SLICE_COLORS[i % SLICE_COLORS.length],
          label: truncate(item.label, maxLabelLen),
          x: Number(pos.x.toFixed(1)),
          y: Number(pos.y.toFixed(1)),
          // 左半分はそのまま回すと文字が上下逆さまになるため 180 度返す
          rotate: midAngle > 180 ? midAngle + 90 : midAngle - 90,
        };
      }),
    };
  }, [items]);

  return (
    <div className="relative w-[min(320px,78vw)] aspect-square select-none">
      {/* Pointer */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderTop: "26px solid #FF4E63",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.55))",
        }}
      />

      {/* GPU 合成に乗せるため、SVG ではなくラッパーの div を回す */}
      <div
        className="h-full w-full"
        style={{
          willChange: spinning ? "transform" : "auto",
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? `transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`
            : "none",
        }}
        onTransitionEnd={(e) => {
          if (e.propertyName === "transform") onSpinEnd();
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          role="presentation"
          style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }}
        >
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 11} fill="#2A2138" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 5}
            fill="none"
            stroke="#4C3F62"
            strokeWidth={1.5}
          />

          {slices.length === 0 ? (
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#2A2138" />
          ) : null}

          {slices.length === 1 ? (
            <>
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={slices[0].fill} />
              <text
                x={CENTER}
                y={CENTER}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={INK}
                fontSize={15}
                fontWeight="700"
              >
                {slices[0].label}
              </text>
            </>
          ) : null}

          {slices.length >= 2
            ? slices.map((slice) => (
                <g key={slice.id}>
                  <path
                    d={slice.d}
                    fill={slice.fill}
                    stroke={INK}
                    strokeWidth={2}
                  />
                  <text
                    x={slice.x}
                    y={slice.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={INK}
                    fontSize={fontSize}
                    fontWeight="700"
                    transform={`rotate(${slice.rotate.toFixed(1)}, ${slice.x}, ${slice.y})`}
                  >
                    {slice.label}
                  </text>
                </g>
              ))
            : null}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={19}
            fill="#1F1829"
            stroke="#F5EFE6"
            strokeWidth={2.5}
          />
          <circle cx={CENTER} cy={CENTER} r={6} fill="#F5EFE6" />
        </svg>
      </div>
    </div>
  );
}

export default memo(RouletteWheel);
