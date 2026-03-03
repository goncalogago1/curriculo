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

let cachedEducationText: string | null = null;
let cachedWorkText: string | null = null;

/**
 * Fetch a text file from /public at runtime (server-side) and cache it.
 * We pass the siteOrigin from the API route to avoid hardcoding URLs.
 */
async function fetchTextFromPublic(
  filename: string,
  siteOrigin?: string,
  cacheRef?: { current: string | null }
): Promise<string | null> {
  if (cacheRef?.current) return cacheRef.current;
  if (!siteOrigin) return null;

  try {
    const url = new URL(`/${filename}`, siteOrigin).toString();
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const txt = (await res.text()).trim();
    if (cacheRef) cacheRef.current = txt || null;
    return cacheRef?.current ?? (txt || null);
  } catch {
    console.warn(`[RAG] Could not load /${filename}; continuing without it.`);
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
    filter_source: null,
  });

  let mainDocs: RetrievedDoc[] = (data as RetrievedDoc[] | null) ?? [];

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

  // 3) Add Education.txt and Work.txt as extra sources
  const educationText = await fetchTextFromPublic(
    "Education.txt",
    opts?.siteOrigin,
    { current: cachedEducationText }
  );
  cachedEducationText = educationText; // keep cache in module scope

  const workText = await fetchTextFromPublic(
    "Work.txt",
    opts?.siteOrigin,
    { current: cachedWorkText }
  );
  cachedWorkText = workText;

  // helper para embed + similaridade
  async function pushExtraDoc(
    id: number,
    fileLabel: string, // ex.: "education.txt" ou "work.txt"
    kind: string, // ex.: "education_text" / "work_text"
    text: string
  ) {
    const embExtra = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    const vec = embExtra.data[0].embedding;

    // cosine similarity
    const dot = queryEmbedding.reduce((acc, v, i) => acc + v * vec[i], 0);
    const nQ = Math.hypot(...queryEmbedding);
    const nV = Math.hypot(...vec);
    const similarity = dot / (nQ * nV);

    mainDocs.push({
      id,
      source: "cv",              // mantém a mesma família "cv" (útil se filtrares por source)
      title: fileLabel,          // bom para o label no UI (route.ts pode usar title)
      url: null,
      content: text,
      metadata: { kind },
      similarity,
    });
  }

  if (educationText) {
    await pushExtraDoc(9_999_991, "education.txt", "education_text", educationText);
  }
  if (workText) {
    await pushExtraDoc(9_999_992, "work.txt", "work_text", workText);
  }

  // 4) Sort by similarity (desc) and limit to k
  return mainDocs.sort((a, b) => b.similarity - a.similarity).slice(0, k);
}
