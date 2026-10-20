import type { CSSProperties, ReactNode } from "react";

export const GUTTER = "clamp(1.25rem, 6vw, 6rem)";
export const ON_INK_BORDER = "color-mix(in srgb, var(--paper) 14%, transparent)";
export const ON_INK_MUTED = "color-mix(in srgb, var(--paper) 62%, transparent)";

export const sectionLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  display: "block",
};

export const editorialHeading: CSSProperties = {
  fontFamily: "var(--font-geist)",
  fontWeight: 300,
  fontSize: "clamp(2.5rem, 7vw, 7rem)",
  lineHeight: 1,
  letterSpacing: "-0.035em",
  margin: 0,
};

/** Filled accent tag with a small index in the corner. */
export function Label({ index, children }: { index?: number; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        minWidth: "min(100%, 12rem)",
        maxWidth: "100%",
        minHeight: "3.4rem",
        padding: "1.5rem 2rem 0.6rem 0.85rem",
        background: "var(--accent)",
        color: "var(--on-accent)",
        fontFamily: "var(--font-geist)",
        fontSize: "0.85rem",
        lineHeight: 1.2,
      }}
    >
      {index != null && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", top: "0.45rem", right: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.58rem", opacity: 0.75 }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      {children}
    </span>
  );
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Number(n.toFixed(1));

interface LinePlateProps {
  seed: number;
  /** One node per label; otherwise `nodes` unlabeled (numbered) nodes. */
  labels?: string[];
  nodes?: number;
  width?: number;
  height?: number;
  /** Section background, used to mask connector lines behind the rings. */
  bg: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

/**
 * Deterministic engineering-drawing style network: ringed nodes, elbow connectors,
 * numbered callouts and a dimension baseline. Same seed → same drawing on server and client.
 */
export function LinePlate({ seed, labels, nodes = 4, width = 320, height = 200, bg, strokeWidth = 1.1, style }: LinePlateProps) {
  const rand = mulberry32(seed);
  const count = labels?.length ?? nodes;
  const base = height - 26;
  const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt((count * width) / base))));
  const rows = Math.ceil(count / cols);
  const cw = width / cols;
  const ch = base / rows;
  const fontSize = Math.max(7, Math.min(11, width / 70));

  const pts = Array.from({ length: count }, (_, k) => {
    const c = k % cols;
    const row = Math.floor(k / cols);
    const r = Math.min(cw, ch) * (0.2 + rand() * 0.11);
    const x = cw * (c + 0.5) + (rand() - 0.5) * cw * 0.3 + (row % 2 ? cw * 0.1 : -cw * 0.1);
    const y = ch * (row + 0.5) + (rand() - 0.5) * ch * 0.25;
    return {
      x: Math.min(width - r - 6, Math.max(r + 6, x)),
      y: Math.min(base - r - 4, Math.max(r + fontSize + 6, y)),
      r,
      dashed: rand() < 0.5,
    };
  });

  const edges: [number, number][] = [];
  for (let k = 0; k < count - 1; k++) edges.push([k, k + 1]);
  for (let k = 0; k + cols < count; k++) if (rand() < 0.6) edges.push([k, k + cols]);

  const baseline = height - 12;

  return (
    <svg
      data-plate
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <line x1={4} y1={baseline} x2={width - 4} y2={baseline} />
      {pts.map((p, k) => (
        <g key={`d${k}`}>
          <line x1={f(p.x)} y1={f(p.y + p.r)} x2={f(p.x)} y2={baseline} strokeDasharray="2 3" opacity={0.55} />
          <line x1={f(p.x)} y1={baseline - 4} x2={f(p.x)} y2={baseline + 4} />
        </g>
      ))}
      {edges.map(([a, b], k) => {
        const p = pts[a];
        const q = pts[b];
        const xm = f((p.x + q.x) / 2);
        return <path key={`e${k}`} d={`M${f(p.x)} ${f(p.y)} H${xm} V${f(q.y)} H${f(q.x)}`} />;
      })}
      {pts.map((p, k) => (
        <g key={`n${k}`}>
          <circle cx={f(p.x)} cy={f(p.y)} r={f(p.r)} fill={bg} />
          {p.dashed && <circle cx={f(p.x)} cy={f(p.y)} r={f(p.r * 0.8)} strokeDasharray="2 3" opacity={0.7} />}
          <circle cx={f(p.x)} cy={f(p.y)} r={f(p.r * 0.55)} />
          <circle cx={f(p.x)} cy={f(p.y)} r={1.8} fill="currentColor" stroke="none" />
          <text
            x={f(p.x + p.r * 0.72)}
            y={f(p.y - p.r * 0.78)}
            fill="currentColor"
            stroke="none"
            style={{ fontFamily: "var(--font-mono)", fontSize, letterSpacing: "0.04em" }}
          >
            {String(k + 1).padStart(2, "0")}
            {labels ? ` ${labels[k]}` : ""}
          </text>
        </g>
      ))}
    </svg>
  );
}
