// src/pages/ChatRoom.tsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// ===============================
// CONFIG: PRODUCCIÓN
// ===============================
const socket = io("https://socket.creatyv.io", {
  transports: ["websocket"],
});

const API = "https://api.creatyv.io";

export default function ChatRoom() {
  const { phone } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ===========================
  // CARGAR HISTORIAL + SOCKET
  // ===========================
  useEffect(() => {
    if (!phone) return;

    fetch(`${API}/messages/${phone}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []));

    socket.emit("join_chat", phone);

    socket.on("message_from_phone", (msg) => {
      if (msg.from === phone) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing_from_phone", (data) => {
      if (data.from === phone) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    });

    return () => {
      socket.off("message_from_phone");
      socket.off("typing_from_phone");
    };
  }, [phone]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const msg = input;
    setInput("");

    await fetch(`${API}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "clinic1",
        number: phone,
        message: msg,
      }),
    });

    setMessages((prev) => [
      ...prev,
      { from: "clinic", body: msg, timestamp: new Date().toISOString() },
    ]);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Chat con {phone}</h2>
        {typing && <p className="text-green-400 text-sm">Escribiendo...</p>}
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-sm p-3 rounded-xl ${
              msg.from === "clinic"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {msg.body}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-700 flex gap-3">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit("typing_to_phone", { to: phone });
          }}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-600"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
