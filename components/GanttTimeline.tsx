"use client";
import { useEffect, useRef } from "react";

type GanttItem = {
  id: string;
  name: string;           // Título mostrado
  resource?: string;      // Ex.: "Deloitte"
  start: string;          // "YYYY-MM-DD" (ou "YYYY-MM")
  end?: string;           // se faltar, usa hoje
  percent?: number;       // 0..100
  deps?: string[];        // IDs de tasks dependentes
};

type Props = {
  items: GanttItem[];
  height?: number;        // altura do gráfico em px
};

declare global {
  interface Window {
    google: any;
  }
}

function toDate(s: string | undefined) {
  if (!s) return new Date();
  const p = s.split("-").map(Number);
  const y = p[0], m = (p[1] || 1) - 1, d = (p[2] || 1);
  return new Date(y, m, d);
}

let googleLoadedPromise: Promise<void> | null = null;
function loadGoogleCharts(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.charts?.load) {
    // já injetado — mas garante pacote 'gantt' carregado
    return new Promise((resolve) => {
      window.google.charts.load("current", { packages: ["gantt"] });
      window.google.charts.setOnLoadCallback(() => resolve());
    });
  }
  if (!googleLoadedPromise) {
    googleLoadedPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://www.gstatic.com/charts/loader.js";
      s.async = true;
      s.onload = () => {
        window.google.charts.load("current", { packages: ["gantt"] });
        window.google.charts.setOnLoadCallback(() => resolve());
      };
      document.head.appendChild(s);
    });
  }
  return googleLoadedPromise!;
}

export default function GanttTimeline({ items, height = 420 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const dataRef = useRef<any>(null);

  useEffect(() => {
    let resizeHandler: any;

    async function draw() {
      await loadGoogleCharts();

      const google = window.google;
      const data = new google.visualization.DataTable();
      data.addColumn("string", "Task ID");
      data.addColumn("string", "Task Name");
      data.addColumn("string", "Resource");
      data.addColumn("date",   "Start Date");
      data.addColumn("date",   "End Date");
      data.addColumn("number", "Duration");         // usamos start+end -> deixa null
      data.addColumn("number", "Percent Complete");
      data.addColumn("string", "Dependencies");

      const rows = items.map(it => ([
        it.id,
        it.name,
        it.resource ?? "",
        toDate(it.start),
        toDate(it.end),
        null,
        typeof it.percent === "number" ? it.percent : (it.end ? 100 : 100),
        (it.deps && it.deps.length) ? it.deps.join(",") : null,
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
            { color: "#6366f1", dark: "#4f46e5", light: "#a5b4fc" }, // Indigo
            { color: "#06b6d4", dark: "#0891b2", light: "#5eead4" }, // Cyan
            { color: "#8b5cf6", dark: "#7c3aed", light: "#d8b4fe" }, // Violet
          ],
        },
      };

      const el = containerRef.current!;
      if (!chartRef.current) chartRef.current = new google.visualization.Gantt(el);
      dataRef.current = data;
      chartRef.current.draw(data, options);

      // Redesenha no resize
      resizeHandler = () => chartRef.current.draw(dataRef.current, options);
      window.addEventListener("resize", resizeHandler);
    }

    draw();

    return () => {
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    };
  }, [items, height]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height, overflowX: "auto" }}
      aria-label="Career Gantt timeline"
      role="img"
    />
  );
}
