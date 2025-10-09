import fs from "fs";
import * as pdfParse from "pdf-parse";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// --- Config ---
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!OPENAI_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Faltam variáveis de ambiente no .env.local");
}

const openai = new OpenAI({ apiKey: OPENAI_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Funções util ---
function chunkText(text, size = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + size, text.length);
    chunks.push(text.slice(i, end));
    i += size - overlap;
  }
  return chunks;
}

// --- Ingestão ---
async function ingestPDF(filePath, source = "cv") {
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer);
  const text = parsed.text;
  const chunks = chunkText(text);

  console.log(`📄 Documento: ${filePath}`);
  console.log(`✂️  ${chunks.length} chunks gerados`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Embedding com modelo atual (1536 dims)
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });

    const embedding = emb.data[0].embedding;

    const { error } = await supabase.from("documents").insert({
      source,
      title: `Chunk ${i + 1}`,
      content: chunk,
      tokens: chunk.length,
      embedding,
      metadata: {},
    });

    if (error) {
      console.error(`❌ Erro ao inserir chunk ${i + 1}:`, error);
    } else {
      console.log(`✅ Inserido chunk ${i + 1}/${chunks.length}`);
    }
  }

  console.log("🚀 Ingestão concluída!");
}

// --- Execução ---
const file = "./public/cv.pdf"; // ou outro ficheiro
await ingestPDF(file);
