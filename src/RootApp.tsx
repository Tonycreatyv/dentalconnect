// src/RootApp.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Dashboard principal
import App from "./App";

// Configuración (Settings)
import SettingsPage from "./pages/Settings";

// Integraciones
import IntegrationsPage from "./pages/Integrations";

// ChatRoom – Inbox + Chat individual
import ChatInbox from "./chatroom/ChatInbox";
import ChatRoom from "./chatroom/ChatRoom";

export default function RootApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla principal del dashboard */}
        <Route path="/" element={<App />} />

        {/* ChatRoom */}
        <Route path="/chatroom" element={<ChatInbox />} />
        <Route path="/chatroom/:phone" element={<ChatRoom />} />

        {/* Configuración */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Integraciones */}
        <Route path="/integrations" element={<IntegrationsPage />} />

        {/* Rutas inexistentes → redirigir al dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
