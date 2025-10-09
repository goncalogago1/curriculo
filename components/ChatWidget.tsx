"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string; sources?: string[] };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    // Add user message directly
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? data.content ?? "(No response)",
          sources: data.sources ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
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
      {/* Floating Action Button */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        className="chatfab"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Chat Widget */}
      <section
        className={`chatwidget ${open ? "chatwidget--open" : ""}`}
        role="dialog"
        aria-label="Chat assistant"
      >
        <header className="chatwidget__header">
          <div className="chatwidget__title">CV Gonçalo Gago Assistant</div>
          <button
            className="chatwidget__close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="chatwidget__body">
          <div className="chatwidget__messages">
            {messages.length === 0 && (
              <div className="chatwidget__empty">
                Ask me anything about my CV ⭐
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`bubble ${
                  m.role === "user" ? "bubble--user" : "bubble--bot"
                }`}
              >
                {m.content}
                {m.sources && m.sources.length > 0 && (
                  <div className="chatwidget__sources">
                    sources: {m.sources.join(", ")}
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
              placeholder="Type your question..."
              aria-label="Message"
            />
            <button onClick={send} disabled={loading || !input.trim()}>
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
