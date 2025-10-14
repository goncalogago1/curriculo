// components/AudioToTextButton.tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;   // devolve o texto transcrito
  autoSend?: boolean;                      // se true, já chama onTranscript e “Enter”
};

export default function AudioToTextButton({ onTranscript, autoSend }: Props) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => { setRec(null); }; // cleanup
  }, []);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    chunksRef.current = [];
    mr.ondataavailable = e => e.data.size && chunksRef.current.push(e.data);
    mr.onstop = async () => {
      try {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const buf = await blob.arrayBuffer();

        const resp = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "audio/webm" },
          body: buf,
        });

        const data = await resp.json();
        const text = data?.text?.trim?.() || "";
        if (text) onTranscript(text);
      } catch (e) {
        console.error(e);
      } finally {
        // parar tracks do mic
        stream.getTracks().forEach(t => t.stop());
      }
    };
    mr.start();
    setRec(mr);
    setRecording(true);
  }

  function stop() {
    rec?.stop();
    setRecording(false);
  }

  return (
    <button
      type="button"
      aria-label={recording ? "Parar gravação" : "Gravar voz"}
      onClick={recording ? stop : start}
      className="mic-btn"
      title={recording ? "Parar" : "Falar e transcrever"}
    >
      {recording ? "⏹️" : "🎤"}
    </button>
  );
}
