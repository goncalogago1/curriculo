// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
const MODEL = process.env.HUGGINGFACE_ASR_MODEL || "distil-whisper/distil-large-v3";

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "application/octet-stream";
    const audioBuffer = await req.arrayBuffer();

    if (!HF_TOKEN) {
      return NextResponse.json({ error: "Falta HUGGINGFACE_API_TOKEN" }, { status: 500 });
    }

    const hf = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": ct,
      },
      body: audioBuffer,
    });

    // 503 = modelo a carregar. Podemos tentar uma 2ª tentativa simples.
    if (hf.status === 503) {
      const wait = Number(hf.headers.get("x-compute-time")) || 3000;
      await new Promise((r) => setTimeout(r, Math.min(wait * 1000, 8000)));
      const hf2 = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": ct,
        },
        body: audioBuffer,
      });
      if (!hf2.ok) {
        const msg = await hf2.text().catch(() => hf2.statusText);
        return NextResponse.json({ error: `HF 2ª tentativa: ${msg}` }, { status: 502 });
      }
      const d2 = await hf2.json().catch(async () => ({ text: await hf2.text() }));
      const t2 = typeof d2 === "string" ? d2 : d2?.text || "";
      return NextResponse.json({ text: t2 });
    }

    if (!hf.ok) {
      const msg = await hf.text().catch(() => hf.statusText);
      return NextResponse.json({ error: `HF error: ${msg}` }, { status: 502 });
    }

    const data = await hf.json().catch(async () => ({ text: await hf.text() }));
    const text = typeof data === "string" ? data : (data?.text ?? "");
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro a transcrever." }, { status: 500 });
  }
}
