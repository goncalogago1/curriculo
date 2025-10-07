import "dotenv/config";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// 👇 Importar CommonJS dentro de ESM
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // <- aqui está o truque


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ajuste se usou 1536 dims no SQL (recomendado):
const EMBEDDING_MODEL = "text-embedding-3-small";

function chunkText(text, maxChars = 1800) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    if (end < text.length) {
      const lastBreak = text.lastIndexOf(".", end);
      if (lastBreak > start + 400) end = lastBreak + 1;
    }
    chunks.push(text.slice(start, Math.min(end, text.length)).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

async function main() {
  const pdfPath = path.join(process.cwd(), "public", "cv.pdf");
  if (!fs.existsSync(pdfPath)) {
    throw new Error("public/cv.pdf não encontrado. Coloque seu CV lá primeiro.");
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  const parsed = await pdf(pdfBuffer);
  const fullText = parsed.text.replace(/\s+\n/g, "\n").trim();

  const chunks = chunkText(fullText);
  console.log(`CV extraído. Chunks: ${chunks.length}`);

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];

    const emb = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: content,
    });
    const vector = emb.data[0].embedding;

    const { error } = await supabase
      .from("documents")
      .insert({
        source: "cv",
        title: "CV do Gonçalo",
        url: "/cv.pdf",
        content,
        tokens: Math.round(content.length / 4),
        embedding: vector,
        metadata: { type: "cv", chunk: i + 1 },
      });

    if (error) {
      console.error("\nErro ao inserir chunk:", error);
      process.exit(1);
    }
    process.stdout.write(`Inserido chunk ${i + 1}/${chunks.length}\r`);
  }
  console.log("\nIngestão concluída ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
