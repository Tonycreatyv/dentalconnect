import { createContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";

interface IMessage {
  from: string;
  body: string;
}

interface IContext {
  qr: string | null;
  sessionReady: boolean;
  messages: IMessage[];
}

export const WhatsappContext = createContext<IContext>({
  qr: null,
  sessionReady: false,
  messages: [],
});

export function WhatsappProvider({ children }: { children: React.ReactNode }) {
  const [qr, setQr] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on("qr", (data) => {
      setQr(data.qr);
      setSessionReady(false);
    });

    socket.on("ready", () => {
      setSessionReady(true);
      setQr(null);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("qr");
      socket.off("ready");
      socket.off("message");
    };
  }, []);

  return (
    <WhatsappContext.Provider value={{ qr, sessionReady, messages }}>
      {children}
    </WhatsappContext.Provider>
  );
}
