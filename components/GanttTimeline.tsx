// components/GanttTimeline.tsx
"use client";
import { useEffect, useRef } from "react";

type GanttItem = {
  id: string;
  name: string;
  resource?: string;    // <- vai aparecer por cima da barra
  start: string;
  end?: string;
  percent?: number;
  deps?: string[];
};
type Props = { items: GanttItem[]; height?: number };

declare global { interface Window { google: any } }

function toDate(s?: string){ if(!s) return new Date(); const [y,m="1",d="1"]=s.split("-"); return new Date(+y, +m-1, +d); }

let googleLoadedPromise: Promise<void> | null = null;
function loadGoogleCharts(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.charts?.load) {
    return new Promise((r) => { window.google.charts.load("current", { packages: ["gantt"] }); window.google.charts.setOnLoadCallback(() => r()); });
  }
  if (!googleLoadedPromise) {
    googleLoadedPromise = new Promise((r) => {
      const s = document.createElement("script");
      s.src = "https://www.gstatic.com/charts/loader.js";
      s.async = true;
      s.onload = () => {
        window.google.charts.load("current", { packages: ["gantt"] });
        window.google.charts.setOnLoadCallback(() => r());
      };
      document.head.appendChild(s);
    });
  }
  return googleLoadedPromise!;
}

export default function GanttTimeline({ items, height = 520 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const dataRef = useRef<any>(null);

  // 🔹 desenha labels por cima das barras
  function addBarLabels(resources: (string | undefined)[]) {
    const el = containerRef.current;
    if (!el) return;
    // remove labels antigos
    el.querySelectorAll<SVGTextElement>("svg text.__barlabel").forEach((n) => n.remove());

    const svg = el.querySelector("svg");
    if (!svg) return;

    // barras são <rect> dentro do clip; a ordem segue as linhas do DataTable
    const rects = Array.from(svg.querySelectorAll<SVGRectElement>('rect')).filter(r => {
      // heurística: barras têm rx/ry arredondado e altura ~28–36 (trackHeight/barHeight)
      const h = Number(r.getAttribute("height") || "0");
      const rx = r.getAttribute("rx");
      return h >= 20 && h <= 50 && rx !== null; // evita rects de fundo
    });

    rects.forEach((r, i) => {
      const label = resources[i]?.trim();
      if (!label) return;

      const x = Number(r.getAttribute("x") || "0");
      const y = Number(r.getAttribute("y") || "0");
      const w = Number(r.getAttribute("width") || "0");

      // centro da barra; colocamos 6px acima
      const cx = x + w / 2;
      const cy = Math.max(y - 6, 12);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("class", "__barlabel");
      text.setAttribute("x", String(cx));
      text.setAttribute("y", String(cy));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "11");
      text.setAttribute("font-family", "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial");
      text.setAttribute("fill", "currentColor"); // herda do tema
      text.style.pointerEvents = "none";
      text.textContent = label;

      svg.appendChild(text);
    });
  }

  useEffect(() => {
    let resize: any;

    async function draw() {
      await loadGoogleCharts();
      const g = window.google;

      const data = new g.visualization.DataTable();
      data.addColumn("string", "Task ID");
      data.addColumn("string", "Task Name");
      data.addColumn("string", "Resource");
      data.addColumn("date",   "Start Date");
      data.addColumn("date",   "End Date");
      data.addColumn("number", "Duration");
      data.addColumn("number", "Percent Complete");
      data.addColumn("string", "Dependencies");

      const rows = items.map(it => ([
        it.id, it.name, it.resource ?? "",
        toDate(it.start), toDate(it.end), null,
        typeof it.percent === "number" ? it.percent : (it.end ? 100 : 100),
        it.deps?.length ? it.deps.join(",") : null,
      ]));
      data.addRows(rows);

      const options = {
        height,
        gantt: {
          percentEnabled: true,
          trackHeight: 36,
          barHeight: 28,
          labelStyle: { fontSize: 12 },
          palette: [
            { color: "#6366f1", dark: "#4f46e5", light: "#a5b4fc" },
            { color: "#06b6d4", dark: "#0891b2", light: "#5eead4" },
            { color: "#8b5cf6", dark: "#7c3aed", light: "#d8b4fe" },
          ],
        },
      };

      const el = containerRef.current!;
      if (!chartRef.current) chartRef.current = new g.visualization.Gantt(el);
      dataRef.current = data;

      // desenha e adiciona labels
      g.visualization.events.addListener(chartRef.current, "ready", () => {
        addBarLabels(items.map(i => i.resource));
      });

      chartRef.current.draw(data, options);

      resize = () => {
        chartRef.current.draw(dataRef.current, options);
        addBarLabels(items.map(i => i.resource));
      };
      window.addEventListener("resize", resize);
    }

    draw();
    return () => { if (resize) window.removeEventListener("resize", resize); };
  }, [items, height]);

  return <div ref={containerRef} style={{ width: "100%", height, overflowX: "auto" }} />;
}
