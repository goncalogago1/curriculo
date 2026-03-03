"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;
  autoSend?: boolean;
};

const isiOS = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  // iPadOS em desktop mode
  !(window as any).MSStream;

function pickSupportedMime() {
  const cands = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4", // em alguns iOS recentes pode gravar .mp4 (AAC)
  ];
  for (const c of cands) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

// ---- WAV encoder (16-bit PCM, mono) ----
function encodeWav(samples: Float32Array, sampleRate: number) {
  // Converte Float32 [-1,1] em PCM 16-bit LE
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) >> 3;
  const byteRate = sampleRate * blockAlign;

  // RIFF header
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true); // PCM header size
  view.setUint16(20, 1, true); // PCM = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);

  // PCM data
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}

export default function AudioToTextButton({ onTranscript, autoSend }: Props) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);

  // MediaRecorder state (desktop/Android)
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // WebAudio state (iOS)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcmBuffersRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef<number>(44100);

  useEffect(() => {
    return () => {
      // cleanup
      recRef.current = null;
      stopIOS();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopIOS() {
    try {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}
    processorRef.current = null;
    sourceRef.current = null;
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (isiOS()) {
        // ---- iOS path: captura PCM e encoda WAV ----
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
        sampleRateRef.current = ctx.sampleRate;

        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;

        // ScriptProcessor ainda é suportado no iOS Safari
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        pcmBuffersRef.current = [];
        processor.onaudioprocess = (e) => {
          const ch0 = e.inputBuffer.getChannelData(0);
          // copia o chunk
          pcmBuffersRef.current.push(new Float32Array(ch0));
        };

        source.connect(processor);
        processor.connect(ctx.destination); // necessário em iOS para disparar callback

        streamRef.current = stream;
        setRecording(true);
        return;
      }

      // ---- Outros browsers: MediaRecorder ----
      const mt = pickSupportedMime();
      const rec = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined);
      recRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      rec.start();
      setRecording(true);
    } catch (e) {
      console.error("[Audio] getUserMedia falhou:", e);
      alert("Não consegui aceder ao microfone. Confirma permissões/HTTPS.");
    }
  }

  async function stop() {
    setRecording(false);
    setBusy(true);
    try {
      let blob: Blob;
      let contentType: string;

      if (isiOS()) {
        // junta PCM e encoda WAV
        const buffers = pcmBuffersRef.current;
        const totalLen = buffers.reduce((acc, b) => acc + b.length, 0);
        const merged = new Float32Array(totalLen);
        let off = 0;
        for (const b of buffers) {
          merged.set(b, off);
          off += b.length;
        }
        blob = encodeWav(merged, sampleRateRef.current || 44100);
        contentType = "audio/wav";
        stopIOS();
      } else {
        // encerra MediaRecorder e cria blob
        const rec = recRef.current;
        const stream = rec?.stream;
        await new Promise<void>((resolve) => {
          if (!rec) return resolve();
          rec.onstop = () => resolve();
          rec.stop();
        });
        stream?.getTracks().forEach((t) => t.stop());
        blob = new Blob(chunksRef.current, { type: recRef.current?.mimeType || "application/octet-stream" });
        contentType = (recRef.current?.mimeType?.split(";")[0] || "application/octet-stream");
      }

      // Envia para a tua rota
      const buf = await blob.arrayBuffer();
      const resp = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: buf,
      });

      const data = await resp.json().catch(async () => ({ text: await resp.text() }));
      if (!resp.ok) {
        console.error("[ASR] HTTP", resp.status, data);
        alert(`Falha na transcrição: ${data?.error || resp.statusText}`);
        return;
      }
      const text = (typeof data === "string" ? data : data?.text || "").trim();
      if (text) {
        onTranscript(text);
        if (autoSend) {
          setTimeout(() => window.dispatchEvent(new CustomEvent("asr-autosend")), 50);
        }
      } else {
        alert("Não veio texto da transcrição.");
      }
    } catch (err) {
      console.error("[ASR] erro:", err);
      alert("Erro ao enviar o áudio (ver consola).");
    } finally {
      setBusy(false);
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
