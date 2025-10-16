"use client";
import { useEffect, useRef, useState } from "react";
import { blobToWav } from "@/lib/audioToWav";

type Props = { onTranscript: (text: string) => void; autoSend?: boolean; };

function pickSupportedMime() {
  const candidates = [
    "audio/ogg;codecs=opus", // Android às vezes aceita OGG (preferível ao WEBM)
    "audio/ogg",
    "audio/mp4",             // iOS
    "audio/webm;codecs=opus",
    "audio/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

export default function AudioToTextButton({ onTranscript, autoSend }: Props) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => () => setRec(null), []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickSupportedMime();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      console.log("[Audio] mimeType:", mr.mimeType || "(browser default)");

      chunksRef.current = [];
      mr.ondataavailable = e => e.data?.size && chunksRef.current.push(e.data);

      mr.onstop = async () => {
        const original = new Blob(chunksRef.current, { type: mr.mimeType || "application/octet-stream" });
        console.log("[Audio] blob:", original.type, original.size, "bytes");
        setBusy(true);
        try {
          // Se for webm (ou algo não suportado), converte para WAV
          const needsWav = /webm/i.test(original.type) || /unknown|octet-stream/i.test(original.type);
          const toSend = needsWav ? await blobToWav(original) : original;
          const contentType = needsWav ? "audio/wav" : (original.type || "application/octet-stream");
          console.log("[Audio] sending as:", contentType, toSend.size, "bytes");

          const resp = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": contentType },
            body: await toSend.arrayBuffer(),
          });

          const data = await resp.json().catch(async () => ({ text: await resp.text() }));
          if (!resp.ok) {
            console.error("[ASR] HTTP", resp.status, data);
            alert(`Falha na transcrição: ${data?.error || resp.statusText}`);
            return;
          }
          const text = (typeof data === "string" ? data : data?.text || "").trim();
          console.log("[ASR] text:", text);
          if (text) {
            onTranscript(text);
            if (autoSend) setTimeout(() => window.dispatchEvent(new CustomEvent("asr-autosend")), 50);
          } else {
            alert("Não veio texto da transcrição. Verifica modelo/provider.");
          }
        } catch (err) {
          console.error("[ASR] erro:", err);
          alert("Erro ao enviar para /api/transcribe (ver consola).");
        } finally {
          setBusy(false);
          // libertar o micro
          stream.getTracks().forEach(t => t.stop());
        }
      };

      mr.start();
      setRec(mr);
      setRecording(true);
    } catch (e) {
      console.error("[Audio] getUserMedia falhou:", e);
      alert("Não consegui aceder ao microfone. Confirma permissões/HTTPS.");
    }
  }

  function stop() {
    try { rec?.stop(); } finally { setRecording(false); }
  }

  return (
    <button
      type="button"
      className="mic-btn"
      disabled={busy}
      onClick={recording ? stop : start}
      title={recording ? "Parar" : "Gravar e transcrever"}
    >
      {busy ? "⏳" : recording ? "⏹️" : "🎤"}
    </button>
  );
}
