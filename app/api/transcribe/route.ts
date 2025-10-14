// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
const MODEL = process.env.HUGGINGFACE_ASR_MODEL || "distil-whisper/distil-large-v3";

export async function POST(req: NextRequest) {
  try {
    if (!HF_TOKEN) {
      return NextResponse.json({ error: "Falta HUGGINGFACE_API_TOKEN" }, { status: 500 });
    }

    const ct = req.headers.get("content-type") || "application/octet-stream";
    const audio = await req.arrayBuffer();

    const url = `https://api-inference.huggingface.co/models/${MODEL}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": ct,
        Accept: "application/json",
      },
      body: audio,
    });

    // 503 = modelo a acordar
    if (resp.status === 503) {
      await new Promise(r => setTimeout(r, 4000));
      return await POST(req); // re-tenta 1x
    }

    const textBody = await resp.text();

    if (!resp.ok) {
      // 404 normalmente = modelo não encontrado (repo_id errado)
      const hint =
        resp.status === 404
          ? `Modelo '${MODEL}' não encontrado. Confere o repo_id exatamente como está no Hugging Face (ex.: distil-whisper/distil-large-v3).`
          : "";
      return NextResponse.json(
        { error: `HF error (${resp.status}): ${textBody.slice(0, 300)} ${hint}`.trim() },
        { status: 502 }
      );
    }

    // Tenta JSON, senão devolve texto puro
    try {
      const data = JSON.parse(textBody);
      const text = typeof data === "string" ? data : data?.text || "";
      return NextResponse.json({ text });
    } catch {
      return NextResponse.json({ text: textBody });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro a transcrever." }, { status: 500 });
  }
}
