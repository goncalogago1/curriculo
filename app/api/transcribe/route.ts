// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // funciona bem com fetch + arrayBuffer

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
const MODEL = process.env.HUGGINGFACE_ASR_MODEL || "distil-whisper/distil-large-v3";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("audio/") && !contentType.includes("application/octet-stream")) {
      return NextResponse.json({ error: "Envie áudio (webm/wav/m4a/mp3/ogg)." }, { status: 400 });
    }

    const audioBuffer = await req.arrayBuffer();

    const resp = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "audio/webm", // ok para webm do MediaRecorder; ajuste se enviar wav/mp3
      },
      body: audioBuffer,
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => resp.statusText);
      return NextResponse.json({ error: `HF error: ${msg}` }, { status: 500 });
    }

    // Alguns modelos devolvem { text: "..." }, outros string pura
    const data = await resp.json().catch(async () => ({ text: await resp.text() }));
    const text = typeof data === "string" ? data : (data?.text ?? "");

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro a transcrever." }, { status: 500 });
  }
}
