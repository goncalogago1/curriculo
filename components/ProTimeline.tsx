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
  start: string;   // "YYYY-MM-DD"
  end?: string;    // vazio = hoje
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
      const duration = Math.max(e - s, 24 * 3600 * 1000); // >= 1 dia
      return {
        id: i.id,
        row: `${i.title} · ${i.company}`,
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

function CenterLabel(props: any) {
  const { x, y, width, height, value } = props;
  if (!value || width < 80) return null;
  const cx = (x ?? 0) + (width ?? 0) / 2;
  const cy = (y ?? 0) + (height ?? 0) / 2 + 4;
  return (
    <g pointerEvents="none">
      <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="#111" style={{ mixBlendMode: "multiply" }}>
        {String(value)}
      </text>
    </g>
  );
}

function TipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload.find((e: any) => e.dataKey === "duration")?.payload;
  if (!p) return null;
  return (
    <div style={{
      background: "#111", color: "white", padding: "8px 10px",
      borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,.25)", maxWidth: 320
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
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

  const data = dataAbs.map(d => ({
    ...d,
    offset: d.offsetAbs - minTs, // relativo ao min
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          layout="vertical"                 // 👈 essencial para barras horizontais
          margin={{ top: 16, right: 24, bottom: 24, left: 12 }}
          barCategoryGap={12}              // espaço entre linhas
        >
          <defs>
            {data.map(d => (
              <linearGradient key={d.id} id={`grad-${d.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={d.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            type="number"
            dataKey="offset"
            tickFormatter={(v) => fmtMonth(v + minTs)}
            domain={[0, Math.max(1, maxTs - minTs)]}
            ticks={buildTicks(minTs, maxTs)}
            tick={{ fill: "#fff", fontSize: 12 }}           // datas em branco
            axisLine={{ stroke: "rgba(255,255,255,0.3)" }}  // linha X subtil branca
            tickLine={{ stroke: "rgba(255,255,255,0.3)" }}  // risquinhos brancos
          />

          <YAxis
            dataKey="row"
            type="category"
            width={260}
            tick={false}        // ❌ sem texto
            axisLine={false}    // ❌ sem linha vertical
            tickLine={false}    // ❌ sem risquinhos
          />
          <CartesianGrid stroke="rgba(255,255,255,0.1)" />  // grelha clara branca


          <Tooltip content={<TipContent />} />

          {/* empurra a barra até ao start */}
          <Bar dataKey="offset" stackId="t" fill="transparent" isAnimationActive={false} />

          {/* barra visível */}
          <Bar dataKey="duration" stackId="t" shape={<CustomBar />} isAnimationActive={false}>
            <LabelList dataKey="company" content={<CenterLabel />} />
            {data.map(d => (
              <Cell key={d.id} fill={`url(#grad-${d.id})`} />
            ))}
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
    d.setMonth(d.getMonth() + 3); // trimestral
  }
  return out.length ? out : [0];
}
