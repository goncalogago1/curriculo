// app/api/chat/route.ts
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, RetrievedDoc } from "@/lib/rag";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

const apiKey = process.env.OPENAI_API_KEY?.trim();
const openai = apiKey ? new OpenAI({ apiKey }) : null;

function sourceLabel(r: RetrievedDoc, i: number) {
  const src = (r.source || "").toLowerCase();
  const isCV = src.includes("cv");
  // tenta apanhar número de chunk a partir de metadata
  const chunk =
    (r.metadata as any)?.chunk ??
    (r.metadata as any)?.chunk_id ??
    (r.metadata as any)?.page ??
    i + 1;

  if (isCV) return `CV — chunk ${chunk}`;
  // fallback para outras fontes
  if (r.title) return r.title;
  if (r.url) return r.url;
  return `Source ${i + 1}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Aceita { message } ou { messages: Msg[] }
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
          const meta = sourceLabel(r, i);
          return `Source #${i + 1} (${meta}):\n${r.content}`;
        })
        .join("\n\n---\n\n");
    } catch {
      results = [];
      contextText = "";
    }

    // 2) Prompts
    const systemPrompt = `
      You are the portfolio assistant for Gonçalo Gago.
      You have access to retrieved context snippets from two types of sources:
      - "CV — chunk 1", "CV — chunk 2", "CV — chunk 3" come from Gonçalo's professional CV (cv.pdf)
      - "CV — chunk 4" comes from a short personal text/about-me summary

      When answering:
      - Use ONLY the provided context snippets when relevant.
      - Be concise, factual, and in plain text (no Markdown, bold, or italics).
      - NEVER include or repeat the literal source labels (like “CV — chunk 1”) in your answer.
      - NEVER add a “Sources:” list at the end — this will be handled by the interface automatically.
      - If the question is outside scope (CV/experience/projects) or there isn't enough information, politely say so.
      Do NOT invent names, dates, or numbers.
      `.trim();
    
    const userPrompt = `
User question:
${userMessage}

Context (retrieved snippets):
${contextText || "(none)"}
`.trim();

    // 3) Geração
    let answer =
      `I received: "${userMessage}". ` +
      `Ask me anything about Gonçalo's skills, projects, or CV.`;

    if (openai) {
      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      // pequena cauda de histórico
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

    // 4) Devolve fontes já com label “CV — chunk X”
    return NextResponse.json(
      {
        answer,
        sources: results.map((r, i) => ({
          id: r.id,
          source: r.source,
          title: r.title ?? undefined,
          url: r.url ?? undefined,
          similarity: r.similarity ?? 0,
          metadata: r.metadata ?? {},
          i: i + 1,
          label: sourceLabel(r, i), // <<<<<<<<<<<<<< usar isto no UI
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
