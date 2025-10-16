"use client";
import { useState } from "react";

type Item = {
  id: string;
  start: string; end?: string;
  title: string; org?: string; location?: string;
  tags?: string[]; bullets?: string[]; link?: string;
};

const ITEMS: Item[] = [
  {
    id: "deloitte",
    start: "2023-06",
    title: "Tech Consultant (Data & AI)",
    org: "Deloitte Portugal",
    location: "Lisbon, PT",
    tags: ["Collibra","Power BI","MicroStrategy","RAG"],
    bullets: [
      "Governança de dados com Collibra (ingestion + lineage).",
      "POC Power BI 10M+ linhas (tuning modelo/DAX).",
      "Chat RAG com CV/docs (Supabase + embeddings).",
    ],
  },
  {
    id: "delote",
    start: "2024-02", end: "2025-01",
    title: "Data Lineage @  (Edge/Harvester)",
    org: "Client Project",
    tags: ["Collibra Edge","Dremio","S4HANA"],
    bullets: [
      "Stitching e troubleshooting de lineage via Harvester.",
      "Automação de limpeza de assets ‘Missing from source’.",
    ],
  },
  {
    id: "autoeuropa",
    start: "2022-05", end: "2022-11",
    title: "Logistics Planning Intern",
    org: "Autoeuropa Volkswagen",
    location: "Palmela, PT",
    tags: ["Qlik Sense","Analytics"],
    bullets: ["Análise de 120 AGVs; proposta de realocação por subutilização."],
  },
];

function fmt(s?: string){ return s ? new Date(s+"-01").toLocaleString(undefined,{month:"short",year:"numeric"}) : ""; }

export default function Timeline(){
  const [open, setOpen] = useState<string | null>(ITEMS[0]?.id ?? null);
  return (
    <section id="timeline" className="section" aria-labelledby="timeline-title">
      <div className="container">
        <h2 id="timeline-title" className="section-title">Timeline</h2>

        <div className="relative pl-6">
          {/* linha vertical */}
          <div className="absolute left-2 top-0 h-full w-px bg-neutral-300/70"></div>

          <ul className="space-y-4">
            {ITEMS.map((i)=> {
              const isOpen = open === i.id;
              return (
                <li key={i.id} className="relative">
                  <span className="absolute left-1 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-black ring-2 ring-white"></span>

                  <button
                    className="w-full text-left rounded-2xl border p-4 hover:shadow-sm transition"
                    onClick={()=> setOpen(isOpen? null : i.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">
                          {i.title} {i.org ? <span className="opacity-70">· {i.org}</span> : null}
                        </h3>
                        <p className="text-xs opacity-70">
                          {fmt(i.start)} — {i.end ? fmt(i.end) : "Present"} {i.location ? `· ${i.location}` : ""}
                        </p>
                      </div>
                      <span className="text-sm opacity-70">{isOpen ? "−" : "+"}</span>
                    </div>

                    {/* tags */}
                    {i.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {i.tags.map(t=>(
                          <span key={t} className="rounded-full border px-2 py-0.5 text-xs opacity-80">{t}</span>
                        ))}
                      </div>
                    ) : null}

                    {/* detalhes */}
                    {isOpen && (
                      <div className="mt-3">
                        <ul className="space-y-2 text-sm leading-relaxed">
                          {(i.bullets||[]).map((b,idx)=>(
                            <li key={idx} className="flex gap-2">
                              <span className="mt-1 text-neutral-400">•</span><span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        {i.link && (
                          <div className="mt-3">
                            <a className="text-sm underline underline-offset-4 hover:opacity-80" href={i.link} target="_blank" rel="noreferrer">
                              Ver demo/código →
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
