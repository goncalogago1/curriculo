// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_TOKEN;
const MODEL = (process.env.HF_ASR_MODEL || "openai/whisper-large-v3").trim();
const PROVIDER = (process.env.HF_PROVIDER || "fal-ai").trim();

export async function POST(req: NextRequest) {
  try {
    if (!HF_TOKEN) {
      return NextResponse.json({ error: "Falta HF_TOKEN / HUGGINGFACE_API_TOKEN" }, { status: 500 });
    }

    const ct = req.headers.get("content-type") || "application/octet-stream";
    const audio = await req.arrayBuffer();

    const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(MODEL)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": ct,
        Accept: "application/json",
      },
      body: audio,
    });

    // Se o modelo estiver “acordando”
    if (resp.status === 503) {
      await new Promise(r => setTimeout(r, 4000));
      const retry = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": ct,
          Accept: "application/json",
        },
        body: audio,
      });
      const bodyRetry = await retry.text();
      if (!retry.ok) {
        return NextResponse.json(
          { error: `HF error (${retry.status}): ${bodyRetry.slice(0, 400)}` },
          { status: 502 }
        );
      }
      try {
        const data = JSON.parse(bodyRetry);
        const text = typeof data === "string" ? data : data?.text || "";
        return NextResponse.json({ text, modelUsed: MODEL, providerUsed: PROVIDER });
      } catch {
        return NextResponse.json({ text: bodyRetry, modelUsed: MODEL, providerUsed: PROVIDER });
      }
    }

    const body = await resp.text();

    if (!resp.ok) {
      // 404 aqui geralmente é repo_id errado OU provider não suporta o modelo
      return NextResponse.json(
        { error: `HF error (${resp.status}): ${body.slice(0, 400)} — url=${url}` },
        { status: 502 }
      );
    }

    try {
      const data = JSON.parse(body);
      const text = typeof data === "string" ? data : data?.text || "";
      return NextResponse.json({ text, modelUsed: MODEL, providerUsed: PROVIDER });
    } catch {
      return NextResponse.json({ text: body, modelUsed: MODEL, providerUsed: PROVIDER });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro a transcrever." }, { status: 500 });
  }
}
