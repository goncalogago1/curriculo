// lib/timeline.ts
export type TLItem = {
    id: string;
    start: string;       // "2023-06"
    end?: string;        // "2024-03" (ou undefined = atual)
    title: string;
    org?: string;
    location?: string;
    tags?: string[];
    bullets?: string[];  // highlights
    link?: string;       // demo/código
  };
  
  export const TIMELINE: TLItem[] = [
    {
      id: "deloitte-1",
      start: "2023-06",
      title: "Tech Consultant (Data & AI)",
      org: "Deloitte Portugal",
      location: "Lisboa, PT",
      tags: ["Collibra", "Power BI", "MicroStrategy", "RAG"],
      bullets: [
        "Governança de dados com Collibra (ingestion + lineage).",
        "POC de Power BI com 10M+ linhas (tunning DAX/Star Schema).",
        "Chat RAG com CV e docs (Supabase + embeddings).",
      ],
    },
    {
      id: "Collibra",
      start: "2024-02",
      end: "2025-01",
      title: "Data Lineage  (Edge/Harvester)",
      org: "Projeto Cliente",
      tags: ["Collibra Edge", "Dremio", "S4HANA"],
      bullets: [
        "Stitching e troubleshooting de lineage via Harvester.",
        "Automação de limpeza de assets ‘Missing from source’.",
      ],
      link: "https://collibra.com",
    },
    // … adiciona o resto
  ];
  