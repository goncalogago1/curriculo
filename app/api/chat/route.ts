// app/api/chat/route.ts
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, RetrievedDoc } from "@/lib/rag";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

const apiKey = process.env.OPENAI_API_KEY?.trim();
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// --- helpers ---
function sanitizeAnswer(text: string) {
  let t = (text || "").trim();

  // remover bold em markdown e bullets "*" ou "-"
  t = t.replace(/\*\*(.*?)\*\*/g, "$1");
  t = t.replace(/^(\s*)[*-]\s+/gm, "$1• ");
  // normalizar quebras
  t = t.replace(/\n{3,}/g, "\n\n");

  return t;
}

function extractChunkIndex(r: RetrievedDoc): number | undefined {
  const m = r?.metadata || {};
  // tenta ler de metadata
  const direct =
    (m as any).chunk ??
    (m as any).chunk_id ??
    (m as any).page ??
    (m as any).idx;
  if (typeof direct === "number") return direct;

  // tenta em title "chunk 3"
  if (r?.title) {
    const mm = /chunk\s*(\d+)/i.exec(r.title);
    if (mm) return Number(mm[1]);
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // suporta { message } e { messages }
    let userMessage = "";
    let history: Msg[] = [];

    if (typeof body?.message === "string") {
      userMessage = body.message.trim();
    } else if (Array.isArray(body?.messages)) {
      history = body.messages as Msg[];
      const last = history[history.length - 1];
      userMessage = (last?.content || "").toString().trim();
    }

    if (!userMessage) {
      return NextResponse.json({ error: "Empty message." }, { status: 400 });
    }

    // 1) RAG
    const siteOrigin = req.nextUrl.origin;
    let results: RetrievedDoc[] = [];
    let contextText = "";
    try {
      results = await retrieveContext(userMessage, 6, { siteOrigin });
      contextText = results
        .map((r, i) => {
          const meta =
            `${r.source}` +
            (r.title ? ` — ${r.title}` : "") +
            (r.url ? ` — ${r.url}` : "");
          return `Source #${i + 1} (${meta}):\n${r.content}`;
        })
        .join("\n\n---\n\n");
    } catch {
      results = [];
      contextText = "";
    }

    // 2) Prompts (note: NÃO peça ao modelo para escrever "Sources")
    const systemPrompt = `
You are the portfolio assistant for Gonçalo Gago.
Answer only using the provided context snippets when relevant.
If the question is outside scope (CV/experience/projects) or there isn't enough evidence,
say that politely. Be concise and factual.
Do NOT add a "Sources" section — the server will add it if needed.
Do NOT invent names, dates, or numbers.
`.trim();

    const userPrompt = `
User question:
${userMessage}

Context (retrieved snippets):
${contextText || "(none)"}
`.trim();

    // 3) Geração
    let answer = `I received: "${userMessage}". Ask me anything about Gonçalo's skills, projects, or CV.`;

    if (openai) {
      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      // pequena cauda do histórico (opcional)
      const tail = history.slice(-8);
      for (const m of tail) {
        if (m.role === "user" || m.role === "assistant") {
          chatMessages.push({ role: m.role, content: m.content });
        }
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: chatMessages,
      });

      answer = completion.choices[0]?.message?.content ?? "No answer.";
    }

    // 4) Limpeza de markdown (*) e bullets
    let cleaned = sanitizeAnswer(answer);

    // 5) "Sources: CV — chunk 3." (forçar este formato)
    //    - Se houver qualquer fonte "cv" (ou derivado), escolhe a mais relevante
    //    - Extrai chunk; se não houver, usa 3 como fallback (como pediste)
    const cvHit = results
      .filter((r) => String(r.source || "").toLowerCase().startsWith("cv"))
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))[0];

    if (cvHit) {
      const chunk =
        extractChunkIndex(cvHit) ??
        // fallback explícito pedido
        3;

      cleaned += `\n\nSources: CV — chunk ${chunk}.`;
    } else {
      // Sem CV no contexto → não mostrar "Sources"
    }

    // 6) Resposta JSON
    return NextResponse.json(
      {
        answer: cleaned,
        // devolvemos as fontes brutas (se precisares na UI),
        // mas a formatação visível já vai no "answer"
        sources: results.map((r, i) => ({
          id: r.id,
          source: r.source,
          title: r.title ?? undefined,
          url: r.url ?? undefined,
          similarity: r.similarity ?? 0,
          i: i + 1,
        })),
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[/api/chat] error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Internal error." },
      { status: 500 }
    );
  }
}
