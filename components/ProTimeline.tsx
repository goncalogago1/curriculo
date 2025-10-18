"use client";
import {
  Bar, CartesianGrid, ComposedChart, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Rectangle, LabelList, Cell
} from "recharts";
import { useMemo } from "react";

export type TLItem = {
  id: string;
  title: string;
  company: string;
  start: string;
  end?: string;
  color?: string;
  tags?: string[];
};

type Props = { items: TLItem[]; height?: number };

const toTs = (iso?: string) => {
  if (!iso) return Date.now();
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const fmtMonth = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: "short", year: "numeric" });

const palette = ["#6366f1", "#06b6d4", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

function buildData(items: TLItem[]) {
  return items
    .map((i, idx) => {
      const s = toTs(i.start);
      const e = i.end ? toTs(i.end) : Date.now();
      const duration = Math.max(e - s, 24 * 3600 * 1000);
      return {
        id: i.id,
        row: `${i.title} · ${i.company}`, // continua a existir, só não mostramos
        start: s,
        end: e,
        offsetAbs: s,
        duration,
        title: i.title,
        company: i.company,
        color: i.color || palette[idx % palette.length],
        tags: i.tags || [],
      };
    })
    .sort((a, b) => b.start - a.start);
}

function CustomBar(props: any) {
  const { x, y, width, height, fill } = props;
  const r = Math.min(14, height / 2);
  return (
    <Rectangle
      x={x}
      y={y}
      width={Math.max(1, width)}
      height={height}
      fill={fill || "#6366f1"}
      radius={[r, r, r, r]}
    />
  );
}

// === label 2 linhas DENTRO da barra ===
function CenterLabel(props: any) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;
  // se a barra for curta, mostra só a empresa
  if (width < 140) {
    const cx = x + width / 2;
    const cy = y + height / 2 + 4;
    return (
      <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="#0b0b0b" style={{ mixBlendMode: "multiply" }}>
        {payload.company}
      </text>
    );
  }
  const cx = x + width / 2;
  const top = y + height / 2 - 2;
  return (
    <text x={cx} y={top} textAnchor="middle" fill="#0b0b0b" style={{ mixBlendMode: "multiply" }}>
      <tspan fontSize="12" fontWeight="600">{payload.title}</tspan>
      <tspan x={cx} dy="14" fontSize="11" opacity="0.9">{payload.company}</tspan>
    </text>
  );
}

function TipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload.find((e: any) => e.dataKey === "duration")?.payload;
  if (!p) return null;
  return (
    <div style={{
      background: "#111", color: "white", padding: "10px 12px",
      borderRadius: 10, boxShadow: "0 8px 20px rgba(0,0,0,.25)", maxWidth: 340
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
      <div style={{ opacity: .9, marginBottom: 6 }}>{p.company}</div>
      <div style={{ fontSize: 12, opacity: .85, marginBottom: 6 }}>
        {fmtMonth(p.start)} — {fmtMonth(p.end)}
      </div>
      {p.tags?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.tags.map((t: string) => (
            <span key={t} style={{
              border: "1px solid rgba(255,255,255,.25)",
              padding: "2px 6px", borderRadius: 999, fontSize: 11, opacity: .95
            }}>{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProTimeline({ items, height = 420 }: Props) {
  const dataAbs = useMemo(() => buildData(items), [items]);
  const minTs = Math.min(...dataAbs.map(d => d.start));
  const maxTs = Math.max(...dataAbs.map(d => d.end));
  const data = dataAbs.map(d => ({ ...d, offset: d.offsetAbs - minTs }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 24, left: 8 }} // 👈 menos espaço à esquerda
          barCategoryGap={14}
        >
          <defs>
            {data.map(d => (
              <linearGradient key={d.id} id={`grad-${d.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={d.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeOpacity={0.08} />
          <XAxis
            type="number"
            dataKey="offset"
            tickFormatter={(v) => fmtMonth(v + minTs)}
            domain={[0, Math.max(1, maxTs - minTs)]}
            ticks={buildTicks(minTs, maxTs)}
            tick={{ fill: "#fff", fontSize: 12 }} 
            axisLine={{ stroke: "rgba(255,255,255,0.3)" }}  // linha X subtil branca
            tickLine={{ stroke: "rgba(255,255,255,0.3)" }}  // risquinhos brancos

          />
          {/* 👇 sem texto do lado esquerdo */}
          <YAxis dataKey="row" type="category" width={0} tick={false} axisLine={false} />

          <Tooltip content={<TipContent />} />

          <Bar dataKey="offset" stackId="t" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="duration" stackId="t" shape={<CustomBar />} isAnimationActive={false}>
            <LabelList dataKey="company" content={<CenterLabel />} />
            {data.map(d => <Cell key={d.id} fill={`url(#grad-${d.id})`} />)}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildTicks(min: number, max: number) {
  const out: number[] = [];
  const d = new Date(min);
  d.setDate(1);
  while (d.getTime() <= max) {
    out.push(d.getTime() - min);
    d.setMonth(d.getMonth() + 3); // trimestral; mude para +1 se quiser mensal
  }
  return out.length ? out : [0];
}
