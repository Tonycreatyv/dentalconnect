import { useContext } from "react";
import { WhatsappContext } from "../context/WhatsappContext";
import { createSession } from "../api/wpp";

export default function SessionQR() {
  const { qr, sessionReady } = useContext(WhatsappContext);

  return (
    <div>
      <button
        onClick={() => createSession("clinic1")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Generar QR
      </button>

      {qr && (
        <img
          src={qr}
          alt="QR Code"
          className="mt-4"
          style={{ width: 300 }}
        />
      )}

      {sessionReady && (
        <p className="text-green-500 mt-4">💚 Conectado correctamente</p>
      )}
    </div>
  );
}
