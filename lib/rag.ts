import OpenAI from "openai";
import { supabase } from "./supabase";
import fs from "fs";
import path from "path";

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

type RetrievedRow = Omit<RetrievedDoc, "similarity">;

let cachedCVText: string | null = null;

/**
 * Load and cache CV_text.txt from /public or /data directory
 */
function loadCVText(): string | null {
  if (cachedCVText) return cachedCVText;
  try {
    // Ex: /public/CV_text.txt  OR  /data/CV_text.txt
    const filePath = path.join(process.cwd(), "public", "CV_text.txt");
    const raw = fs.readFileSync(filePath, "utf8");
    cachedCVText = raw.trim();
    return cachedCVText;
  } catch (err) {
    console.warn("[RAG] CV_text.txt not found, continuing without it");
    return null;
  }
}

export async function retrieveContext(
  query: string,
  k = 6
): Promise<RetrievedDoc[]> {
  // 1) Embed the query
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = emb.data[0].embedding;

  // 2) Search in Supabase (vector similarity)
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

  // 3) Always include CV_text.txt as an additional "source"
  const cvText = loadCVText();
  if (cvText) {
    const cvEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cvText,
    });
    const cvVector = cvEmbedding.data[0].embedding;

    // cosine similarity with query
    const dot = embedding.reduce(
      (acc, val, i) => acc + val * cvVector[i],
      0
    );
    const normQ = Math.sqrt(embedding.reduce((acc, val) => acc + val * val, 0));
    const normCV = Math.sqrt(cvVector.reduce((acc, val) => acc + val * val, 0));
    const sim = dot / (normQ * normCV);

    mainDocs.push({
      id: 999999, // arbitrary
      source: "CV (text)",
      title: null,
      url: null,
      content: cvText,
      metadata: {},
      similarity: sim,
    });
  }

  // 4) Sort by similarity DESC and limit to k
  const sorted = mainDocs
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);

  return sorted;
}
