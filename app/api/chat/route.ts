import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { retrieveContext, RetrievedDoc } from "@/lib/rag";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface ChatRequestBody {
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = body?.message?.trim() ?? "";

    if (!userMessage) {
      return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    // 1) Recupera contexto (RAG)
    const results: RetrievedDoc[] = await retrieveContext(userMessage, 6);
    const contextText = results
      .map(
        (r, i) =>
          `Fonte #${i + 1} (${r.source}${r.title ? ` - ${r.title}` : ""}${
            r.url ? ` - ${r.url}` : ""
          }):\n${r.content}`
      )
      .join("\n\n---\n\n");

    // 2) System prompt
    const systemPrompt = `
Você é o assistente do Gonçalo Gago. Responda APENAS com base nas fontes fornecidas no contexto.
Se a pergunta fugir ao escopo (CV/LinkedIn/projetos) ou não houver evidência suficiente, informe isso claramente.
Formate respostas objetivas. Ao usar info do contexto, liste "Fontes" ao final (ex.: CV — chunk X).
Não invente nomes, datas ou números.
`.trim();

    const userPrompt = `
Pergunta do usuário:
${userMessage}

Contexto (trechos recuperados):
${contextText}
`.trim();

    // 3) Gera resposta
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "Sem resposta.";

    return NextResponse.json({
      answer,
      sources: results.map((r, i) => ({
        id: r.id,
        source: r.source,
        title: r.title ?? undefined,
        url: r.url ?? undefined,
        similarity: r.similarity ?? 0,
        i: i + 1,
      })),
    });
  } catch (e: unknown) {
    const err = e as Error;
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Erro interno." },
      { status: 500 }
    );
  }
}
