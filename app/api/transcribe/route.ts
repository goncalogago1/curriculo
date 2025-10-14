// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";
// TROCA TEMPORARIAMENTE p/ Node se estiveres em Vercel Edge:
export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN!;
const MODEL = "Systran/faster-whisper-small"; // <- HARD-CODE só p/ teste

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "application/octet-stream";
    const audio = await req.arrayBuffer();

    const url = `https://api-inference.huggingface.co/models/${MODEL}`;
    console.log("[transcribe] URL:", url);

    const resp = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": ct, Accept: "application/json" },
      body: audio,
    });

    const body = await resp.text();
    console.log("[transcribe] status:", resp.status, "ct:", resp.headers.get("content-type"));

    if (!resp.ok) {
      return NextResponse.json({ error: `HF error (${resp.status}): ${body.slice(0,200)}` }, { status: 502 });
    }
    try {
      const data = JSON.parse(body);
      const text = typeof data === "string" ? data : data?.text || "";
      return NextResponse.json({ text });
    } catch {
      return NextResponse.json({ text: body });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro a transcrever." }, { status: 500 });
  }
}
