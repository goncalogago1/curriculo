// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_TOKEN;
const MODEL = (process.env.HF_ASR_MODEL || process.env.HUGGINGFACE_ASR_MODEL || "openai/whisper-large-v3").trim();
const PROVIDER = (process.env.HF_PROVIDER || "fal-ai").trim();

export async function POST(req: NextRequest) {
  try {
    if (!HF_TOKEN) {
      return NextResponse.json(
        { error: "Falta HF_TOKEN / HUGGINGFACE_API_TOKEN" },
        { status: 500 }
      );
    }

    // Suporta:
    // 1) multipart/form-data (ex.: mobile envia WAV via FormData)
    // 2) corpo bruto (ArrayBuffer) com Content-Type já definido
    const reqCT = req.headers.get("content-type") || "";
    let forwardBody: ArrayBuffer;
    let forwardCT = "application/octet-stream";

    if (reqCT.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "FormData sem 'file'." }, { status: 400 });
      }
      const blob = file as Blob;

      // ⚠️ Alguns providers (ex.: fal-ai) NÃO aceitam webm/opus.
      // Se vier webm/opus, isto vai falhar no provider. Por isso, no cliente
      // deves enviar WAV (conversão já mostrei no AudioToTextButton).
      if ((blob.type || "").includes("webm")) {
        return NextResponse.json(
          {
            error:
              'O provider não aceita "audio/webm;codecs=opus". Envia WAV. ' +
              'No cliente, converte para WAV (PCM16 16k mono) e faz POST em FormData (file=audio.wav).',
          },
          { status: 415 }
        );
      }

      forwardBody = await blob.arrayBuffer();
      forwardCT = blob.type || "audio/wav"; // WAV é o alvo recomendado
    } else {
      // Corpo bruto: encaminha com o mesmo CT
      forwardBody = await req.arrayBuffer();
      forwardCT = reqCT || "application/octet-stream";
    }

    const url =
      `https://api-inference.huggingface.co/models/` +
      `${encodeURIComponent(MODEL)}?provider=${encodeURIComponent(PROVIDER)}`;

    const doFetch = async () =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": forwardCT,
          Accept: "application/json",
        },
        body: forwardBody,
      });

    let resp = await doFetch();

    // 503 = modelo “a acordar” → tenta 1x de novo
    if (resp.status === 503) {
      await new Promise((r) => setTimeout(r, 4000));
      resp = await doFetch();
    }

    const textBody = await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: `HF error (${resp.status}): ${textBody.slice(0, 400)}`,
          modelUsed: MODEL,
          providerUsed: PROVIDER,
          forwardedContentType: forwardCT,
        },
        { status: 502 }
      );
    }

    // Tenta JSON, senão devolve texto cru
    try {
      const data = JSON.parse(textBody);
      const text = typeof data === "string" ? data : data?.text || "";
      return NextResponse.json({
        text,
        modelUsed: MODEL,
        providerUsed: PROVIDER,
        forwardedContentType: forwardCT,
      });
    } catch {
      return NextResponse.json({
        text: textBody,
        modelUsed: MODEL,
        providerUsed: PROVIDER,
        forwardedContentType: forwardCT,
      });
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro a transcrever." },
      { status: 500 }
    );
  }
}
