
import OpenAI from "openai";
import { supabase } from "./supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type RetrievedDoc = {
  id: number;
  source: string;
  title: string | null;
  url: string | null;
  content: string;
  metadata: any;
  similarity: number;
};

export async function retrieveContext(query: string, k = 6): Promise<RetrievedDoc[]> {
  // 1) Embedding da pergunta
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small", // 👈
    input: query,
  });  
  const embedding = emb.data[0].embedding;

  // 2) Busca via RPC (recomendado)
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_count: k,
    filter_source: null,
  });

  if (error) {
    // Fallback simples (não-ideal): ler alguns registros
    const { data: rows, error: err2 } = await supabase
      .from("documents")
      .select("*")
      .limit(k);
    if (err2) throw err2;
    // normalizar saída
    return (rows ?? []).map((r: any) => ({
      id: r.id,
      source: r.source,
      title: r.title,
      url: r.url,
      content: r.content,
      metadata: r.metadata,
      similarity: 0,
    }));
  }

  return (data ?? []) as RetrievedDoc[];
}
