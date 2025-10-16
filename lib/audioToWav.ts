// lib/audioToWav.ts
export async function blobToWav(blob: Blob): Promise<Blob> {
    const arrayBuf = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuf = await audioCtx.decodeAudioData(arrayBuf.slice(0));
  
    const numChannels = audioBuf.numberOfChannels;
    const sampleRate = audioBuf.sampleRate;
    const numFrames = audioBuf.length;
  
    // interleave (ou write channel-by-channel) em PCM 16-bit
    const wavBuffer = encodeWAV(audioBuf, numChannels, sampleRate, numFrames);
    return new Blob([wavBuffer], { type: "audio/wav" });
  }
  
  function encodeWAV(audioBuffer: AudioBuffer, numChannels: number, sampleRate: number, numFrames: number) {
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
  
    // RIFF header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, "WAVE");
  
    // fmt  chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);     // subchunk1 size
    view.setUint16(20, 1, true);      // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);     // bits per sample
  
    // data chunk
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);
  
    // write PCM interleaved
    let offset = 44;
    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) channelData.push(audioBuffer.getChannelData(ch));
  
    for (let i = 0; i < numFrames; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let s = channelData[ch][i];
        s = Math.max(-1, Math.min(1, s));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
      }
    }
  
    return buffer;
  }
  
  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
  