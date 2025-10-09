
/* scripts/ingest.ts
 * Lê public/cv.pdf, quebra em chunks e insere embeddings no Supabase (pgvector).
 */
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
// pdf-parse: se der erro com default, use a linha 2 (namespace)
import * as pdfParse from "pdf-parse"; // ✅ <- corrigido
// import * as pdfParse from "pdf-parse"; // <- alternativa se a de cima falhar


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

//const pdfParse = require("pdf-parse");

function chunkText(text: string, maxChars = 1800): string[] {
  const chunks: string[] = [];
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
  const parsed = await pdfParse.default(pdfBuffer); // 👈 corrigido aqui
  const fullText = parsed.text.replace(/\s+\n/g, "\n").trim();

  const chunks = chunkText(fullText);
  console.log(`CV extraído. Chunks: ${chunks.length}`);

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];

    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small", // 👈 antes: text-embedding-3-large
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
        embedding: vector as any,
        metadata: { type: "cv", chunk: i + 1 },
      });

    if (error) {
      console.error("Erro ao inserir chunk:", error);
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
