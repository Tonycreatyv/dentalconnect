import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ChatRoom from "./pages/ChatRoom";
import ChatInbox from "./pages/ChatInbox";

import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* CHAT */}
        <Route path="/chatinbox" element={<ChatInbox />} />
        
        {/* ESTA ES LA CORRECTA: ChatRoom necesita :phone */}
        <Route path="/chatroom/:phone" element={<ChatRoom />} />

        {/* SECCIONES DEL SISTEMA */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}
