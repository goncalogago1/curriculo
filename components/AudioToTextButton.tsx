"use client";
import { useEffect, useRef, useState } from "react";

type Props = { onTranscript: (text: string) => void; autoSend?: boolean };

function pickSupportedMime() {
  const cands = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const c of cands) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

// ---- Helpers: resample p/ 16k mono e codificar WAV PCM16 ----
async function blobToWavPCM16(blob: Blob, targetSampleRate = 16000): Promise<Blob> {
  const arrayBuf = await blob.arrayBuffer();

  // 1) decodifica com WebAudio
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const decoded = await audioCtx.decodeAudioData(arrayBuf.slice(0));
  // 2) resample p/ 16k mono com OfflineAudioContext
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * targetSampleRate), targetSampleRate);
  const src = offline.createBufferSource();

  // mix down para mono
  const mono = offline.createBuffer(1, decoded.length, decoded.sampleRate);
  const chData = mono.getChannelData(0);
  const ch0 = decoded.getChannelData(0);
  if (decoded.numberOfChannels > 1) {
    const ch1 = decoded.getChannelData(1);
    for (let i = 0; i < decoded.length; i++) chData[i] = (ch0[i] + ch1[i]) * 0.5;
  } else {
    chData.set(ch0);
  }

  src.buffer = mono;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();

  // 3) codifica WAV PCM16
  const wavBuffer = encodeWavPCM16(rendered);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

function encodeWavPCM16(buf: AudioBuffer): ArrayBuffer {
  const numChannels = 1;
  const sampleRate = buf.sampleRate;
  const samples = buf.getChannelData(0);
  const dataLen = samples.length * 2; // 16-bit
  const headerLen = 44;
  const totalLen = headerLen + dataLen;
  const out = new ArrayBuffer(totalLen);
  const dv = new DataView(out);

  // RIFF header
  writeStr(dv, 0, "RIFF");
  dv.setUint32(4, 36 + dataLen, true);
  writeStr(dv, 8, "WAVE");
  writeStr(dv, 12, "fmt ");
  dv.setUint32(16, 16, true);     // PCM chunk size
  dv.setUint16(20, 1, true);      // PCM format
  dv.setUint16(22, numChannels, true);
  dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  dv.setUint16(32, numChannels * 2, true); // block align
  dv.setUint16(34, 16, true);     // bits per sample
  writeStr(dv, 36, "data");
  dv.setUint32(40, dataLen, true);

  // PCM16
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    dv.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return out;
}

function writeStr(dv: DataView, offset: number, s: string) {
  for (let i = 0; i < s.length; i++) dv.setUint8(offset + i, s.charCodeAt(i));
}
// ------------------------------------------------------------

export default function AudioToTextButton({ onTranscript, autoSend }: Props) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => () => setRec(null), []);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = pickSupportedMime();
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];

    mr.ondataavailable = (e) => e.data?.size && chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "application/octet-stream" });
      setBusy(true);
      try {
        // 👇 CONVERTE p/ WAV, compatível com mobile + provider
        const wavBlob = await blobToWavPCM16(blob, 16000);

        // envia em multipart/form-data (alguns providers preferem)
        const fd = new FormData();
        fd.append("file", wavBlob, "audio.wav");

        const resp = await fetch("/api/transcribe", {
          method: "POST",
          body: fd, // 👈 sem Content-Type manual — o browser define boundary
        });

        const data = await resp.json().catch(async () => ({ text: await resp.text() }));
        if (!resp.ok) throw new Error(data?.error || "Falha no ASR");

        const text = (typeof data === "string" ? data : data?.text || "").trim();
        if (text) {
          onTranscript(text);
          if (autoSend) setTimeout(() => window.dispatchEvent(new CustomEvent("asr-autosend")), 50);
        } else {
          alert("Não veio texto da transcrição.");
        }
      } catch (e: any) {
        console.error(e);
        alert("Falha na transcrição (ver consola).");
      } finally {
        setBusy(false);
        stream.getTracks().forEach((t) => t.stop());
      }
    };

    mr.start();
    setRec(mr);
    setRecording(true);
  }

  function stop() {
    try { rec?.stop(); } finally { setRecording(false); }
  }

  return (
    <button type="button" className="mic-btn" disabled={busy} onClick={recording ? stop : start}>
      {busy ? "⏳" : recording ? "⏹️" : "🎤"}
    </button>
  );
}
