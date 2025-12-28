import { useState } from "react";
import { WhatsAppConnectModal } from "../components/WhatsAppConnectModal";

export default function IntegrationsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Integraciones</h1>

      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">WhatsApp Business</h2>
        <p className="text-gray-600 mb-4">
          Conecta tu WhatsApp Business para que tus pacientes escriban a tu clínica.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Conectar WhatsApp
        </button>
      </div>

      {open && (
        <WhatsAppConnectModal
          clinicId="1"
          onClose={() => setOpen(false)}
          onConnected={() => setOpen(false)}
        />
      )}
    </div>
  );
}
