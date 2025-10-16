"use client";
import {
  Bar, CartesianGrid, ComposedChart, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Rectangle, Legend
} from "recharts";
import { useMemo } from "react";

export type TLItem = {
  id: string;
  title: string;          // “Tech Consultant (Data & AI)”
  company: string;        // “Deloitte Portugal”
  start: string;          // "YYYY-MM-DD"
  end?: string;           // se vazio = hoje
  color?: string;         // opcional, ex "#6366f1"
  tags?: string[];
};

type Props = {
  items: TLItem[];
  height?: number;
};

const toTs = (iso?: string) => {
  if (!iso) return Date.now();
  const d = new Date(iso);
  // zera horas p/ coerência de ticks
  d.setHours(0,0,0,0);
  return d.getTime();
};

const fmtMonth = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: "short", year: "numeric" });

const nicePalette = ["#6366f1","#06b6d4","#8b5cf6","#22c55e","#f59e0b","#ef4444"];

function buildData(items: TLItem[]) {
  // truque “range bar”: offset + duration empilhados
  return items.map((i, idx) => {
    const s = toTs(i.start);
    const e = toTs(i.end) || Date.now();
    const duration = Math.max(e - s, 24*3600*1000); // >= 1 dia
    return {
      id: i.id,
      row: `${i.title} · ${i.company}`,
      start: s,
      end: e,
      offset: s,               // usaremos axis como epoch, mas a série "offset" será invisível
      duration,
      company: i.company,
      title: i.title,
      color: i.color || nicePalette[idx % nicePalette.length],
      tags: i.tags || [],
    };
  }).sort((a,b) => b.start - a.start);
}

function CustomBar(props: any) {
  // desenha a segunda parte (duration) com cantos arredondados
  const { x, y, width, height, fill } = props;
  const r = Math.min(14, height/2);
  return <Rectangle x={x} y={y} width={Math.max(1,width)} height={height} fill={fill} radius={[r,r,r,r]} />;
}

function CenterLabel(props: any) {
  const { x, y, width, height, value, payload } = props;
  if (width < 80) return null;
  const cx = x + width/2;
  const cy = y + height/2 + 4;
  const txt = payload.company; // rótulo: empresa
  return (
    <g pointerEvents="none">
      <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="#111" style={{mixBlendMode:"multiply"}}>
        {txt}
      </text>
    </g>
  );
}

function TipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload.find((e:any)=>e.dataKey==="duration")?.payload;
  if (!p) return null;
  return (
    <div style={{
      background: "var(--tooltip-bg, #111)",
      color: "white",
      padding: "8px 10px",
      borderRadius: 8,
      boxShadow: "0 8px 20px rgba(0,0,0,.25)",
      maxWidth: 320
    }}>
      <div style={{fontWeight:600, marginBottom:4}}>{p.title}</div>
      <div style={{opacity:.9, marginBottom:6}}>{p.company}</div>
      <div style={{fontSize:12, opacity:.85, marginBottom:6}}>
        {fmtMonth(p.start)} — {fmtMonth(p.end)}
      </div>
      {p.tags?.length ? (
        <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
          {p.tags.map((t:string)=>(
            <span key={t} style={{
              border:"1px solid rgba(255,255,255,.25)",
              padding:"2px 6px", borderRadius:999, fontSize:11, opacity:.95
            }}>{t}</span>
          ))}
        </div>
      ):null}
    </div>
  );
}

export default function ProTimeline({ items, height = 420 }: Props) {
  const data = useMemo(()=>buildData(items),[items]);

  const minTs = Math.min(...data.map(d=>d.start));
  const maxTs = Math.max(...data.map(d=>d.end));

  // Para “offset invisível”: convertemos para valores relativos ao minTs
  const rel = data.map(d => ({
    ...d,
    offset: d.start - minTs,
    // a barra visível começa após o offset
    // a soma offset+duration posiciona corretamente
  }));

  return (
    <div style={{width:"100%", height}}>
      <ResponsiveContainer>
        <ComposedChart
          data={rel}
          margin={{ top: 16, right: 24, bottom: 24, left: 12 }}
        >
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis
            type="number"
            dataKey="end" // qualquer dataKey numérico serve, usaremos domain manual
            tickFormatter={(v) => fmtMonth(v + minTs)}
            domain={[0, maxTs - minTs]}
            ticks={buildTicks(minTs, maxTs)}
          />
          <YAxis
            dataKey="row"
            type="category"
            width={220}
          />
          <Tooltip content={<TipContent />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 12, opacity:.85 }}
            payload={[{ value: "Percent complete = 100%", id: "legend1", type: "square", color: "var(--legend-color,#6366f1)" }]}
          />
          {/* offset “invisível” para deslocar a barra */}
          <Bar dataKey="offset" stackId="t" fill="transparent" />
          {/* barra visível com label central = empresa */}
          <Bar
            dataKey="duration"
            stackId="t"
            shape={<CustomBar />}
            label={<CenterLabel />}
            fillOpacity={1}
            isAnimationActive={false}
          >
            {
              // cor por item
              rel.map((d, idx) => (
                <defs key={d.id}>
                  <linearGradient id={`grad-${d.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              ))
            }
            {
              // aplica gradiente por célula
              rel.map((d, idx) => (
                <cell key={d.id} fill={`url(#grad-${d.id})`} />
              ))
            }
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// constrói ticks mensais/trimensais decentes
function buildTicks(min: number, max: number) {
  const out: number[] = [];
  const d = new Date(min);
  d.setDate(1);
  while (d.getTime() <= max) {
    out.push(d.getTime() - min);
    d.setMonth(d.getMonth() + 3); // de 3 em 3 meses; muda para 1 se quiser mensal
  }
  return out;
}
