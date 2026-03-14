type Item = {
  id: string;
  label: string;
};

type Props = {
  items: Item[];
  colors: string[];
  rotation: number;
  spinning: boolean;
};

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - 12;

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function describeSlice(startAngle: number, endAngle: number) {
  const s = polarToCartesian(startAngle, R);
  const e = polarToCartesian(endAngle, R);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${s.x} ${s.y} A ${R} ${R} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

export default function RouletteWheel({ items, colors, rotation, spinning }: Props) {
  const sliceAngle = items.length > 0 ? 360 / items.length : 360;
  const maxLabelLen = items.length > 8 ? 5 : items.length > 5 ? 7 : 10;
  const fontSize = items.length > 8 ? 9 : items.length > 5 ? 11 : 13;

  return (
    <div className="relative select-none">
      {/* Pointer triangle */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "22px solid #dc2626",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      />

      {/* Wheel */}
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4.5s cubic-bezier(0.15, 0.85, 0.3, 1)"
            : "none",
        }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}
        >
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={R + 8} fill="#1e293b" />

          {items.length === 0 && (
            <circle cx={CX} cy={CY} r={R} fill="#e2e8f0" />
          )}

          {items.length === 1 && (
            <>
              <circle cx={CX} cy={CY} r={R} fill={colors[0]} />
              <text
                x={CX}
                y={CY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={14}
                fontWeight="bold"
              >
                {items[0].label.slice(0, maxLabelLen)}
              </text>
            </>
          )}

          {items.length >= 2 &&
            items.map((item, i) => {
              const startAngle = i * sliceAngle;
              const endAngle = (i + 1) * sliceAngle;
              const midAngle = (i + 0.5) * sliceAngle;
              const labelPos = polarToCartesian(midAngle, R * 0.62);
              const label =
                item.label.length > maxLabelLen
                  ? item.label.slice(0, maxLabelLen) + "…"
                  : item.label;

              return (
                <g key={item.id}>
                  <path
                    d={describeSlice(startAngle, endAngle)}
                    fill={colors[i % colors.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="bold"
                    transform={`rotate(${midAngle - 90}, ${labelPos.x}, ${labelPos.y})`}
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}

          {/* Center cap */}
          <circle cx={CX} cy={CY} r={18} fill="white" stroke="#e2e8f0" strokeWidth={3} />
          <circle cx={CX} cy={CY} r={8} fill="#1e293b" />
        </svg>
      </div>
    </div>
  );
}
