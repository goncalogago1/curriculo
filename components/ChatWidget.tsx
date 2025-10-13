// ChatWidget.tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Source = {
  id: number;
  i: number;
  label?: string;     // 👈 usar este
  title?: string;
  url?: string;
  source?: string;
  similarity?: number;
};

function normalizeAnswer(t: string) {
  return t
    .replace(/^\s*[\*\-]\s+/gm, "• ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/(^|[^*])\*(.*?)\*(?!\*)/g, "$1$2");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data: { answer?: string; sources?: Source[]; error?: string } = await res.json();

      if (data.answer) {
        const botText = normalizeAnswer(data.answer);     // 👈 limpa ** e bullets
        setMessages((prev) => [...prev, { role: "assistant", content: botText }]);
        setSources(data.sources ?? []);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error || "Error answering. Try again." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error calling /api/chat." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "Enter") send();
  }

  return (
    <>
      <button
        className="chatfab"
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "💬"}
      </button>

      {/* 👇 corrigido o template string */}
      <div
        className={`chatwidget ${open ? "chatwidget--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="CV Goncalo Gago Assistant"
      >
        <div className="chatwidget__header">
          <div className="chatwidget__title">CV Goncalo Gago Assistant</div>
          <button className="chatwidget__close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chatwidget__body">
          <div className="chatwidget__messages">
            {messages.length === 0 && <div className="chatwidget__empty">Ask about experience, projects, skills…</div>}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "bubble bubble--user" : "bubble bubble--bot"}>
                {m.content}
              </div>
            ))}

            {loading && <div className="bubble bubble--bot">Thinking…</div>}
          </div>

          {sources.length > 0 && (
            <div className="chatwidget__sources">
                <b>Sources:</b>{" "}
                {Array.from(
                new Set( // 🔥 remove duplicados
                    sources.map((s) =>
                    // simplifica label: remove “— chunk X”
                    (s.label || `Source #${s.i}`).replace(/ — chunk \d+$/, "")
                    )
                )
                ).map((label, idx, arr) => (
                <span key={label}>
                    {label}
                    {idx < arr.length - 1 ? "   " : ""}
                </span>
                ))}
            </div>
            )}
        </div>

        <div className="chatwidget__input">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your question…"
            aria-label="Message"
          />
          <button onClick={send} disabled={loading}>Send</button>
        </div>
      </div>
    </>
  );
}
