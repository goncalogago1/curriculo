// app/chat/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import AudioToTextButton from "@/components/AudioToTextButton"; // topo do ficheiro


type Source = { id: number; i: number; label?: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

function normalizeAnswer(t: string) {
  return t
    .replace(/^\s*[\*\-]\s+/gm, "• ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/(^|[^*])\*(.*?)\*(?!\*)/g, "$1$2");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function h() { send(); }
    window.addEventListener("asr-autosend", h);
    return () => window.removeEventListener("asr-autosend", h);
  }, [messages, input]); // send lê do estado atual
  
  async function send() {
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      const reply: Msg = {
        role: "assistant",
        content: normalizeAnswer(data?.answer ?? "…"),   // 👈 limpa ** e bullets
        sources: (data?.sources ?? []) as Source[],      // 👈 objetos com label
      };
      setMessages((m) => [...m, reply]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Try again in a moment or email me at goncalogago@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main className="chat-container">
      <div className="chat-header">
        <a className="back-link" href="/">← Back to portfolio</a>
        <h1>Assistant</h1>
      </div>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">
              {m.content}
              {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                  <b>Sources:</b>{" "}
                  {Array.from(
                    new Set(
                      (m.sources ?? [])
                        .map((s) => s.label || `Source #${s.i}`)
                        // remove " — chunk X" (suporta em dash e hyphen)
                        .map((lbl) => lbl.replace(/\s?[—-]\s?chunk\s+\d+$/i, ""))
                    )
                  ).map((label, idx, arr) => (
                    <span key={label}>
                      {label}
                      {idx < arr.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <AudioToTextButton
          onTranscript={(t) => {
            // cola o texto transcrito no input
            setInput((prev) => (prev ? prev + " " + t : t));

            // se quiser auto-enviar quando terminar a transcrição:
            // setTimeout(() => send(), 50);
          }}
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask anything about my skills, projects, CV…"
        />

        <button onClick={send} disabled={loading || !input.trim()}>
          {loading ? "…" : "Send"}
        </button>
      </div>
    </main>
  );
}
