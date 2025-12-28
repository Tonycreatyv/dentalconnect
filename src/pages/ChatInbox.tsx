// src/pages/ChatInbox.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

// ===============================
// CONFIG: PRODUCCIÓN
// ===============================
const socket = io("https://socket.creatyv.io", {
  transports: ["websocket"],
});

const API = "https://api.creatyv.io";

interface Conversation {
  phone: string;
  lastMessage: string;
  updatedAt: string;
  unread?: number;
}

export default function ChatInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // ================================
  // CARGAR INBOX INICIAL + SOCKET
  // ================================
  useEffect(() => {
    fetch(`${API}/conversations`)
      .then((res) => res.json())
      .then((data) => setConversations(data || []));

    socket.on("incoming_message", (msg) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.phone === msg.from);

        if (existing) {
          return prev.map((c) =>
            c.phone === msg.from
              ? {
                  ...c,
                  lastMessage: msg.body,
                  updatedAt: new Date().toISOString(),
                  unread: (c.unread || 0) + 1,
                }
              : c
          );
        }

        return [
          {
            phone: msg.from,
            lastMessage: msg.body,
            updatedAt: new Date().toISOString(),
            unread: 1,
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.off("incoming_message");
    };
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 h-screen">
      <h1 className="text-2xl font-bold mb-4">ChatRoom</h1>

      <div className="space-y-3">
        {conversations.map((c) => (
          <Link
            to={`/chatroom/${c.phone}`}
            key={c.phone}
            className="block p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{c.phone}</span>
              {c.unread ? (
                <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                  {c.unread}
                </span>
              ) : null}
            </div>

            <p className="text-gray-400 text-sm truncate">{c.lastMessage}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
