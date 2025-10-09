"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; sources?: string[] };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll sempre que entra nova msg
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const answer: Msg = {
        role: "assistant",
        content: data.answer ?? data.content ?? "(no response)",
        sources: data.sources ?? [],
      };
      setMessages((m) => [...m, answer]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Desculpa, houve um problema a responder agora. Tenta novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <>
      {/* FAB */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        className="chatfab"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "💬"}
      </button>

      {/* WIDGET */}
      <section className={`chatwidget ${open ? "chatwidget--open" : ""}`} role="dialog" aria-label="Chat assistant">
        <header className="chatwidget__header">
          <div className="chatwidget__title">CV Gonçalo Gago Assistant</div>
          <button className="chatwidget__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
        </header>

        <div className="chatwidget__body">
          <div className="chatwidget__messages" id="chat-scroll">
            {messages.length === 0 && (
              <div className="chatwidget__empty">
                Pergunta qualquer coisa sobre o meu CV ⭐
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`bubble ${m.role === "user" ? "bubble--user" : "bubble--bot"}`}
                role="article"
              >
                {m.content}
                {m.sources && m.sources.length > 0 && (
                  <div className="chatwidget__sources">
                    fontes: {m.sources.join(", ")}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="chatwidget__input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Escreve a tua pergunta…"
              aria-label="Message"
            />
            <button onClick={send} disabled={loading || !input.trim()}>
              {loading ? "…" : "Enviar"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
