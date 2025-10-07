"use client";

import { useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSources, setLastSources] = useState<any[]>([]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (data?.answer) {
        setMessages([...next, { role: "assistant", content: data.answer }]);
        setLastSources(data.sources ?? []);
      } else {
        setMessages([...next, { role: "assistant", content: "Erro ao responder." }]);
      }
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "Falha de rede ao chamar /api/chat." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      {/* Barra de topo */}
      <div className="chat-header">
        <Link href="/" className="back-link">
          ← Voltar para Início
        </Link>
        <h1>Assistente do Gonçalo</h1>
      </div>

      {/* Área do chat */}
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "msg user" : "msg assistant"}>
            <div className="bubble">
              <b>{m.role === "user" ? "Você" : "Assistente"}:</b> {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="msg assistant"><div className="bubble">Gerando resposta…</div></div>}
      </div>

      {/* Fontes */}
      {lastSources?.length > 0 && (
        <div className="sources">
          <b>Fontes:</b>{" "}
          {lastSources.map((s: any, i: number) => (
            <span key={s.id}>
              #{s.i} {s.title || s.source}
              {s.url ? ` (${s.url})` : ""}
              {i < lastSources.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Pergunte sobre experiência, projetos, skills..."
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
