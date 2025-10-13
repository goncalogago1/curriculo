// lib/rag.ts
import OpenAI from "openai";
import { supabase } from "./supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type RetrievedDoc = {
  id: number;
  source: string;
  title: string | null;
  url: string | null;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
};

let cachedCVText: string | null = null;

/**
 * Fetch CV_text.txt from /public at runtime (server-side) and cache it.
 * We pass the siteOrigin from the API route to avoid hardcoding URLs.
 */
async function getCVText(siteOrigin?: string): Promise<string | null> {
  if (cachedCVText) return cachedCVText;
  if (!siteOrigin) return null; // origin not available (should be provided by route)
  try {
    const url = new URL("/CV_text.txt", siteOrigin).toString();
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const txt = (await res.text()).trim();
    cachedCVText = txt || null;
    return cachedCVText;
  } catch {
    console.warn("[RAG] Could not load /CV_text.txt; continuing without it.");
    return null;
  }
}

export async function retrieveContext(
  query: string,
  k = 6,
  opts?: { siteOrigin?: string }
): Promise<RetrievedDoc[]> {
  // 1) Embed query
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small", // 1536 dims
    input: query,
  });
  const queryEmbedding = emb.data[0].embedding;

  // 2) Vector search on Supabase
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: k,
    filter_source: null, // se quiseres filtrar por "cv", muda para "cv"
  });

  let mainDocs: RetrievedDoc[] =
    (data as RetrievedDoc[] | null) ?? [];

  if (error) {
    console.warn("[RAG] Supabase RPC error; fallback:", error.message);
    const { data: rows, error: err2 } = await supabase
      .from("documents")
      .select("*")
      .limit(k);

    if (err2) throw err2;

    mainDocs =
      (rows ?? []).map((r: any) => ({
        id: r.id,
        source: r.source,
        title: r.title,
        url: r.url,
        content: r.content,
        metadata: r.metadata ?? {},
        similarity: 0,
      })) ?? [];
  }

  // 3) Add CV_text.txt as an extra "cv" source (so results show only "cv")
  const cvText = await getCVText(opts?.siteOrigin);
  if (cvText) {
    // Embed the full CV text
    const cvEmb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cvText,
    });
    const cvVec = cvEmb.data[0].embedding;

    // Cosine similarity with query
    const dot = queryEmbedding.reduce((acc, v, i) => acc + v * cvVec[i], 0);
    const nQ = Math.hypot(...queryEmbedding);
    const nCV = Math.hypot(...cvVec);
    const similarity = dot / (nQ * nCV);

    mainDocs.push({
      id: 9_999_999,              // id sentinel
      source: "cv",               // 👈 mantém apenas "cv"
      title: null,
      url: null,
      content: cvText,            // conteúdo textual do CV
      metadata: { kind: "cv_text" },
      similarity,
    });
  }

  // 4) Sort by similarity (desc) and limit to k
  return mainDocs.sort((a, b) => b.similarity - a.similarity).slice(0, k);
}
