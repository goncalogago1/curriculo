"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string; sources?: string[] };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

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
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] }),
      });
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
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="chat-container">
      <header className="chat-header">
        <a className="back-link" href="/">
          ← Back to portfolio
        </a>
        <h1>Assistant</h1>
      </header>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">
              {m.content}
              {m.sources && m.sources.length > 0 && (
                <div className="sources">
                  sources: {m.sources.join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything about my CV..."
          aria-label="Message"
        />
        <button onClick={send} disabled={loading || !input.trim()}>
          {loading ? "…" : "Send"}
        </button>
      </div>
    </main>
  );
}
