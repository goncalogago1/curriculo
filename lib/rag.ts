// lib/rag.ts
import OpenAI from "openai";
import { supabase } from "./supabase";
import cvTextRaw from "@/public/CV_text.txt?raw"; // 👈 importa como string (Next 15 suporta "?raw")

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

let cachedCVText: string | null = cvTextRaw?.trim() ?? null;

export async function retrieveContext(
  query: string,
  k = 6
): Promise<RetrievedDoc[]> {
  // 1) Embed query
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = emb.data[0].embedding;

  // 2) Supabase vector search
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_count: k,
    filter_source: null,
  });

  let mainDocs: RetrievedDoc[] = [];

  if (error) {
    console.warn("[RAG] Supabase RPC error, fallback:", error.message);
    const { data: rows, error: err2 } = await supabase
      .from("documents")
      .select("*")
      .limit(k);

    if (err2) throw err2;

    mainDocs = (rows ?? []).map((r) => ({
      id: (r as any).id,
      source: (r as any).source,
      title: (r as any).title,
      url: (r as any).url,
      content: (r as any).content,
      metadata: (r as any).metadata ?? {},
      similarity: 0,
    }));
  } else {
    mainDocs = (data ?? []) as RetrievedDoc[];
  }

  // 3) Add CV_text.txt as an additional source
  if (cachedCVText) {
    const cvEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cachedCVText,
    });
    const cvVector = cvEmbedding.data[0].embedding;

    const dot = embedding.reduce((acc, val, i) => acc + val * cvVector[i], 0);
    const normQ = Math.sqrt(embedding.reduce((acc, val) => acc + val * val, 0));
    const normCV = Math.sqrt(cvVector.reduce((acc, val) => acc + val * val, 0));
    const sim = dot / (normQ * normCV);

    mainDocs.push({
      id: 999999,
      source: "CV (text)",
      title: null,
      url: null,
      content: cachedCVText,
      metadata: {},
      similarity: sim,
    });
  }

  return mainDocs.sort((a, b) => b.similarity - a.similarity).slice(0, k);
}
