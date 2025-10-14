"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;
  autoSend?: boolean;
};

function pickSupportedMime() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4", // iOS pode cair aqui (nem sempre via MediaRecorder)
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) {
      return c;
    }
  }
  return ""; // deixa o browser escolher
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

      console.log("[Audio]", "mimeType:", mimeType || "(browser default)");
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "application/octet-stream" });
        console.log("[Audio]", "final blob:", blob.type, blob.size, "bytes");
        setBusy(true);
        try {
          const resp = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": blob.type || "application/octet-stream" },
            body: await blob.arrayBuffer(),
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
            if (autoSend) {
              // pequeno atraso para o input atualizar antes de send()
              setTimeout(() => {
                const evt = new CustomEvent("asr-autosend");
                window.dispatchEvent(evt);
              }, 50);
            }
          } else {
            alert("Não veio texto da transcrição. Verifica o modelo/token do Hugging Face.");
          }
        } catch (err) {
          console.error("[ASR] erro:", err);
          alert("Erro ao enviar para /api/transcribe (ver consola).");
        } finally {
          setBusy(false);
          // libertar o micro
          stream.getTracks().forEach((t) => t.stop());
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
    try {
      rec?.stop();
    } finally {
      setRecording(false);
    }
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
