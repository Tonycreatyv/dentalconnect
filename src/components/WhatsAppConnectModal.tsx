import { useEffect, useContext } from "react";
import { WhatsappContext } from "../context/WhatsappContext";
import { createSession } from "../api/wpp";

interface Props {
  clinicId: string;
  onClose: () => void;
  onConnected: () => void;
}

export function WhatsAppConnectModal({ clinicId, onClose, onConnected }: Props) {
  const { qr, sessionReady, clearQR } = useContext(WhatsappContext);
  const sessionId = `clinic-${clinicId}`;

  useEffect(() => {
    clearQR(); // limpiar QR previo
    createSession(sessionId); // iniciar session en el backend
  }, []);

  useEffect(() => {
    if (sessionReady) {
      setTimeout(onConnected, 1000);
    }
  }, [sessionReady]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* LOADING */}
        {!qr && !sessionReady && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando código QR...</p>
            <p className="text-xs text-gray-400 mt-2">
              Esto puede tardar unos segundos
            </p>
          </div>
        )}

        {/* QR LISTO */}
        {qr && !sessionReady && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Conecta WhatsApp</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Escanea con WhatsApp Business
            </p>

            <div className="bg-gray-50 p-6 rounded-xl mb-6 flex justify-center">
              <img
                src={qr}
                alt="QR Code"
                className="w-full max-w-[280px] mx-auto rounded-lg"
              />
            </div>

            <div className="text-center mt-4 text-sm text-gray-500">
              <div className="inline-flex items-center gap-2">
                <div className="animate-pulse">⏳</div>
                <span>Esperando escaneo…</span>
              </div>
            </div>
          </div>
        )}

        {/* WHATSAPP CONECTADO */}
        {sessionReady && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              ¡WhatsApp conectado!
            </h2>
            <p className="text-gray-600">Todo listo para recibir mensajes</p>
          </div>
        )}
      </div>
    </div>
  );
}
