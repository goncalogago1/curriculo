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

type RetrievedRow = Omit<RetrievedDoc, "similarity">;

export async function retrieveContext(query: string, k = 6): Promise<RetrievedDoc[]> {
  // 1) Embedding da pergunta
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small", // 1536 dims
    input: query,
  });
  const embedding = emb.data[0].embedding;

  // 2) Busca via RPC
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_count: k,
    filter_source: null,
  });

  if (error) {
    // fallback (sem índice) — retorna alguns registros
    const { data: rows, error: err2 } = await supabase
      .from("documents")
      .select("*")
      .limit(k);

    if (err2) throw err2;

    return (rows ?? []).map((r) => ({
      id: (r as any).id,
      source: (r as any).source,
      title: (r as any).title,
      url: (r as any).url,
      content: (r as any).content,
      metadata: (r as any).metadata ?? {},
      similarity: 0,
    }));
  }

  // data já vem com similarity
  return (data ?? []) as RetrievedDoc[];
}
